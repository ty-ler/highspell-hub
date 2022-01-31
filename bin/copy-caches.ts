import fs from 'fs';
import path from 'path';
import { exec as _exec } from 'child_process';
import { staticCachesDirPath, writeJsonToFile } from '../lib';

const exec = async (command: string) => {
	return new Promise<void>((resolve, reject) => {
		_exec(command, (e) => {
			if (e) return reject(e);
			resolve();
		});
	});
};

const cachesPath = staticCachesDirPath;

console.log('Copying caches to static directory...');
await exec(`mkdir -p ${staticCachesDirPath}`);
await exec(`cp -r cache/** ${staticCachesDirPath}`);
console.log('Copied!');

const versions = fs
	.readdirSync(staticCachesDirPath)
	.filter((filename) => filename === 'current' || !isNaN(Number(filename)));

writeJsonToFile(staticCachesDirPath, 'versions.json', versions);
