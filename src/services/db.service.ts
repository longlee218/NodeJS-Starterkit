import DatabaseOptions from '../config/database';
import mongoose from 'mongoose';

export const connectMongoDB = () => {
	const mongooseOptions = DatabaseOptions.mongoose;
	mongoose.connection.on('connected', () => {
		console.log('[mongodb] connected success');
	});
	mongoose.connection.on('error', (error) => {
		console.log('[mongodb] connected error ' + error);
	});
	mongoose.connection.on('disconnected', () => {
		console.log('[mongodb] disconnected');
	});
	return mongoose.connect(mongooseOptions.connection, {
		autoIndex: true,
		autoCreate: true,
		user: mongooseOptions.user,
		pass: mongooseOptions.password,
		dbName: mongooseOptions.dbName,
		connectTimeoutMS: mongooseOptions.connectTimeoutMS,
	});
};
