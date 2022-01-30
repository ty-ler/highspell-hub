import type { RequestHandler } from '@sveltejs/kit';

export const get: RequestHandler = async ({ params, url }) => {
	const version = params.version;
	const baseApiUrl = `${url.origin}/api`;

	const res = await fetch(`${baseApiUrl}/caches`);
	const cacheVersions: string[] = await res.json();

	if (!cacheVersions.includes(version)) {
		return {
			status: 404,
			body: 'Invalid cache version'
		};
	}

	const body: any = params.version;

	return {
		status: 200,
		body
	};
};
