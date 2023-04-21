import express, {json} from "express";
// import cors from 'cors';
import 'express-async-errors';
import { userRouter } from "./routers/user.router";


const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000,' }));
app.use(json());

// app.use('/user', userRouter);
// const data = {
//     mail: 'homik363@o2.pl',
//     password: 'homik1@H'
// };
//
// const jsonData = JSON.stringify(data);
// console.log(jsonData);


app.listen(3001,'0.0.0.0', () =>{
    console.log('Listening on http://localhost:3001');
});