import type { RequestHandler } from '@sveltejs/kit';
import orderBy from 'lodash-es';

type CacheVersions = string[];

export const get: RequestHandler = async ({ params, url }) => {
	const baseUrl = url.origin;
	const res = await fetch(`${baseUrl}/client-caches/versions.json`);
	const versions: CacheVersions = await res.json();

	const body = versions.sort((a, b) => -1);

	return {
		status: 200,
		body
	};
};
