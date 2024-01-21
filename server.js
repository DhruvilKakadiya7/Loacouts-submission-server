import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import submitRouter from './routes/submitRouter.js';
import dotenv from 'dotenv'
const app = express();
dotenv.config();
// Allow all origins
const allowedOrigins = '*';

var corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.json());
app.use('/', submitRouter);
const PORT = process.env.PORT || 8000;

// Connect DataBase
const DATABASE_URL = process.env.DATABASE_LINK;
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;
db.on('error', (err) => console.log("Database err " + err));
db.once('open', async () => console.log("DataBase connection successful."));

// Sleeper function, pass time in ms it will delay the time by that ms.
export const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

while (mongoose.connection.readyState != 1) {
    await sleep(1000);
}
app.get('/', (req, res)=>{
    console.log('xxx');
    res.send('Submission server');
})
const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is started on port ${PORT}.`);
});