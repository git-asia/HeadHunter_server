import express, {json} from "express";
// import cors from 'cors';
import 'express-async-errors';
import { userRouter } from "./routers/user";
import { studentRouter } from "./routers/student";
import { authRouter } from "./routers/auth";
import { adminRouter } from "./routers/admin";
import { homeRouter } from "./routers/home";

const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000,' }));
app.use(json());

app.use('/students', userRouter);
app.use('/login', authRouter);
app.use('/manage', adminRouter);
app.use('/about', studentRouter);
app.use('/', homeRouter);




app.listen(3001,'0.0.0.0', () =>{
    console.log('Listening on http://localhost:3001');
});