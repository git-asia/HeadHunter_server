import { Router } from "express";
import { UserRecord } from "../records/user.record";

export const userRouter = Router();

// zalogowany hrowiec
userRouter

.get('/short/:studentId', async (req, res) => {
    const studentsShortinfo = await UserRecord.studentShortInfo(req.params.studentId);

    res.json(
        studentsShortinfo[0]
       );
})