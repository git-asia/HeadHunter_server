import {Request, Response, Router} from "express";


export const userRouter = Router()
  .post("/login/:mail/:password", async (req: Request, res: Response) => {
    const {mail,password} = req.params;
  });