// import { UserEntity } from "../types";
import {ValidationError} from "../utils/errors";

import {FieldPacket} from "mysql2";
import bcrypt from "bcrypt";
import { pool } from "../config/db-sample";
import { UserEntity } from "../types";


type UserRecordResults = [UserEntity[], FieldPacket[]];

export class UserRecord implements  UserEntity {

  id: string;
  mail: string;
  password: string;


  static async studentShortInfo(id:string): Promise<UserRecord[]> {
    const [results] = await pool.execute("SELECT `courseCompletion`, `courseEngagment`, `projectDegree`,`teamProjectDegree`,`expectedTypeWork`,`targetWorkCity`,`expectedContractType`,`expectedSalary`,`canTakeApprenticeship`,`monthsOfCommercialExp` FROM `students` WHERE `studentId` = :id",{
        id
    }) as UserRecordResults;
    return results;
}
}