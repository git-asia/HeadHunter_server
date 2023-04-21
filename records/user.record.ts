import { UserEntity } from "../types";
import {ValidationError} from "../utils/errors";

import {FieldPacket} from "mysql2";
import { pool } from "../config/db";
import bcrypt from "bcrypt";


type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements  UserEntity{

  id: string;
  mail: string;
  password:string;
  salt: string;

  constructor(obj: UserEntity) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!obj.mail) {
      throw new ValidationError("Adres e-mail jest wymagany");
    }else if (!regex.test(obj.mail)  || obj.mail.length < 5) {
      throw new ValidationError("To nie jest prawidłowy adres e-mail");
    }


    this.id = obj.id
    this.mail = obj.mail
    this.password = obj.password;
    this.salt = obj.salt;

  }

    async hashPassword(password: string, salt: string): Promise<string>{
      try {
        return await bcrypt.hash(password, salt);
      } catch (err) {
        throw new ValidationError("Coś poszło nie tak");
      }
    }

    async newHashPassword(password:string){
      const salt = bcrypt.genSaltSync(10);
      const hash = await this.hashPassword(password, salt)
      return {password: hash, salt: salt}
    }


    checkPasswordStrength(){
      const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/; // cyfra/mała litera/duża litera/znakspecjalny/min 8 znaków
      return passwordRegex.test(this.password);
    }

    static async getOne(mail: string):Promise<UserEntity| null> {
      const [results] =await pool.execute("SELECT * FROM `users` WHERE mail=:mail", { mail }) as UserRecordResults;
      return results.length === 0 ? null : new UserRecord(results[0] as UserEntity)

    }
}