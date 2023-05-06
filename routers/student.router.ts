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

    .post('/reserved', async (req, res) => {
        const [] = req.body; //wartości filtrów
        // post przyjmuje formularz z filtrami wybranymi przez użytkownika wylistowanie
        // wszystkich zarezerwowanych kursantów + data z bazy + 10dni (makieta4)
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

