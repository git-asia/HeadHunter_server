import {Router} from "express";
import {StudentRecord} from "../records/studenter.record";

export const studentRouter = Router();

studentRouter.get('/short/:studentId', async (req, res) => {
    const studentsShortinfo = await StudentRecord.studentShortInfo(
        req.params.studentId
    );

    res.json(studentsShortinfo[0]);
})