import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

//
// @todo SET SECRET KEY IN .env file - MUSIMY USTALIĆ SEKRETNY KLUCZ DO TWORZENIA I ODCZYTYWANIA TOKENÓW I PRZECHOWYWAĆ GO w pliku .env
// import dotenv from "dotenv";
// dotenv.config();

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // SPRAWDZANIE POPRAWNOSCI TOKENU, ROZKODOWANIE PAYLOADU I PRZEKAZANIE DO NASTEPNEGO MIDDLEWARE'A
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).end();

    jwt.verify(token, /* @todo process.env.secret_key*/ 'SEKRET', (err, data) => {
        if (err) return res.status(403).end()
        req.user = data;
        next()
    });

}