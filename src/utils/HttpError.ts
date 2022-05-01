class HttpError extends Error {
	constructor(msg: string, status: number = 400) {
		super();
	}
}
