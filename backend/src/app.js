import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { handleNotFound, handleError } from './utils/error';

import apiRouter from './resources';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', apiRouter);

app.use(handleNotFound);
app.use(handleError);

export default app;
