import fs from 'fs';
import { Express } from 'express';

const makeRoutes = async (app: Express) => {
	const apiEndPointV1 = '/api/v1';
	const files = await fs.promises.readdir(__dirname);
	const routerFiles = files.filter((file) => file.endsWith('.route.js'));
	routerFiles.forEach((routerFile) => {
		import(`./${routerFile}`).then((module) =>
			app.use(apiEndPointV1, module.default)
		);
	});
};

export default makeRoutes;
