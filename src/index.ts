import express from 'express'
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import router from './router/index';

const app = express()
const port  = 3000

app.use(cors({
  credentials: true,
  origin: '*',
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

app.use('/api/', router());

server.listen(port, (() => {
    console.log(`app listening at http://localhost:${port}`)
}))
