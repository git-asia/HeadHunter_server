import { Router } from "express";

export const adminRouter = Router();

// zalogowany admin
adminRouter

    .get('/list-students', async (req, res) => {
        // wylistowanie wszystkich dostępnych kursantów 
    })

    .get('/list-hrs', async (req, res) => {
        // wylistowanie wszystkich dostępnych użytkowników hr 
    })

    .post('/register', async (req, res) => {

        // dodanie nowych użytkowników
      })
