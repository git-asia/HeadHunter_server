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
    this.id = obj.id
    this.mail = obj.mail
    this.password = obj.password;
    this.salt = obj.password;
      }



}