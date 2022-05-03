import express, { Express, NextFunction, Request, Response } from 'express';

import Route from './routes';
import { connectMongoDB } from './services/db.service';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import http from 'http';
import path from 'path';

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
	console.log('[error-express]: ' + error);
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
connectMongoDB();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(errorHandle);

/**
 * Server Routes
 */
const apiV1 = '/api/v1';
app.use(apiV1, Route.userRoute);
app.use(apiV1, Route.paymentRoute);

/**
 * Catch error process
 */
process.on('uncaughtException', (err) => {
	console.log(err);
	console.log('Error process: ' + err);
	process.exit(1);
});
