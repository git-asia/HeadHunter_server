import { Router } from "express";
import { v4 as uuid } from "uuid";
import { UserRecord } from "../records/user.record";
import { HrRecord } from "../records/hr.record";
import { sendMail } from "../utils/sendMail";


export const adminRouter = Router();
// zalogowany admin
adminRouter
  .get('/add-hr/:email/:fullName/:company/:maxReservedStudents',async (req,res) =>{
    const {email,fullName,company,maxReservedStudents} = req.params

    const userId = uuid();
    const userData = {
      userId,
      email,
    }
    const hrData = {
      hrId: userId,
      fullName,
      company,
      maxReservedStudents: Number(maxReservedStudents),
    }
    const addUser = new UserRecord(userData);
    const addHr = new HrRecord(hrData);

    await addUser.insert();
    await addHr.insert();
    await sendMail(email,'MegaK Head hunter - rejestracja',"jakś wiadomośc z linkiem aktywacyjnym  http://adres.pl/aktywacja/TOKEN"); //TODO Dodanie generowanie tokenu,  dodanie tekstu maila

  })


    .get('/list-students', async (req, res) => {
        // wylistowanie wszystkich dostępnych kursantów
    })

    .get('/list-hrs', async (req, res) => {
        // wylistowanie wszystkich dostępnych użytkowników hr 
    })

    .post('/register', async (req, res) => {

        // dodanie nowych użytkowników
      })
