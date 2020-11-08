import express, { json, urlencoded } from 'express';
import 'express-async-errors';
import logger from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import { handleNotFound, handleError } from './utils/error';
import { checkJwt } from './middlewares/auth';
import registerApi from './api';
import './db';

const router = express.Router();
const app = express();

app.use(compression());
app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));

registerApi(router);

app.use('/api/v1', router);

app.get('/api/auth', checkJwt(), (req, res) => {
  console.log(req.user);
  res.json({ message: 'You have accessed the protected route' });
});

app.use(handleNotFound);
app.use(handleError);

export { app };
