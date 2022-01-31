import { isProduction } from '$lib/utils/env';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const staticDirPath = isProduction()
	? fs.realpathSync('.')
	: path.join(fs.realpathSync('.'), 'static');
const cacheDirPath = path.join(staticDirPath, 'client-caches');

type CacheVersions = string[];

export const get: RequestHandler = async ({ params, url }) => {
	const baseUrl = url.origin;
	// const res = await fetch(`${baseUrl}/client-caches`);

	const cacheContents = fs.readdirSync(staticDirPath);
	const body: CacheVersions = cacheContents;

	return {
		status: 200,
		body: []
	};
};
