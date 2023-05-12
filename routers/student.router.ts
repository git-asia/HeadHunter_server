import {Request, Response, Router} from "express";
import {StudentRecord} from "../records/student.record";

export const studentRouter = Router();

studentRouter

    .get('/all', async (req, res) => {
        const {...data } = req.query;        
        const studentsShortinfo = await StudentRecord.getFilteredAll(data);
        res.json(studentsShortinfo);
    })

    .patch('/status', async (req, res) => {
        const {action,studentId, hrId = null}:UpdateStatus = req.body;
        const message = await StudentRecord.statusChange(action,studentId,hrId);
        res.status(200).json({ success: true, message: message });
    })

    
    .get('/getcv/:studentId', async (req, res) => {
        const studentId = req.params.studentId

        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

    .get('/test', (req, res) => {
        res.send({
        be: 'is working 🥳'
        });
    })


