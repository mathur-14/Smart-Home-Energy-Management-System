import express from 'express'
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';

const app = express()
const port  = 3000

app.use(cors({
  credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

server.listen(port, (() => {
    console.log(`app listening at http://localhost:${port}`)
}))
