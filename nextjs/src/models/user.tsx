export default interface user {
    username: string;
    email: string,
    photo: {
        type: string;
        data: Array<number>;
    };
}

export interface userWithoutEmail {
    username: string;
    photo: {
        type: string,
        data: Array<number>;
    }
}
