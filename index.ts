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

try{
    const result =sendMail('homik363@wp.pl','tytuł jakiś','tresc wiadomości', '<b> jestem sobie html </b>');
    console.log(result);
}catch (err){
    console.log(err);
    throw new ValidationError('E-mail nie został wysłany');
}

console.log(sendMail('homik363@wp.pl','tytuł jakiś','tresc wiadomości', '<b> jestem sobie html </b>')) ;



app.listen(3001,'0.0.0.0', () =>{
    console.log('Listening on http://localhost:3001');
});