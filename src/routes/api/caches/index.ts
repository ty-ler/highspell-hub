import { isProduction } from '$lib/utils/env';
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const staticDirPath = isProduction()
	? fs.realpathSync('.')
	: path.join(fs.realpathSync('.'), 'static');
const cacheDirPath = path.join(staticDirPath, 'client-caches');

type CacheVersions = string[];

export const get: RequestHandler = ({ params }) => {
	console.log(fs.readdirSync(path.join(staticDirPath, '..')));

	const cacheContents = fs.readdirSync(cacheDirPath);
	const body: CacheVersions = cacheContents;

	return {
		status: 200,
		body
	};
};
