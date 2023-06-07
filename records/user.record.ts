import { ValidationError } from '../utils/errors';
import { RegistrationTokenEntity, UserEntity } from '../types';
import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';

export class UserRecord implements  UserEntity {

    userId?: string;
    email: string;
    password?: string
    authToken?: string
    userState?: number

    constructor(obj: UserEntity) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!obj.email) {
            throw new ValidationError('Adres e-mail jest wymagany');
        } else if (!regex.test(obj.email)) {
            throw new ValidationError('To nie jest prawidłowy adres e-mail');
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

        await pool('users').insert({
            userId: this.userId,
            email: this.email,
            password: this.password,
            authToken: this.authToken,
            userState: this.userState
        }).then(() => {
            console.log('Użytkownik został dodany');
        }).catch(() => {
            throw new ValidationError('Dodanie użytkownika zakończone niepowodzeniem.')
        });
    }

    async hashPassword(password: string, salt: string): Promise<string> {
        try {
            return await bcrypt.hash(password, salt);
        } catch (err) {
            throw new ValidationError('Coś poszło nie tak');
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

    static async getOne(email: string):Promise<UserRecord | null> {

        const results = await pool('users')
            .select('*')
            .where('email', email)
            .first() as UserEntity;
        return results ? new UserRecord(results) : null;

    }

    async checkPassword() {
        if (this.checkPasswordStrength()) {
            const user: UserRecord | null = await UserRecord.getOne(this.email);
            if (user === null) {
                throw new ValidationError('Podany został nie prawidłowy adres e-mail');
            }
            try {
                if (await bcrypt.compare(this.password, user.password)){
                    return {
                        id: user.userId,
                        state: user.userState
                    }

                }
                else{
                    throw new ValidationError('Dane logowanie są niepoprawne.');
                }
            } catch (err) {
                console.error(err.message);
                throw new ValidationError('Wystąpił błąd przy próbie logowania');
            }
        } else {
            throw new ValidationError('Hasło nie spełnia wymagań bezpieczeństwa.')
        }
    }

    static async checkToken(token: string): Promise<string | null> {

        const results = await pool('registration_tokens')
            .select('*')
            .where('registrationToken',token)
            .first() as RegistrationTokenEntity

        if (results === null) {
            return('Błąd: brak tokena!');
        }
        return (results.tokenExpiresOn).getTime() < Date.now() ? null : results.userId;
    }

    static async checkEmail(email: string): Promise<string | null> {

        const results = await pool('users')
            .select('userId')
            .where('email',email)
            .first() as { userId:string }

        return results === null ? null : results.userId;
    }

    static async addToken(id: string): Promise<string> {
        let newToken, isThisToken;
        do {
            newToken = uuid();
            const results = await  pool('registration_tokens')
                .select('userId')
                .where('registrationToken',newToken) as UserRecord[];
            // const [results] = await pool.execute('SELECT `userId` FROM `registration_tokens` WHERE `registrationToken` = :token', {
            //     token: newToken,
            // }) as UserRecordResult;
            isThisToken = results.length;
        } while (isThisToken > 0)
        const results = await pool('registration_tokens')
            .select('userId')
            .where('userId',id) as RegistrationTokenEntity[];
        // const [results] = (await pool.execute('SELECT `userId` FROM `registration_tokens` WHERE `userId` = :userId', {
        //     userId: id,
        //  })) as RegistrationTokenResult;
        if (results.length > 0) {
            await pool('registration_tokens')
                .where('userId', id)
                .del();
            // await pool.execute('DELETE FROM `registration_tokens` WHERE `userId` = :userId', {
            //     userId: id,
            // });
        }
        await pool('registration_tokens')
            .insert({
                userId: id,
                registrationToken: newToken,
                tokenExpiresOn: pool.raw('ADDDATE(NOW(), INTERVAL 1 DAY)'),
            })
        // await pool.execute('INSERT INTO `registration_tokens` (`userId`, `registrationToken`, `tokenExpiresOn`) VALUES (:userId, :token, ADDDATE(NOW(), INTERVAL 1 DAY))', {
        //     userId: id,
        //     token: newToken,
        // });
        return newToken;
    }

    static async updatePassword(id: string, hashPassword: string): Promise<void> {
        await pool('users')
            .where('userId', id)
            .update({ password: hashPassword });

        await pool('registration_tokens')
            .where('userId',id)
            .del();
        // await pool.execute('DELETE FROM `registration_tokens` WHERE `userId` = :id', {
        //     id,
        // });
    }

    static async updateEmail(id: string, email: string): Promise<void> {
        await pool('user')
            .where('userId',id)
            .update({ email });
        // await pool.execute('UPDATE `users` SET `email` = :email WHERE `userId` = :id', {
        //     email,
        //     id,
        // });
    }

    static async updateStudentStatus(studentId: string, userStatus: number): Promise<void> {

        await pool('students')
            .where({ studentId })
            .update({ userStatus })
        // await pool.execute('UPDATE `students` SET `userStatus` = :userStatus WHERE `studentId` = :studentId', {
        //     studentId,
        //     userStatus,
        // });
    }

    static async getEmail(userId: string): Promise<string> {
        const results = await  pool('users')
            .select('email')
            .where({ userId })
            .first() as { email: string };
        // const [results] = await pool.execute('SELECT `email` FROM `users` WHERE `userId`=:id', { id }) as UserRecordResult;

        return results === null ? null : results.email;

    }
}