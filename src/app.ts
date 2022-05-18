import express, { Express, NextFunction, Request, Response } from 'express';

import { connectMongoDB } from './services/db.service';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import path from 'path';
import makeRoutes from './routes';
import bodyParser from 'body-parser';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

const normalizePort = (val: string) => {
	const port = parseInt(val, 10);
	if (isNaN(port)) {
		return val;
	}
	if (port >= 0) {
		return port;
	}
	return false;
};

/**
 * App Variables
 */
const port = normalizePort(process.env.PORT || '8080');
const app: Express = express();
app.set('port', port);

/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error: any) => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

const onListenning = () => {
	const addr = httpServer.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	console.log('[express] listening on ' + bind);
};

const errorHandle = (
	error: any,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const isDevelop = process.env.MODE === 'develop';
	if (isDevelop) {
		return res.status(500).json({ msg: error.message, stacks: error });
	}
	return res.status(500).json({ msg: 'Oops something went wrong!' });
};

/**
 * Server Activation
 */
const httpServer = http.createServer(app);
httpServer.listen(port);
httpServer.on('listening', onListenning);
httpServer.on('error', onError);

/**
 * Connect database
 */
connectMongoDB(); // turnoff connect mongodb

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/**
 * Server Routes
 */
makeRoutes(app);

/**
 * Catch error process
 */
process.on('uncaughtException', (err) => {
	console.log('Error process: ' + err);
});
