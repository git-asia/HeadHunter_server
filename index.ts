import express, {json} from "express";
// import cors from 'cors';
import 'express-async-errors';
import {userRouter} from "./routers/user.router";
import {handleError} from "./utils/errors";

const app = express();

// app.use(cors({
//     origin: 'http://localhost:3000,' }));

app.use(json());
app.use("/user", userRouter);
app.use(handleError);

app.listen(3001, '0.0.0.0', () => {
    console.log('Listening on http://localhost:3001');
});