import { UserEntity } from "../types";
import {ValidationError} from "../utils/errors";

import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';




type AdRecordResults = [UserEntity[], FieldPacket[]];

export class userRecord implements  UserEntity{

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
    this.salt = obj.password;
      }



}