import { Request, Response } from 'express';

export const getInfo = (req: Request, res: Response) => {
	return res.json({ msg: 'Info user' });
};
