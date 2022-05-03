import { Request, Response } from 'express';

import HttpResponse from '../utils/HttpResponse';
import PaymentOptions from '../config/payment';
import crypto from 'crypto';
import https from 'https';

interface MomoRequest {
	partnerCode: string;
	accessKey: string;
	requestId: string;
	amount: string | number;
	orderId: string;
	orderInfo: string;
	redirectUrl: string;
	ipnUrl: string;
	extraData: string;
	requestType: string;
	signature?: string;
	lang: 'en' | 'vi';
}

export const paymentService = (req: Request, res: Response) => {
	const paymentType = req.params.type;
	if (paymentType === 'momo') {
		momoService(10000, 'Mua gói thần số học cơ bản', (body: any) => {
			const parseBody = JSON.parse(body);
			const { resultCode, payUrl } = parseBody;
			if (resultCode !== 0) {
				return new HttpResponse({
					res,
					statusCode: 400,
					msg: 'Something went wrong',
				});
			}
			return new HttpResponse({ res, data: { payUrl } });
		});
	} else {
		return new HttpResponse({
			res,
			statusCode: 400,
			msg: 'Not support payment service',
		});
	}
};

const momoService = (
	amount: number,
	orderInfo: string,
	callback: Function
): void => {
	const { momo } = PaymentOptions;

	// Momo variables
	const partnerCode = momo.partnerCode;
	const accessKey = momo.accessKey;
	const hostname = momo.host;
	const port = momo.port;
	const path = momo.path;
	const requestId = momo.partnerCode + new Date().getTime();
	const orderId = requestId;
	const redirectUrl = 'http://127.0.0.1:3000/than-so-hoc/ket-qua';
	const ipnUrl = 'https://callback.url/notify';

	// Body request Momo
	const requestBody: MomoRequest = {
		partnerCode,
		accessKey,
		requestId,
		amount,
		orderId,
		orderInfo,
		redirectUrl,
		ipnUrl,
		extraData: 'eyJ1c2VybmFtZSI6ICJtb21vIn0=',
		requestType: 'captureWallet',
		lang: 'en',
	};
	requestBody.signature = makeMomoSignature(requestBody, momo.secretKey);
	const strRequestBody = JSON.stringify(requestBody);

	//Request payment to Momo
	const httpsOptions = {
		hostname,
		port,
		path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/json;charset=utf-8',
			'Content-Length': Buffer.byteLength(strRequestBody),
		},
	};
	const req = https.request(httpsOptions, (res) => {
		res.setEncoding('utf8');
		res.on('data', (body) => {
			callback(body);
		});
		res.on('end', () => {
			console.log('No more data in response.');
		});
	});
	req.on('error', (e) => {
		console.log(`problem with request: ${e.message}`);
	});
	// write data to request body
	console.log('Sending....');
	// Post the data
	req.write(strRequestBody);
	req.end();
};

const makeMomoSignature = (rqBody: MomoRequest, key: string): string => {
	const rawSignature =
		'accessKey=' +
		rqBody.accessKey +
		'&amount=' +
		rqBody.amount +
		'&extraData=' +
		rqBody.extraData +
		'&ipnUrl=' +
		rqBody.ipnUrl +
		'&orderId=' +
		rqBody.orderId +
		'&orderInfo=' +
		rqBody.orderInfo +
		'&partnerCode=' +
		rqBody.partnerCode +
		'&redirectUrl=' +
		rqBody.redirectUrl +
		'&requestId=' +
		rqBody.requestId +
		'&requestType=' +
		rqBody.requestType;
	return crypto.createHmac('sha256', key).update(rawSignature).digest('hex');
};
