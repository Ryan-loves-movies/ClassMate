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

// JSON structure returned from personal database
export default interface lesson {
    id: number;
    lessonId: string;
    moduleCode: string;
    lessonType: string;
    sem: number;
    weeks: number[];
    day: string;
    startTime: string;
    endTime: string;
}
