import express, {json} from "express";
import 'express-async-errors';
import {studentRouter} from "./routers/student.router";

const app = express();

app.use(json());

app.use('/students', studentRouter);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});