export interface UserEntity {
    userId: string;
    email: string;
    password: string;
    authToken: string;
    userState: number;
}