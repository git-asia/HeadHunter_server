import {Request, Response, Router} from "express";
import {UserRecord} from "../records/user-record";
import {ValidationError} from "../utils/errors";
import {hash} from "bcrypt";

export const userRouter = Router();

userRouter

    .get("/token/:token", async (req: Request, res: Response) => {
        const userId: string | null = await UserRecord.checkToken(req.params.token);
        res.json(userId);
    })

    .patch("/newpass", async (req: Request, res: Response) => {
        const {id, pass, pass2} = req.body;
        const user: UserRecord | null = await UserRecord.getOneUser(id);
        if (user === null) {
            throw new ValidationError('Nie ma takiego ID');
        }
        if (pass !== pass2) {
            throw new ValidationError('Hasła są różne');
        }
        user.pass = await hash(pass, 10);
        await user.updatePassword();
        res.json(user);
    });