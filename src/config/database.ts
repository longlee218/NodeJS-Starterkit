const options = {
	mongoose: {
		connection: 'mongodb://localhost:27017',
		user: process.env.DB_USER || '',
		password: process.env.DB_PASSWORD || '',
		connectTimeoutMS: 1000,
		dbName: process.env.DB_NAME || 'chatapp',
	},
};

export default options;
