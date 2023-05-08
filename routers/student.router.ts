import {Request, Response, Router} from "express";
import {StudentRecord} from "../records/student.record";

export const studentRouter = Router();

// zalogowany kursant

studentRouter

    .post('/all', async (req, res) => {
        const [] = req.body; //wartości filtrów
        // post przyjmuje formularz z filtrami wybranymi przez użytkownika wylistowanie
        // wszystkich dostępnych kursantów (makieta2)
    })

    .patch('/status', async (req, res) => {
        const {action,studentId, hrId = null}:UpdateState = req.body;
        await StudentRecord.statusChange(action,studentId,hrId)
    })

    .get('/short/:studentId', async (req, res) => {
    const studentsShortinfo = await StudentRecord.studentShortInfo(
        req.params.studentId
    );
    res.json(studentsShortinfo[0]);
})
    
    .get('/getcv/:studentId', async (req, res) => {
        const studentId = req.params.studentId

        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

