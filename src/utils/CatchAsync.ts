import { NextFunction, Request, Response } from 'express';

export default (fn: Function) => {
	return (req: Request, res: Response, next: NextFunction) => {
		return fn(req, res, next).catch((error: any) => {
			const isDevelop = process.env.MODE === 'develop';
			if (isDevelop) {
				return res
					.status(error.status || 500)
					.json({ error: error.message, stacks: error.stack });
			}
			return res.status(500).json({ msg: 'Oops something went wrong!' });
		});
	};
};
