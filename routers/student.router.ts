import { Router } from "express";
import {StudentRecord} from "../records/student.record";

export const studentRouter = Router();

studentRouter

    .get('/all', async (req, res) => {
        const {...data } = req.query;        
        const studentsShortinfo = await StudentRecord.getFilteredAll(data);
        res.json(studentsShortinfo);
    })

    .post('/reserved', async (req, res) => {
        const [] = req.body; //wartości filtrów
        // post przyjmuje formularz z filtrami wybranymi przez użytkownika wylistowanie
        // wszystkich zarezerwowanych kursantów + data z bazy + 10dni (makieta4)
    })

    
    .get('/getcv/:studentId', async (req, res) => {
        const studentId = req.params.studentId

        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

