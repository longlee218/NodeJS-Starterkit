const options = {
	momo: {
		domain:
			process.env.MODE === 'develop'
				? 'https://test-payment.momo.vn'
				: 'https://payment.momo.vn',
		partnerCode: process.env.MOMO_PARTNER_CODE || '',
		accessKey: process.env.MOMO_ACCESS_KEY || '',
		secretKey: process.env.MOMO_SECRET_KEY || '',
		publicKey: process.env.PUBLIC_KEY || '',
	},
	zalopay: {},
	vnpay: {},
	viettelpay: {},
};

export default options;
