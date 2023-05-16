import * as dotenv from 'dotenv';
dotenv.config();

import express, { json, Router } from 'express';
import cors from 'cors';
import 'express-async-errors';
import { adminRouter } from './routers/admin.router';
import { homeRouter } from './routers/home.router';
import { studentRouter } from './routers/student.router';
import { userRouter } from './routers/user.router';
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

const router = Router();

router.use('/user', userRouter);
router.use('/student', studentRouter);
router.use('/manage', adminRouter);
router.use('/', homeRouter);

app.use('/', router);

app.listen(3001, '0.0.0.0', () => {
  console.log('Listening on http://localhost:3001');
});
