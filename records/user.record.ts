import {FieldPacket} from "mysql2";
import {UserEntity} from "../types/user.entity";
import {ValidationError} from "../utils/errors";
import {pool} from "../config/db-sample";
import {v4 as uuid} from "uuid";
import {RegistrationTokenEntity} from "../types/registration-token.entity";

type UserRecordResult = [UserRecord[], FieldPacket[]];
type RegistrationTokenResult = [RegistrationTokenEntity[], FieldPacket[]];

export class UserRecord implements UserEntity {
    userId: string;
    email: string;
    password: string;
    authToken: string;
    userState: number;

    constructor(obj: UserEntity) {
        if (!obj.email) {
            throw new ValidationError("Adres e-mail jest konieczny");
        }
        if (!obj.email.includes('@')) {
            throw new ValidationError("To nie jest prawidłowy adres e-mail");
        }
        this.userId = obj.userId;
        this.email = obj.email;
        this.password = obj.password;
        this.authToken = obj.authToken;
        this.userState = obj.userState;
    }

    static async checkToken(token: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT * FROM `registration_tokens` WHERE `registrationToken` = :token", {
            token,
        })) as RegistrationTokenResult;
        if (results.length === 0) {
            throw new ValidationError('Nie ma takiego tokena');
        }
        return (results[0].tokenExpiresOn).getTime() < Date.now() ? null : results[0].userId;
    }

    static async checkEmail(email: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `userId` FROM `users` WHERE `email` = :email", {
            email,
        })) as UserRecordResult;
        return results.length === 0 ? null : results[0].userId;
    }

    static async addToken(id: string): Promise<void> {
        let newToken, isThisToken;
        do {
            newToken = uuid();
            const [results] = await pool.execute("SELECT `userId` FROM `registration_tokens` WHERE `registrationToken` = :token", {
                token: newToken,
            }) as UserRecordResult;
            isThisToken = results.length;
        } while (isThisToken > 0)
        const [results] = (await pool.execute("SELECT `userId` FROM `registration_tokens` WHERE `userId` = :userId", {
            userId: id,
        })) as RegistrationTokenResult;
        if (results.length > 0) {
            await pool.execute("DELETE FROM `registration_tokens` WHERE `userId` = :userId", {
                userId: id,
            });
        }
        await pool.execute("INSERT INTO `registration_tokens` (`userId`, `registrationToken`, `tokenExpiresOn`) VALUES (:userId, :token, ADDDATE(NOW(), INTERVAL 1 DAY))", {
            userId: id,
            token: newToken,
        });
    }

    static async updatePassword(id: string, hashPassword: string): Promise<void> {
        await pool.execute("UPDATE `users` SET `password` = :hashPassword WHERE `userId` = :id", {
            hashPassword,
            id,
        });
        await pool.execute("DELETE FROM `registration_tokens` WHERE `userId` = :id", {
            id,
        });

    }

}