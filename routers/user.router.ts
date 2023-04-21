import {Request, Response, Router} from "express";
import { UserRecord } from "../records/user.record";
import { UserEntity } from "../types";
import { checkPassword } from "../utils/checkPassword";
import { ValidationError } from "../utils/errors";


export const userRouter = Router()
  .post("/login/:mail/:password", async (req: Request, res: Response) => {
    const params= {...req.params,id: '',salt: '',} as UserEntity;
    const newParams = new UserRecord(params);

     if(await checkPassword(newParams)){
         console.log('Dane logowania są prawidłowe');
         //TODO: miejsce na ustawienie tokena passport
     }else{
         throw new ValidationError("Błędne hasło")
     }



  });