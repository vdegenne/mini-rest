export function removeDoubleSlashes(url: string): string {
	return url.replace(/([^:]\/)\/+/g, '$1');
}
