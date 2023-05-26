import express, { json } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { adminRouter } from './routers/admin.router';
import { homeRouter } from './routers/home.router';
import { studentRouter } from './routers/student.router';
import { userRouter } from './routers/user.router';
import { hrRouter } from './routers/hr.router';
import { authRouter } from './routers/auth.router';
import { handleError } from './utils/errors';
import { config } from './config/config';

const app = express();

app.use(
    cors({
        origin: config.corsOrigin,
    }),
);

app.use(json());
app.use(handleError);

app.use('/user', userRouter);
app.use('/student', studentRouter);
app.use('/hr', hrRouter);
app.use('/manage', adminRouter);
app.use('/', homeRouter);
app.use('/auth', authRouter)

app.listen(3001, 'localhost', () => {
    console.log('Listening on http://localhost:3001');
});
