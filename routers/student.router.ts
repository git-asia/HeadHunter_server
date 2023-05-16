import { Router } from 'express';
//import {StudentRecord} from "../records/student.record";
import { FilterRecord } from '../records/filter.record';
//import { UpdateStatus } from '../types';

export const studentRouter = Router();

studentRouter

  .get(
    '/all/:remoteWork/:inOffice/:employmentContract/:mandateContract/:b2b/:workContract/:min/:max/:courseCompletion/:courseEngagement/:projectDegree/:teamProjectDegree/:canTakeApprenticeship/:monthsOfCommercialExp/:page/:rowsPerPage',
    async (req, res) => {
      const filter = req.params;
      const availableStudents = new FilterRecord(filter);
      const data = await availableStudents.get();
      res.json(data);
    },
  )

  // .patch('/status', async (req, res) => {
  //   const { action, studentId, hrId = null }: UpdateStatus = req.body;
  //   const message = await StudentRecord.statusChange(action, studentId, hrId);
  //   res.status(200).json({ success: true, message: message });
  // })

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

  .get('/test', (req, res) => {
    res.send({
      be: 'is working 🥳',
    });
  });
