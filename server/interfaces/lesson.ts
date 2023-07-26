export interface attributes {
    mpes1: boolean;
    mpes2: boolean;
}

export interface lessonAPI {
    classNo: string; // "16G"
    startTime: string; // "1600"
    endTime: string; // "1800"
    weeks: number[]; // [1, 2, 3, ..., 13]
    venue: string; //"COM1-B103"
    day: string; // "Friday"
    lessonType: string; // "Laboratory"
    size: number; // 10
    covidZone: string; // "B"
}

export interface lessonFixed extends lesson {
    fixed: boolean;
}

export interface lessonChosen extends lesson {
    chosen: boolean;
}

export interface lessonFixedChosen extends lesson {
    fixed: boolean;
    chosen: boolean;
    constraintFixed: boolean;
}

// JSON structure returned from personal database
export default interface lesson {
    id: number;
    lessonId: string;
    moduleCode: string;
    lessonType: string;
    ay: number;
    sem: number;
    weeks: number[];
    venue: string;
    day: string;
    startTime: string;
    endTime: string;
    size: number;
}
