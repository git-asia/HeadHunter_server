import {Request, Response, Router} from "express";
import { UserRecord } from "../records/user.record";
import { UserEntity } from "../types";
import { ValidationError } from "../utils/errors";


export const userRouter = Router()
  .post("/login", async (req: Request, res: Response) => {
    const params= {...req.body,id: '',} as UserEntity;
    const newParams = new UserRecord(params);

     if(await newParams.checkPassword()){
         console.log('Dane logowania są prawidłowe');
         //TODO: miejsce na ustawienie tokena passport
     }else{
         throw new ValidationError("Błędne hasło")
     }

  });
