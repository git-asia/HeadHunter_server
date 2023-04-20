import {FieldPacket} from "mysql2";
import {UserEntity} from "../types/user.entity";
import {ValidationError} from "../utils/errors";
import {pool} from "../config/db-sample";

type UserRecordResult = [UserRecord[], FieldPacket[]];

export class UserRecord implements UserEntity {
    public id: string;
    public name: string;
    public email: string;
    public token: string;

    constructor(obj: UserEntity) {
        if (!obj.name || obj.name.length < 3 || obj.name.length > 50) {
            throw new ValidationError("Imię musi mieć od 3 do 50 znaków.");
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
        this.token = obj.token;
    }

    static async checkToken(token: string): Promise<string | null> {
        const [results] = (await pool.execute("SELECT `id` FROM `users` WHERE `token` = :token", {
            token,
        })) as UserRecordResult;
        console.log(results);
        return results.length === 0 ? null : results[0].id;
    }
}