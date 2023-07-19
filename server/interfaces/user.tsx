export default interface user {
    username: string;
    email: string;
    photo: {
        type: string;
        data: Array<number>;
    };
}

export interface userCreator {
    username: string;
    email: string;
    password: string;
    photo: {
        type: string;
        data: string[];
    };
}

export interface userLogIn {
    username: string;
    password: string;
}

export interface userWithoutEmail {
    username: string;
    photo: {
        type: string;
        data: Array<number>;
    };
}

export interface userWithoutEmailPhoto {
    username: string;
}
