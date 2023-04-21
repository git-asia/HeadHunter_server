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

        const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

        if (user === null) {
            throw new ValidationError('Nie ma takiego ID');
        }
        if (!passwordRegex.test(pass)) {
            throw new ValidationError('Hasło musi mieć co najmniej 8 znaków, składać się z dużych i małych liter, cyfr i znaków specjalnych');
        }
        if (pass !== pass2) {
            throw new ValidationError('Hasła są różne');
        }
        user.pass = await hash(pass, 10);
        await user.updatePassword();
        res.json(user);
    });