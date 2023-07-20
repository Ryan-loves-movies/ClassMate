import user, { userWithoutEmail } from '@interfaces/user';

export default interface group {
    id: number;
    moduleCode: string;
    name: string;
    color: string;
}

export interface groupWithUsers {
    id: number;
    moduleCode: string;
    name: string;
    color: string;
    users: user[];
}

export interface groupWithUsersNoEmail {
    id: number;
    moduleCode: string;
    name: string;
    color: string;
    users: userWithoutEmail[];
}
