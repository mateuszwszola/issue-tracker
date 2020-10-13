import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import { handleNotFound, handleError } from './utils/error';
import { checkJwt } from './utils/auth';

import apiRouter from './resources';

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/protected', checkJwt, (req, res) => {
  res.json({ message: 'You have accessed the protected route' });
});
app.use('/api', apiRouter);

app.use(handleNotFound);
app.use(handleError);

export default app;
