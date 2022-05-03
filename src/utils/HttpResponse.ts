import { Response } from 'express';

interface IHttpResponse {
	res: Response;
	statusCode?: number;
	msg?: string;
	data?: object;
}

export default class HttpResponse {
	private res: Response;
	private statusCode: number;
	private msg: string;
	private data: object;

	constructor(iHttp: IHttpResponse) {
		this.res = iHttp.res;
		this.statusCode = iHttp.statusCode ?? 200;
		this.msg = iHttp.msg ?? 'ok';
		this.data = iHttp.data ?? {};
		this._response();
	}

	private _response() {
		return this.res.status(this.statusCode).json({
			responseTime: new Date().getTime(),
			isSuccess: this.statusCode >= 200 && this.statusCode <= 299,
			msg: this.msg,
			data: this.data,
		});
	}
}
