import {removeDoubleSlashes} from './utils.js';

interface RestOptions {
	/**
	 * Whether to cache `text` or `json` after the response, so it can be directly retrieve,
	 *  e.g.
	 *  ```js
	 *  const {json} = await get('data')
	 *  typeof json === 'object' // true
	 *  ```
	 *  instead of,
	 *  ```js
	 *  const {json} = await get('data')
	 *  typeof (await json()) === 'object' // true
	 *  ```
	 *
	 *  @default undefined
	 */
	precache: RestPreCacheType | undefined;
}

type RestPreCacheType = 'text' | 'json';

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
		// TODO: better url system?
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

export async function get(
	url: string,
	precache: RestPreCacheType | undefined = undefined,
): Promise<ResponseObject> {
	// if (!url.startsWith('http')) {
	// 	url = `http://${url}`;
	// }
	const response = await fetch(url, {
		method: 'GET',
	});
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

export async function post(
	url: string,
	body: any,
	precache: RestPreCacheType | undefined = undefined,
): Promise<ResponseObject> {
	// if (!url.startsWith('http')) {
	// 	url = `http://${url}`;
	// }
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
		},
		body: JSON.stringify(body),
	});
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

export async function del(
	url: string,
	precache: RestPreCacheType | undefined = undefined,
) {
	const response = await fetch(url, {
		method: 'DELETE',
	});
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

type ResponseObject = {
	response: Response;
	status: number;
	text: string | (() => Promise<string>);
	json: any | (() => Promise<any>);
};
