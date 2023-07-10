import lesson,{ lessonAPI, attributes } from "@models/lesson";

export interface moduleAPI {
    acadYear: string; // "2021/2022"
    preclusion: string; // "CS2030S"
    description: string; // "This module is a follow up to CS1010. It explores two modern programming paradigms,
    title: string; // "Programming Methodology II"
    department: string; //"Computer Science"
    faculty: string; // "Computing"
    workload: number[]; // [2, 1, 2, 3, 2]
    prerequisite: string; // "CS1010 or its equivalent"
    moduleCredit: string; // "4"
    moduleCode: string; // "CS2030"
    attributes: attributes;
    semesterData: {
        semester: number; // 1
        timetable: lessonAPI[];
    }[];
    prereqTree: string; // "CS1010"
    fulfillRequirements: string[]; // ["CS2102", ...]
}

// JSON structure returned from personal database
export default interface module {
    code: string;
    name: string;
}

export interface moduleWithLessons {
    code: string;
    name: string;
    lessons: lesson[];
}

export interface modDet {
    code: string;
    day: string;
    startTime: string;
    endTime: string;
}

export interface modType {
    code: string;
    lecture: modDet;
    tutorial: modDet;
    lab: modDet;
}
