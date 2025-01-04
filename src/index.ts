export class Rest {
	constructor(protected baseURL: string) {}

	get(path = '/') {
		return get(`${this.baseURL}/${path}`);
	}
	post(path = '/', body: any) {
		return post(`${this.baseURL}/${path}`, body);
	}
}

export async function get(url: string) {
	if (!url.startsWith('http')) {
		url = `http://${url}`;
	}
	const response = await fetch(url, {
		method: 'GET',
	});
	return {
		response,
		status: response.status,
		async json() {
			return await response.json();
		},
		async text() {
			return await response.text();
		},
	};
}

export async function post(url: string, body: any) {
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
		async json() {
			return await response.json();
		},
		async text() {
			return await response.text();
		},
	};
}
