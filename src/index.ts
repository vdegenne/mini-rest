import {removeDoubleSlashes} from './utils.js';

interface RestOptions {
	precache: RestPreCacheType | undefined;
}

type RestPreCacheType = 'text' | 'json';

type ResponseObject = {
	response: Response;
	status: number;
	text: string | (() => Promise<string>);
	json: any | (() => Promise<any>);
};

export class Rest {
	#options: RestOptions;

	constructor(
		protected baseURL: string,
		options?: Partial<RestOptions>,
	) {
		this.#options = Object.assign(
			{},
			{precache: undefined} as RestOptions,
			options ?? {},
		);
	}

	get url() {
		return this.baseURL;
	}

	composeUrl(path: string) {
		return removeDoubleSlashes(`${this.baseURL}/${path}`);
	}

	get(path = '/', precache = this.#options.precache) {
		return get(this.composeUrl(path), precache);
	}
	post(path = '/', body: any, precache = this.#options.precache) {
		return post(this.composeUrl(path), body, precache);
	}
	delete(path = '/', precache = this.#options.precache) {
		return del(this.composeUrl(path), precache);
	}
}

function ensureOk(response: Response, method: string): void {
	if (!response.ok) {
		throw new Error(`${method} request failed with status ${response.status}`);
	}
}

async function buildResponseObject(
	response: Response,
	precache: RestPreCacheType | undefined,
): Promise<ResponseObject> {
	return {
		response,
		status: response.status,
		text:
			precache === 'text'
				? await response.text()
				: async function () {
						return await response.text();
					},
		json:
			precache === 'json'
				? await response.json()
				: async function () {
						return await response.json();
					},
	};
}

export async function get(
	url: string,
	precache: RestPreCacheType | undefined = undefined,
): Promise<ResponseObject> {
	const response = await fetch(url, {method: 'GET'});
	ensureOk(response, 'GET');
	return await buildResponseObject(response, precache);
}

export async function post(
	url: string,
	body: any,
	precache: RestPreCacheType | undefined = undefined,
): Promise<ResponseObject> {
	const response = await fetch(url, {
		method: 'POST',
		headers: {'content-type': 'application/json'},
		body: JSON.stringify(body),
	});
	ensureOk(response, 'POST');
	return await buildResponseObject(response, precache);
}

export async function del(
	url: string,
	precache: RestPreCacheType | undefined = undefined,
): Promise<ResponseObject> {
	const response = await fetch(url, {method: 'DELETE'});
	ensureOk(response, 'DELETE');
	return await buildResponseObject(response, precache);
}
