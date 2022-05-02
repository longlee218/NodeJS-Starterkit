import { Request, Response } from 'express';

import PaymentOptions from '../config/payment';
import crypto from 'crypto';
import https from 'https';

interface MomoRequest {
	partnerCode: string;
	accessKey: string;
	requestId: string;
	amount: string;
	orderId: string;
	orderInfo: string;
	redirectUrl?: string;
	ipnUrl?: string;
	extraData: string;
	requestType: string;
	signature?: string;
	lang?: 'en' | 'vn';
}

export const paymentService = (req: Request, res: Response) => {
	momoService('200000', 'Mua goi than so hoc');
	res.json({ msg: 'Momo service success' });
};

const momoService = (
	amount: string,
	orderInfo: string,
	extraData?: string
): void => {
	const { momo } = PaymentOptions;
	const requestId = momo.partnerCode + new Date().getTime();
	const orderId = requestId;

	// Body request Momo
	const requestBody: MomoRequest = {
		partnerCode: momo.partnerCode,
		accessKey: momo.accessKey,
		requestId,
		amount: amount,
		orderId,
		orderInfo,
		redirectUrl: 'http://127.0.0.1:3000/than-so-hoc/ket-qua',
		ipnUrl: '',
		extraData,
		requestType: 'captureMoMoWallet',
		lang: 'en',
	};
	requestBody.signature = makeMomoSignature(requestBody);

	const httpsOptions = {
		hostname: 'test-payment.momo.vn',
		port: 443,
		path: '/v3/gateway/api/create',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': Buffer.byteLength(JSON.stringify(requestBody)),
		},
	};

	const req = https.request(httpsOptions, (res) => {
		console.log(res);
	});
};

const makeMomoSignature = (rqBody: MomoRequest): string => {
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
	return crypto
		.createHmac('sha256', process.env.PRIVATE_KEY)
		.update(rawSignature)
		.digest('hex');
};
