import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
	path: path.join(process.cwd(), '.env'),
});

const options = {
	momo: {
		host:
			process.env.MODE === 'develop'
				? 'test-payment.momo.vn'
				: 'payment.momo.vn',
		path: '/v2/gateway/api/create',
		port: 443,
		partnerCode: process.env.MOMO_PARTNER_CODE,
		accessKey: process.env.MOMO_ACCESS_KEY,
		secretKey: process.env.MOMO_SECRET_KEY,
		publicKey: process.env.PUBLIC_KEY,
	},
	zalopay: {},
	vnpay: {},
	viettelpay: {},
};

export default options;
