import fs from 'fs';
import path from 'path';
import { exec as _exec } from 'child_process';
import { currentCacheDirPath, staticCachesDirPath, writeJsonToFile } from '../lib';

const exec = async (command: string) => {
	return new Promise<void>((resolve, reject) => {
		_exec(command, (e) => {
			if (e) return reject(e);
			resolve();
		});
	});
};

console.log('Copying caches to static directory...');
// await exec(`mkdir -p ${staticCachesDirPath}/current`);
// await exec(`cp -r cache/** ${staticCachesDirPath}`);
await exec(`mkdir -p ${currentCacheDirPath}`);
await exec(`cp -r cache/current/** ${currentCacheDirPath}`);
await exec(`rm -rf ${currentCacheDirPath}/bundle`);
console.log('Copied!');

// const versions = fs
// 	.readdirSync(staticCachesDirPath)
// 	.filter((filename) => filename === 'current' || !isNaN(Number(filename)));

// writeJsonToFile(staticCachesDirPath, 'versions.json', versions);
