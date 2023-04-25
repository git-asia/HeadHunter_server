import { UserEntity } from "../types";
import {ValidationError} from "../utils/errors";

import {FieldPacket} from "mysql2";
import { pool } from "../config/db";
import bcrypt from "bcrypt";


type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements  UserEntity {

  id: string;
  email: string;
  password: string;


  constructor(obj: UserEntity) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!obj.email) {
      throw new ValidationError("Adres e-mail jest wymagany");
    } else if (!regex.test(obj.email) || obj.mail.length < 5) {
      throw new ValidationError("To nie jest prawidłowy adres e-mail");
    }


    this.id = obj.id
    this.email = obj.email
    this.password = obj.password;

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

  async getOne(email: string): Promise<UserEntity | null> {
    const [results] = await pool.execute("SELECT * FROM `users` WHERE email=:email", { email }) as UserRecordResults;
    return results.length === 0 ? null : new UserRecord(results[0] as UserEntity)

  }

  async checkPassword() {
    if (this.checkPasswordStrength()) {
      const user: UserEntity | null = await this.getOne(this.email);
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

}
