import express, {json} from "express";
import 'express-async-errors';
import { userRouter } from "./routers/user.router";

const app = express();


app.use(json());

app.use('/students', userRouter);


app.listen(3001,'0.0.0.0', () =>{
    console.log('Listening on http://localhost:3001');
});