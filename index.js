const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middlewares/errorMiddleware');

const todoRouter = require("./router/todoRouter");
const authRouter = require("./router/authRouter");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/todo', todoRouter);
app.use('/auth', authRouter);

app.use(errorMiddleware);


const start = async () => {
    try {
        await mongoose
            .connect(process.env.DB_URL)
            .then(() => console.log(`Connected to MongoDB`))
            .catch((err) => console.log(err));


        app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch (e) {


    }
}

start();
