import { Router } from 'express';
import { HrRecord } from '../records/hr.record';

export const hrRouter = Router();

hrRouter

    .get('/name/:id', async (req, res) => {
        const hrId = req.params.id;
        const { fullName } = (await HrRecord.getName(hrId))[0];
        console.log(fullName);
        res.json(fullName);
    })