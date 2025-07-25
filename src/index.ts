import {removeDoubleSlashes} from './utils.js';

type ResponseObject<T = any> = {
	response: Response;
	ok: boolean;
	status: number;
	text: () => Promise<string>;
	json: () => Promise<T>;
};

function ensureOk(response: Response, method: string): void {
	// if (!response.ok) {
	// 	throw new Error(`${method} request failed with status ${response.status}`);
	// }
}

async function buildResponseObject<T = any>(
	response: Response,
): Promise<ResponseObject<T>> {
	return {
		response,
		status: response.status,
		ok: response.status === 200,
		text: () => response.text(),
		json: () => response.json(),
	};
}

export async function get<T = any>(url: string): Promise<ResponseObject<T>> {
	const response = await fetch(url, {method: 'GET'});
	ensureOk(response, 'GET');
	return await buildResponseObject<T>(response);
}

export async function post<T = any>(
	url: string,
	body: any,
): Promise<ResponseObject<T>> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body),
	});
	ensureOk(response, 'POST');
	return await buildResponseObject<T>(response);
}

export async function put<T = any>(
	url: string,
	body: any,
): Promise<ResponseObject<T>> {
	const response = await fetch(url, {
		method: 'PUT',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body),
	});
	ensureOk(response, 'PUT');
	return await buildResponseObject<T>(response);
}

export async function del<T = any>(url: string): Promise<ResponseObject<T>> {
	const response = await fetch(url, {method: 'DELETE'});
	ensureOk(response, 'DELETE');
	return await buildResponseObject<T>(response);
}

export class Rest<TMap extends Record<string, any>> {
	constructor(protected baseURL: string) {}

	get url() {
		return this.baseURL;
	}

	composeUrl(path: string) {
		return removeDoubleSlashes(`${this.baseURL}/${path}`);
	}

	get<K extends keyof TMap>(path: K): Promise<ResponseObject<TMap[K]>> {
		return get<TMap[K]>(this.composeUrl(path as string));
	}

	post<K extends keyof TMap>(
		path: K,
		body: any,
	): Promise<ResponseObject<TMap[K]>> {
		return post<TMap[K]>(this.composeUrl(path as string), body);
	}

	put<K extends keyof TMap>(
		path: K,
		body: any,
	): Promise<ResponseObject<TMap[K]>> {
		return put<TMap[K]>(this.composeUrl(path as string), body);
	}

	delete<K extends keyof TMap>(path: K): Promise<ResponseObject<TMap[K]>> {
		return del<TMap[K]>(this.composeUrl(path as string));
	}
}
