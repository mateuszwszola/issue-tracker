import express, { json, urlencoded } from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { handleNotFound, handleError } from './utils/error';
import { checkJwt } from './utils/auth';
import apiRouter from './api';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/auth', checkJwt, (req, res) => {
  res.json({ message: 'You have accessed the protected route' });
});

app.use('/api/v1', apiRouter);

app.use(handleNotFound);
app.use(handleError);

export { app };
