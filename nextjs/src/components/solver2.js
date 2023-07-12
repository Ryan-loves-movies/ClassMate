import Z3 from "../../node_modules/z3javascript/src/Z3.js";

/** @param users: fullUser[] - The lessons field should consist of all valid lessons that can be taken by each user
 */
export default function timetableGenerator(users, commonModule) {
  const ctxt = new Z3.Context();
  const solver = new Z3.Solver(ctxt, false, []);

  // Add boolVar, startTimeVar, endTimeVar to each lesson. THERE MUST BE A COMMON MODULE
  const commonModuleLessons = users[0].modules.find(
    (user_mod) => user_mod.code === commonModule.code,
  );
  const commonLessonTypes = [
    ...new Set(commonModuleLessons?.lessons.map((less) => less.lessonType)),
  ];
  const modUsers = {
    users: users.map((user) => {
      return {
        username: user.username,
        modules: user.modules
          .filter((user_mod) => user_mod.code !== commonModule.code)
          .map((user_mod) => {
            const lessonTypes = [
              ...new Set(
                user_mod.lessons.map((less) => less.lessonType),
              ),
            ];
            return {
              code: user_mod.code,
              name: user_mod.name,
              lessons: lessonTypes.map((lessonType) => {
                return user_mod.lessons
                  .filter(
                    (less) => less.lessonType === lessonType,
                  )
                  .map((less) => {
                    const boolVar = ctxt.mkIntVar(
                      `${user.username}_${user_mod.code}_${less.id}_bool`,
                    );
                    const startTimeVar = ctxt.mkIntVar(
                      `${user.username}_${user_mod.code}_${less.id}_startTime`,
                    );
                    const endTimeVar = ctxt.mkIntVar(
                      `${user.username}_${user_mod.code}_${less.id}_endTime`,
                    );
                    solver.add(
                      ctxt.mkOr(
                        ctxt.mkEq(1),
                        boolVar.eq(1),
                      ),
                      ctxt.mkIte(
                        ctxt.mkEq(boolVar, 0),
                        ctxt.mkEq(startTimeVar, 0),
                        ctxt.mkEq(
                          startTimeVar,
                          parseInt(less.startTime),
                        ),
                      ),
                      ctxt.mkIte(
                        ctxt.mkEq(boolVar, 0),
                        ctxt.mkEq(endTimeVar, 0),
                        ctxt.mkEq(
                          endTimeVar,
                          parseInt(less.endTime),
                        ),
                      ),
                    );
                    return {
                      ...less,
                      startTimeVar: startTimeVar,
                      endTimeVar: endTimeVar,
                      boolVar: boolVar,
                    };
                  });
              }),
            };
          }),
      };
    }),
    commonModule: {
      code: commonModule.code,
      lessons: commonLessonTypes.map((lessType) => {
        return commonModuleLessons.lessons
          .filter((less) => less.lessonType === lessType)
          .map((less) => {
            const boolVar = ctxt.mkIntVar(
              `${commonModule.code}_${less.id}_bool`,
            );
            const startTimeVar = ctxt.mkIntVar(
              `${commonModule.code}_${less.id}_startTime`,
            );
            const endTimeVar = ctxt.mkIntVar(
              `${commonModule.code}_${less.id}_endTime`,
            );
            solver.add(
              ctxt.mkOr(ctxt.mkEq(1), boolVar.eq(1)),
              ctxt.mkIte(
                ctxt.mkEq(boolVar, 0),
                ctxt.mkEq(startTimeVar, 0),
                ctxt.mkEq(
                  startTimeVar,
                  parseInt(less.startTime),
                ),
              ),
              ctxt.mkIte(
                ctxt.mkEq(boolVar, 0),
                ctxt.mkEq(endTimeVar, 0),
                ctxt.mkEq(endTimeVar, parseInt(less.endTime)),
              ),
            );
            return {
              ...less,
              startTimeVar: startTimeVar,
              endTimeVar: endTimeVar,
              boolVar: boolVar,
            };
          });
      }),
    },
  };

  // Constraint 1: Must have only 1 lesson for each lesson type
  modUsers.users.forEach((modUser) => {
    modUser.modules.forEach((specificMod) => {
      specificMod.lessons.forEach((lessType) => {
        const initial = lessType[0].boolVar;
        const lessTypeSum = lessType
          .slice(1)
          .reduce(
            (firstLess, secLess) => ctxt.mkAdd(firstLess, secLess.boolVar),
            initial,
          );
        solver.add(lessTypeSum.eq(1));
      });
    });
  });
  modUsers.commonModule.lessons.forEach((lessType) => {
    const initial = lessType[0].boolVar;
    const lessTypeSum = lessType
      .slice(1)
      .reduce(
        (firstLess, secLess) => ctxt.mkAdd(firstLess, secLess.boolVar),
        initial,
      );
    solver.add(lessTypeSum.eq(1));
  });

  // Constraint 2: No overlap in time slots for the modules not shared by the group
  modUsers.users.forEach((modUser) => {
    for (let modInd = 0; modInd < modUser.modules.length; modInd++) {
      const specificMod = modUser.modules[modInd];

      // Presume that lesson types of modules will never clash
      specificMod.lessons.forEach((lessType) => {
        lessType.forEach((less) => {
          // Check with each and every lesson for every other module
          for (
            let nextModInd = modInd + 1;
            nextModInd < modUser.modules.length;
            nextModInd++
          ) {
            const nextSpecificMod = modUser.modules[nextModInd];

            nextSpecificMod.lessons.forEach((nextLessType) => {
              nextLessType.forEach((nextLess) => {
                solver.add(
                  ctxt.mkOr(
                    ctxt.mkOr(
                      ctxt.mkEq(less.boolVar, 0),
                      ctxt.mkEq(nextLess.boolVar, 0),
                    ),
                    ctxt.mkOr(
                      ctxt.mkLe(
                        less.endTimeVar,
                        nextLess.startTimeVar,
                      ),
                      ctxt.mkGe(
                        less.startTimeVar,
                        nextLess.endTimeVar,
                      ),
                    ),
                  ),
                );
              });
            });
          }
          // Add constraint for common module as well
          modUsers.commonModule.lessons.forEach((nextLessType) => {
            nextLessType.forEach((nextLess) => {
              solver.add(
                ctxt.mkOr(
                  ctxt.mkOr(
                    ctxt.mkEq(less.boolVar, 0),
                    ctxt.mkEq(nextLess.boolVar, 0),
                  ),
                  ctxt.mkOr(
                    ctxt.mkLe(
                      less.endTimeVar,
                      nextLess.startTimeVar,
                    ),
                    ctxt.mkGe(
                      less.startTimeVar,
                      nextLess.endTimeVar,
                    ),
                  ),
                ),
              );
            });
          });
        });
      });
    }
  });

  solver.check().then((result) => {
    if (result === "sat") {
      console.log(solver.model());
    } else {
      console.log("No valid timetable exists for the group.");
    }
  });
}
