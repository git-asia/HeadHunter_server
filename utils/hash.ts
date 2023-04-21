import express from "express";
import bcrypt from 'bcrypt';
import { ValidationError } from "./errors";


export const hashPassword= async (password: string, salt: string): Promise<string> => {
  try {
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (err) {
    throw new ValidationError("Coś poszło nie tak");
  }
}



export const newHashPassword = async (password:string) =>{

    const salt = bcrypt.genSaltSync(10);
    const hash = await hashPassword(password, salt)
    return {password: hash, salt: salt}


}



