import {FieldPacket} from "mysql2";
import {UserEntity} from "../types/user.entity";
import {ValidationError} from "../utils/errors";
import {pool} from "../config/db-sample";
import {v4 as uuid} from "uuid";

type UserRecordResult = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
    public id: string;
    public name: string;
    public email: string;
    public pass: string;
    public token: string;
    public expirationDate: Date;


    constructor(obj: UserEntity) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 50) {
            throw new ValidationError("Nazwa musi mieć od 3 do 50 znaków.");
        }
        if (!obj.email) {
            throw new ValidationError("Adres e-mail jest konieczny");
        }
        if (!obj.email.includes('@')) {
            throw new ValidationError("To nie jest prawidłowy adres e-mail");
        }
        this.id = obj.id;
        this.name = obj.name;
        this.email = obj.email;
        this.pass = obj.pass;
        this.token = obj.token;
        this.expirationDate = obj.expirationDate;
    }

    static async checkToken(token: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `id` FROM `users` WHERE `token` = :token", {
            token,
        })) as UserRecordResult;
        console.log(results);
        return results.length === 0 ? null : results[0].id;
    }

    static async checkEmail(email: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `id` FROM `users` WHERE `email` = :email", {
            email,
        })) as UserRecordResult;
        return results.length === 0 ? null : results[0].id;
    }

    static async addToken(id: string): Promise<void> {
        await pool.execute("UPDATE `users` SET `token` = :token, `expirationDate` = ADDDATE(NOW(), INTERVAL 1 DAY) WHERE `id` = :id", {
            id,
            token: uuid(),
        });
    }

    static async getOneUser(id: string): Promise<UserRecord | null> {
        const [results] = (await pool.execute("SELECT * FROM `users` WHERE `id` = :id", {
            id,
        })) as UserRecordResult;
        return results.length === 0 ? null : new UserRecord(results[0]);
    }

    async updatePassword(): Promise<void> {
        await pool.execute("UPDATE `users` SET `pass` = :pass, `expirationDate` = ADDDATE(NOW(), INTERVAL 1 DAY) WHERE `id` = :id", {
            pass: this.pass,
            id: this.id,
        });
    }

}