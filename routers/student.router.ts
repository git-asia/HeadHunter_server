import {Request, Response, Router} from "express";
import {StudentRecord} from "../records/student.record";
import {UserRecord} from "../records/user.record";

export const studentRouter = Router();

// zalogowany kursant

studentRouter

    .post('/all', async (req, res) => {
        const [] = req.body; //wartości filtrów
        // post przyjmuje formularz z filtrami wybranymi przez użytkownika wylistowanie
        // wszystkich dostępnych kursantów (makieta2)
    })

    .patch('/status', async (req, res) => {
        const {action,studentId, hrId = null}:UpdateStatus = req.body;
        const message = await StudentRecord.statusChange(action,studentId,hrId);
        res.status(200).json({ success: true, message: message });;
    })

    .get('/short/:studentId', async (req, res) => {
    const studentsShortinfo = await StudentRecord.studentShortInfo(
        req.params.studentId
    );
    res.json(studentsShortinfo[0]);
})
    
    .get('/getcv/:studentId', async (req, res) => {
        const studentId = req.params.studentId;
        const data = await StudentRecord.getCvOneStudent(studentId);
        res.json(data);
        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

    .patch('/changedata', async (req: Request, res: Response) => {
        const {studentId, firstName, lastName, phoneNumber, githubUsername, portfolioUrls, projectUrls, bio, expectedTypeWork, targetWorkCity, expectedContractType, expectedSalary, canTakeApprenticeship, monthsOfCommercialExp, education, workExperience, courses, bonusProjectUrls} = req.body;

        const data: string = await StudentRecord.updateData(studentId, firstName, lastName, phoneNumber, githubUsername, portfolioUrls, projectUrls, bio, expectedTypeWork, targetWorkCity, expectedContractType, expectedSalary, canTakeApprenticeship, monthsOfCommercialExp, education, workExperience, courses, bonusProjectUrls);
        res.json(data);
        }
    )

