import { Variable, Constraint, Strength, Solver } from '@lume/kiwi';
import { userWithoutEmail, userWithoutEmailPhoto } from '@models/user';
import group from '@models/group';
import module from '@models/module';
import lesson from '@models/lesson';
import axios from 'axios';

interface moduleWithLesson extends module {
    lessons: lesson[];
}

interface fullUser extends userWithoutEmailPhoto {
    modules: moduleWithLesson[];
}

interface Module {
    id: string;
    lectureStart: number;
    lectureEnd: number;
    tutorialStart: number;
    tutorialEnd: number;
}

interface Group {
    users: User[];
    modules: Module[];
}

function solveTimetable(
    students: userWithoutEmailPhoto[],
): Record<string, number> {

    // Retrieve all the necessary information first
    const fullStudents = students.map((student) => {
        return axios.get
    })

    const solver = new Solver();
    const userTimeslots: Record<string, Variable> = {};

    // Create variables for each user's timeslot
    for (const group of groups) {
        for (const user of group.users) {
            for (const module of modules) {
                const timeslotVar = new Variable();
                userTimeslots[`${user.id}-${module.id}`] = timeslotVar;
                solver.addEditVariable(timeslotVar, Strength.required);
            }
        }
    }

    // Add constraints for same lecture and tutorial slots for modules shared by the group
    for (const group of groups) {
        const sharedModules = group.modules;
        for (const module of sharedModules) {
            const timeslots = group.users.map(
                (user) => userTimeslots[`${user.id}-${module.id}`]
            );
            for (let i = 1; i < timeslots.length; i++) {
                const constraint = new Constraint(
                    timeslots[i - 1],
                    timeslots[i],
                    Strength.required
                );
                solver.addConstraint(constraint);
            }
        }
    }

    // Add constraints for non-overlapping timeslots of lecture and tutorial slots for each user
    for (const group of groups) {
        for (const user of group.users) {
            const userModules = modules.filter((module) =>
                user.modules.includes(module.id)
            );
            for (let i = 0; i < userModules.length; i++) {
                const module1 = userModules[i];
                const timeslot1 = userTimeslots[`${user.id}-${module1.id}`];
                for (let j = i + 1; j < userModules.length; j++) {
                    const module2 = userModules[j];
                    const timeslot2 = userTimeslots[`${user.id}-${module2.id}`];
                    const lecture1Constraint = new Constraint(
                        timeslot1,
                        timeslot1,
                        Strength.required
                    );
                    const lecture2Constraint = new Constraint(
                        timeslot2,
                        timeslot2,
                        Strength.required
                    );
                    const tutorial1Constraint = new Constraint(
                        timeslot1,
                        timeslot1,
                        Strength.required
                    );
                    const tutorial2Constraint = new Constraint(
                        timeslot2,
                        timeslot2,
                        Strength.required
                    );

                    // Add constraints for non-overlapping lecture timeslots
                    solver.addConstraint(
                        lecture1Constraint.suggestValue(
                            module1.lectureStart,
                            Strength.required
                        )
                    );
                    solver.addConstraint(
                        lecture1Constraint.suggestValue(
                            module1.lectureEnd,
                            Strength.required
                        )
                    );
                    solver.addConstraint(
                        lecture2Constraint.suggestValue(
                            module2.lectureStart,
                            Strength.required
                        )
                    );
                    solver.addConstraint(
                        lecture2Constraint.suggestValue(
                            module2.lectureEnd,
                            Strength.required
                        )
                    );

                    // Add constraints for non-overlapping tutorial timeslots
                    solver.addConstraint(
                        tutorial1Constraint.suggestValue(
                            module1.tutorialStart,
                            Strength.required
                        )
                    );
                    solver.addConstraint(
                        tutorial1Constraint.suggestValue(
                            module1.tutorialEnd,
                            Strength.required
                        )
                    );
                    solver.addConstraint(
                        tutorial2Constraint.suggestValue(
                            module2.tutorialStart,
                            Strength.required
                        )
                    );
                    solver.addConstraint(
                        tutorial2Constraint.suggestValue(
                            module2.tutorialEnd,
                            Strength.required
                        )
                    );
                }
            }
        }
    }

    // Solve the constraints
    solver.updateVariables();
    solver.resolve();

    // Retrieve the solved timeslots
    const solvedTimeslots: Record<string, number> = {};
    for (const [key, timeslot] of Object.entries(userTimeslots)) {
        solvedTimeslots[key] = timeslot.value();
    }

    return solvedTimeslots;
}

// Example usage
const groups: Group[] = [
    {
        users: [
            { id: 'user1', modules: ['module1', 'module2'] },
            { id: 'user2', modules: ['module1', 'module3'] },
            { id: 'user3', modules: ['module2', 'module3'] }
        ],
        modules: [
            {
                id: 'module1',
                lectureStart: 8,
                lectureEnd: 10,
                tutorialStart: 14,
                tutorialEnd: 16
            },
            {
                id: 'module2',
                lectureStart: 9,
                lectureEnd: 11,
                tutorialStart: 16,
                tutorialEnd: 18
            },
            {
                id: 'module3',
                lectureStart: 10,
                lectureEnd: 12,
                tutorialStart: 14,
                tutorialEnd: 16
            }
        ]
    }
];

const modules: Module[] = [
    {
        id: 'module1',
        lectureStart: 8,
        lectureEnd: 10,
        tutorialStart: 14,
        tutorialEnd: 16
    },
    {
        id: 'module2',
        lectureStart: 9,
        lectureEnd: 11,
        tutorialStart: 16,
        tutorialEnd: 18
    },
    {
        id: 'module3',
        lectureStart: 10,
        lectureEnd: 12,
        tutorialStart: 14,
        tutorialEnd: 16
    }
];

const solvedTimeslots = solveTimetable(groups, modules);
console.log(solvedTimeslots);
