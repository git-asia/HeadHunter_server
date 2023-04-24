import express, {json} from "express";
// import cors from 'cors';
import 'express-async-errors';
import { sendMail } from "./utils/sendMail";
import { ValidationError } from "./utils/errors";
import { log } from "util";


const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000,' }));
app.use(json());

app.listen(3001,'0.0.0.0', () =>{
    console.log('Listening on http://localhost:3001');
});
