
import {Router} from "express";
import {StudentRecord} from "../records/student.record";
import { FilterRecord } from "../records/filter.record";
import { UpdateStatus } from "../types";


export const studentRouter = Router();

studentRouter

    .get('/all/:remoteWork/:inOffice/:employmentContract/:mandateContract/:b2b/:workContract/:min/:max/:courseCompletion/:courseEngagement/:projectDegree/:teamProjectDegree/:canTakeApprenticeship/:monthsOfCommercialExp/:page/:rowsPerPage', async (req, res) => {
        const filter = req.params;
        const availableStudents = new FilterRecord(filter);
        const data = await availableStudents.get();
        const allRecords = await availableStudents.allRecordsStudent();
        const newData = {
          allRecords: allRecords,
          data: data,
        }

        res.json(newData);

    })
      .get('/reserved/:remoteWork/:inOffice/:employmentContract/:mandateContract/:b2b/:workContract/:min/:max/:courseCompletion/:courseEngagement/:projectDegree/:teamProjectDegree/:canTakeApprenticeship/:monthsOfCommercialExp/:page/:rowsPerPage/:hrId', async (req, res) => {
        const filter = req.params;
        const availableStudents = new FilterRecord(filter);
        const data = await availableStudents.getReserved();
        const allRecords = await availableStudents.allRecordsReservedStudent();
        const newData = {
          allRecords: allRecords,
          data: data,
        }
        console.log(newData);
        res.json(newData);

      })


    .patch('/status', async (req, res) => {
        const {action,studentId, hrId = null}:UpdateStatus = req.body;
        const message = await StudentRecord.statusChange(action,studentId,hrId);
        res.status(200).json({ success: true, message: message });
    })

    .get('/getcv/:studentId', async (req, res) => {
        const studentId = req.params.studentId;
        const data = await StudentRecord.getCvOneStudent(studentId);
        res.json(data);
        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

    .get('/getcvedit/:studentId', async (req, res) => {
        const studentId = req.params.studentId;
        const data = await StudentRecord.getCvOneStudentEdit(studentId);
        res.json(data);
        // wymaga id studenta i zwraca wszystkie dane wymagane do wyświetlenia cv
        // kursanta (makieta 6)
    })

    .patch('/changedata', async (req, res) => {
        const newStudent = new StudentRecord(req.body);
        const data = await newStudent.update();
        res.json(data);
        }
    )