import { ValidationError } from '../utils/errors';
import { RegistrationTokenEntity, UserEntity } from '../types';
import { FieldPacket } from 'mysql2';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

type UserRecordResult = [UserRecord[], FieldPacket[]];
type RegistrationTokenResult = [RegistrationTokenEntity[], FieldPacket[]];

export class UserRecord implements  UserEntity {

    userId?: string;
    email: string;
    password?: string
    authToken?: string
    userState?: number

    constructor(obj: UserEntity) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!obj.email) {
            throw new ValidationError("Adres e-mail jest wymagany");
        } else if (!regex.test(obj.email)) {
            throw new ValidationError("To nie jest prawidłowy adres e-mail");
        }
        this.userId = obj.userId;
        this.email = obj.email;
        this.password = obj.password;
        this.authToken = obj.authToken;
        this.userState = obj.userState;
    }
    async insert():Promise<void>{
        this.password = null;
        this.authToken = null;
        this.userState = 0;

        await pool.execute("INSERT INTO `users`(`userId`, `email`, `password`, `authToken`, `userState`) VALUES (:userId, :email, :password, :authToken, :userState)", this);
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        try {
            return await bcrypt.hash(password, salt);
        } catch (err) {
            throw new ValidationError("Coś poszło nie tak");
        }
    }

    async newHashPassword(password: string) {
        const salt = bcrypt.genSaltSync(10);
        const hash = await this.hashPassword(password, salt)
        return { password: hash, salt: salt }
    }


    checkPasswordStrength() {
        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/; // cyfra/mała litera/duża litera/znakspecjalny/min 8 znaków
        return passwordRegex.test(this.password);
    }

    static async getOne(email: string): Promise<UserEntity | null> {
        const [results] = await pool.execute("SELECT * FROM `users` WHERE `email`=:email", { email }) as UserRecordResult;
        return results.length === 0 ? null : new UserRecord(results[0] as UserEntity)

    }

    async checkPassword() {
        if (this.checkPasswordStrength()) {
            const user: UserEntity | null = await UserRecord.getOne(this.email);
            if (user === null) {
                throw new ValidationError('Podany został nie prawidłowy adres e-mail')
            }
            try {
                return await bcrypt.compare(this.password, user.password);
            } catch (err) {
                console.error(err.message);
                throw new ValidationError("Wystąpił błąd przy próbie logowania");
            }
        } else {
            throw new ValidationError("Hasło nie spełnia wymagań bezpieczeństwa.")
        }
    }

    static async checkToken(token: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT * FROM `registration_tokens` WHERE `registrationToken` = :token", {
            token,
        })) as RegistrationTokenResult;
        if (results.length === 0) {
            return('Błąd: brak tokena!');
        }
        return (results[0].tokenExpiresOn).getTime() < Date.now() ? null : results[0].userId;
    }

    static async checkEmail(email: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `userId` FROM `users` WHERE `email` = :email", {
            email,
        })) as UserRecordResult;
        return results.length === 0 ? null : results[0].userId;
    }

    static async addToken(id: string): Promise<string> {
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
        return newToken;
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


    static async updateEmail(id: string, email: string): Promise<void> {
        await pool.execute("UPDATE `users` SET `email` = :email WHERE `userId` = :id", {
            email,
            id,
        });
    }


    static async updateStudentStatus(studentId: string, userStatus: number): Promise<void> {
        await pool.execute("UPDATE `students` SET `userStatus` = :userStatus WHERE `studentId` = :studentId", {
            studentId,
            userStatus,
        });
    }

    static async getEmail(id: string): Promise<string> {
        const [results] = await pool.execute("SELECT `email` FROM `users` WHERE `userId`=:id", { id }) as UserRecordResult;
        return results[0].email;
    }
}