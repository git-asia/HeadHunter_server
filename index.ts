import express, {json} from "express";
// import cors from 'cors';
import 'express-async-errors';
import { handleError, ValidationError } from "./utils/errors";
import { sendMail } from "./utils/sendMail";



const app = express();


app.use(json());
app.use(handleError);

app.listen(3002,'0.0.0.0', () =>{
    console.log('Listening on http://localhost:3001');
});