import { Request, Response } from 'express';
import { UserRecord } from '../records/user.record';
import { v4 as uuid } from 'uuid';
import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userController = async (req: Request, res: Response) => {
    //POBRANIE ZDEKODOWANEJ WARTOSCI (MAILA) Z TOKENU I SPRAWDZENIE CZY UZYTKOWNIK Z TAKIM MAILEM ISTNIEJE
    const { email } = req.user as { email: string };
    const { email: userEmail } = await UserRecord.getOne(email);
    res.json({ userEmail })
}