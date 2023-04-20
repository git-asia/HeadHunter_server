import {Request, Response, Router} from "express";
import {UserRecord} from "../records/user-record";

export const userRouter = Router();

userRouter

    .get("/token/:token", async (req: Request, res: Response) => {
        const userId: string | null = await UserRecord.checkToken(req.params.token);
        res.json(userId);
    });