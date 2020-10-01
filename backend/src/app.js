const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const { handleNotFound, handleError } = require('./utils/error');

const userRouter = require('./resources/user/user.router');

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', (req, res) => {
  res.json({ message: 'Hello world!' });
});

app.use('/api/users', userRouter);

app.use(handleNotFound);
app.use(handleError);

module.exports = app;
