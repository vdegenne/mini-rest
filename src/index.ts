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

export type Endpoint<Req, Res> = {request: Req; response: Res};

export class Rest<
	TMap extends {
		get?: Record<string, Endpoint<any, any>>;
		post?: Record<string, Endpoint<any, any>>;
		put?: Record<string, Endpoint<any, any>>;
		delete?: Record<string, Endpoint<any, any>>;
	},
> {
	constructor(protected baseURL: string) {}

	composeUrl(path: string) {
		return removeDoubleSlashes(`${this.baseURL}/${path}`);
	}

	get<K extends keyof NonNullable<TMap['get']> & string>(
		path: K,
	): Promise<ResponseObject<NonNullable<TMap['get']>[K]['response']>> {
		return get<NonNullable<TMap['get']>[K]['response']>(this.composeUrl(path));
	}

	post<K extends keyof NonNullable<TMap['post']> & string>(
		path: K,
		body: NonNullable<TMap['post']>[K]['request'],
	): Promise<ResponseObject<NonNullable<TMap['post']>[K]['response']>> {
		return post<NonNullable<TMap['post']>[K]['response']>(
			this.composeUrl(path),
			body,
		);
	}

	put<K extends keyof NonNullable<TMap['put']> & string>(
		path: K,
		body: NonNullable<TMap['put']>[K]['request'],
	): Promise<ResponseObject<NonNullable<TMap['put']>[K]['response']>> {
		return put<NonNullable<TMap['put']>[K]['response']>(
			this.composeUrl(path),
			body,
		);
	}

	delete<K extends keyof NonNullable<TMap['delete']> & string>(
		path: K,
	): Promise<ResponseObject<NonNullable<TMap['delete']>[K]['response']>> {
		return del<NonNullable<TMap['delete']>[K]['response']>(
			this.composeUrl(path),
		);
	}
}
