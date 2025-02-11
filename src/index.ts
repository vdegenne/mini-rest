interface RestOptions {
	/**
	 * Whether to cache `text` and `json` after the response, so it can be directly retrieve,
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
	 *  @default false
	 */
	precache: boolean;
}

export class Rest {
	#options: RestOptions;

	constructor(
		protected baseURL: string,
		options: Partial<RestOptions>,
	) {
		this.#options = Object.assign(
			{},
			{precache: false} as RestOptions,
			options,
		);
	}

	get(path = '/') {
		return get(`${this.baseURL}/${path}`, this.#options.precache);
	}
	post(path = '/', body: any) {
		return post(`${this.baseURL}/${path}`, body, this.#options.precache);
	}
}

export async function get(
	url: string,
	precache = false,
): Promise<ResponseObject> {
	if (!url.startsWith('http')) {
		url = `http://${url}`;
	}
	const response = await fetch(url, {
		method: 'GET',
	});
	return {
		response,
		status: response.status,
		text: precache
			? await response.text()
			: async function () {
					return await response.text();
				},
		json: precache
			? await response.json()
			: async function () {
					return await response.json();
				},
	};
}

export async function post(
	url: string,
	body: any,
	precache = false,
): Promise<ResponseObject> {
	if (!url.startsWith('http')) {
		url = `http://${url}`;
	}
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
		text: precache
			? await response.text()
			: async function () {
					return await response.text();
				},
		json: precache
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
