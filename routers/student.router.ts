import {Request, Response, Router} from "express";
import {StudentRecord} from "../records/student.record";

export const studentRouter = Router();

studentRouter

    .get('/all/:remoteWork/:inOffice/:employmentContract/:mandateContract/:b2b/:workContract/:min/:max/:courseCompletion/:courseEngagement/:projectDegree/:teamProjectDegree/:canTakeApprenticeship/:monthsOfCommercialExp/:page/:rowsPerPage', async (req, res) => {
        console.log(req.params);
        console.log('tutaj jestem');

    })

    .patch('/status', async (req, res) => {
        const {action,studentId, hrId = null}:UpdateStatus = req.body;
        const message = await StudentRecord.statusChange(action,studentId,hrId);
        res.status(200).json({ success: true, message: message });
    })

    .get('/short/:studentId', async (req, res) => {
//     const studentsShortinfo = await StudentRecord.studentShortInfo(
//         req.params.studentId
//     );
//     res.json(studentsShortinfo[0]);
})
    
    .get('/getcv/:studentId', async (req, res) => {
       // const studentId = req.params.studentId

        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

