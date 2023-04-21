import { UserEntity } from "../types";
import { UserRecord } from "../records/user.record";
import bcrypt from "bcrypt";
import { ValidationError } from "./errors";

export const checkPassword = async (newParams: UserRecord)=>{
   if(newParams.checkPasswordStrength())
   {
     const user:UserEntity|null = await UserRecord.getOne(newParams.mail);
     if(user === null){
       throw new ValidationError('Podany został nie prawidłowy adres e-mail')
     }
      try {
        return await bcrypt.compare(newParams.password, user.password);
      } catch (err) {
        console.error(err.message);
        throw new ValidationError("Wystąpił błąd przy próbie logowania");
      }
    }else{
      throw new ValidationError("Hasło nie spełnia wymagań bezpieczeństwa.")
    }

}
