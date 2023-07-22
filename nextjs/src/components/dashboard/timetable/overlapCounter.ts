import { lessonFixedChosen } from '@models/lesson';
import { moduleWithLessonsFixedChosen } from '@models/module';

interface moduleWithLessonsWithColor extends moduleWithLessonsFixedChosen {
    color: string;
}

interface lessonsOrdered extends lessonFixedChosen {
    color: string;
    order: number;
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function overlapCounter(
    activities: moduleWithLessonsWithColor[]
): { overlaps: number; lessons: lessonsOrdered[] }[] {
    const flattenedLessons = activities.flatMap((activity) => {
        return activity.lessons.map((less) => {
            return {
                ...less,
                color: activity.color
            };
        });
    });

    const lessonsByDay = days.map((day) =>
        flattenedLessons.filter((less) => less.day === day)
    );

    const sortedTimesPerDay = lessonsByDay.map((day) =>
        day
            .flatMap((activity) => [
                {
                    time: parseInt(activity.startTime),
                    overlap: 1,
                    less: activity
                },
                {
                    time: parseInt(activity.endTime),
                    overlap: -1,
                    less: activity
                }
            ])
            .sort((firstLess, secLess) => {
                const firstDiff = firstLess.time - secLess.time;
                if (firstDiff === 0) {
                    // Should reach endTime first before moving to startTime
                    if (firstLess.overlap === -1) {
                        return -1;
                    } else if (secLess.overlap === -1) {
                        return 1;
                    } else {
                        // Longest activity should always take lowest order
                        const firstActLength =
                            parseInt(firstLess.less.endTime) -
                            parseInt(firstLess.less.startTime);
                        const secActLength =
                            parseInt(secLess.less.endTime) -
                            parseInt(secLess.less.startTime);
                        return -(firstActLength - secActLength);
                    }
                }
                return firstDiff;
            })
    );

    return sortedTimesPerDay.map((day, index: number) => {
        let counter = 0;
        let maxOverlaps = 0;
        const lessonsForDay: lessonsOrdered[] = [];

        day.forEach((less) => {
            counter += less.overlap;
            if (less.overlap === 1) {
                lessonsForDay.push({
                    ...less.less,
                    order: counter
                } as lessonsOrdered);
            }
            maxOverlaps = Math.max(counter, maxOverlaps);
        });

        return {
            overlaps: Math.max(maxOverlaps, 1),
            lessons: lessonsForDay
        };
    });
}
