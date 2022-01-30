import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

const staticDirPath = path.join(fs.realpathSync('.'), 'static');
const cacheDirPath = path.join(staticDirPath, 'client-caches');

type CacheVersions = string[];

export const get: RequestHandler = ({ params }) => {
	const cacheContents = fs.readdirSync(cacheDirPath);
	const body: CacheVersions = cacheContents.map((version: string) => version);

	return {
		status: 200,
		body
	};
};
