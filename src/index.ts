

import cookieParser from 'cookie-parser'
import morgan from 'morgan'

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import path from 'path'
import glob from 'glob'

import helmet from 'helmet'
import logger from './loaders/logger'
import Config from './config'
import { error } from './utils/api-response'

logger.silly("=== app instance start ===")

const { BAD_REQUEST } = StatusCodes;

var cors = require('cors');
const app = express()
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors

let allowedOrigins = [];
allowedOrigins.push("http://localhost:8080");

let corsOptions = {
    origin: allowedOrigins,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1)
    app.use(helmet());
}



// Load apis dynamically
glob(path.join(__dirname, 'api/**/*' + path.extname(__filename)), (err, files) => {
    if (err) {
        return Promise.reject(err)
    }
    logger.info('Mounting API routes..')

    files.map(file => {
        const relativepath = path.relative(path.join(__dirname, 'api'), file).slice(0, -3)

        logger.info('Mounting ' + relativepath + ' API..')
        app.use('/api/' + relativepath, require(file),
            (err: Error, req: Request, res: Response, next: NextFunction) => {
                res.status(BAD_REQUEST)
                if (err instanceof Error) {
                    res.json(error(err.message, BAD_REQUEST))
                } else {
                    res.json(error(err, BAD_REQUEST))
                }

                res.end()
            })
    })

    logger.info('Completed mounting API routes.')
})

app.get('/ping', function (req, res, next) {
    res.send('pong')
})

// error middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err);
    res.status(400)
    return res.status(BAD_REQUEST).json({
        error: err,
    });
});

const server = app.listen(process.env.PORT || 5000, async () => {
    logger.info(`App listening at port : ${process.env.PORT || 5000}`)
})

process.on('SIGINT', () => {
    logger.info('SIGINT received.')
    logger.info('Shutting down server instance.')

    server.close(async (err: any) => {
        if (err) {
            return logger.error(err)
        }

        logger.info('Shutting down database connection.')

        try {
            logger.info('All connections terminated.')
            process.exit(0)
        } catch (e) {
            logger.error(err)
            process.exit(1)
        }
    })
})

export default server