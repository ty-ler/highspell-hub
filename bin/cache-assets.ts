import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';
import {
	ClientAssetFiles,
	getCacheVersionDirPath,
	cacheVersionDirPathExists,
	ClientAssetsDataResponse,
	ClientCacheVersion,
	createCacheVersionDir,
	ensureCacheVersionDirExists,
	ensureDirExists,
	getCacheAssetsVersion,
	writeJsonToFile
} from '../lib';
import puppeteer from 'puppeteer';

const extractCarbon = (contents: any, p: string) => {
	(contents as { filename: string; data: string }[]).map((v) => {
		const data = v.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)[2];

		ensureDirExists(p);
		fs.writeFileSync(path.join(p, v.filename), data, 'base64');
	});
};

const downloadClientBundle = async (version: ClientCacheVersion, waitSeconds: number) => {
	const versionBundleDir = path.join(getCacheVersionDirPath(version), 'bundle');
	const currentBundleDir = path.join(getCacheVersionDirPath('current'), 'bundle');
	ensureDirExists(versionBundleDir);

	const playUrl = 'https://highspell.com/play';

	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto(playUrl);
	const submitButton = await page.waitForSelector('.anchor-submit-button');
	await page.setRequestInterception(true);
	const requestHandler = async (request: puppeteer.HTTPRequest) => {
		const reqUrl = request.url();
		const parsed = path.parse(reqUrl);
		const filename = parsed.base;
		const res = await request.response();

		if (
			!reqUrl.startsWith('https') ||
			!reqUrl.startsWith('http') ||
			!res ||
			request.method() === 'OPTIONS'
		) {
			return;
		}
		const contents = await res.text();

		console.log(
			`Downloading ${filename} to ${versionBundleDir}/${filename}... (current/${filename})`
		);
		fs.writeFileSync(path.join(versionBundleDir, filename), contents);
		fs.writeFileSync(path.join(currentBundleDir, filename), contents);
	};

	await submitButton.click();
	await page.on('requestfinished', async (request) => await requestHandler(request));
	await page.on('request', async (request) => {
		await request.continue();
	});

	let waited = 1;
	console.log(`Waiting ${waitSeconds} seconds for game to load...`);
	let waiting = setInterval(() => {
		if (waited > waitSeconds) {
			clearInterval(waiting);
			return;
		}
		// console.log(`Waited ${waited} seconds...`);
		waited++;
	}, 1000);
	setTimeout(
		() => console.log(`Still waiting ${waitSeconds - waited} seconds...`),
		waitSeconds * 0.65 * 1000
	);
	await page.waitForTimeout(waitSeconds * 1000);
	await browser.close();
};

const downloadCarbon = async (
	url: string,
	dir: string,
	filename: string,
	version: ClientCacheVersion
) => {
	const contents = await (await fetch(url)).json();

	const assetsPath = getCacheVersionDirPath(version);
	const dirPath = path.join(assetsPath, dir);
	ensureDirExists(dirPath);

	writeJsonToFile(dirPath, `${filename}.json`, contents);

	if (dir === 'gameAssets') {
		extractCarbon(contents, path.join(dirPath, filename));
	}
};

const downloadPNG = async (
	url: string,
	dir: string,
	filename: string,
	version: ClientCacheVersion
) => {
	const contents = Buffer.from(await (await fetch(url)).arrayBuffer());

	const assetsPath = getCacheVersionDirPath(version);
	const dirPath = path.join(assetsPath, dir);
	ensureDirExists(dirPath);

	fs.writeFileSync(path.join(dirPath, `${filename}.png`), contents);
};

const downloadFiles = async (
	files: ClientAssetFiles,
	version: ClientCacheVersion,
	clientVersion: number
) => {
	writeJsonToFile(getCacheVersionDirPath(version), '__version.json', { version: clientVersion });

	await Promise.all(
		Object.keys(files).map(async (dir) => {
			const urlObj = files[dir];
			await Promise.all(
				Object.keys(urlObj).map(async (filename) => {
					const url: string = urlObj[filename];
					switch (path.extname(url)) {
						case '.carbon':
							await downloadCarbon(url, dir, filename, version);
							break;
						case '.png':
							await downloadPNG(url, dir, filename, version);
							break;
					}
				})
			);
		})
	);
};

console.clear();
console.log('Fetching client assets...');

const clientAssetsRes = (await (
	await fetch('https://highspell.com:3002/assetsClient')
).json()) as ClientAssetsDataResponse;
const clientAssetsData = clientAssetsRes.data;

let { files, latestClientVersion: currentClientVersion } = clientAssetsData;

console.log(`Found assets version: ${currentClientVersion}`);

if (cacheVersionDirPathExists('current')) {
	const version = getCacheAssetsVersion('current');
	console.log(`Latest cached version: ${version}`);
	if (currentClientVersion !== version) {
		console.log(`Updating latest cached version: ${version} -> ${currentClientVersion}...`);
		await downloadFiles(files, 'current', currentClientVersion);
	} else {
		console.log('Latest cached version matches current client version.');
	}
} else {
	console.log('Latest version not cached, downloading...');
	createCacheVersionDir('current');
	await downloadFiles(files, 'current', currentClientVersion);
}

console.log();
console.log(`Downloading version ${currentClientVersion} for cache...`);

ensureCacheVersionDirExists(currentClientVersion);
await downloadFiles(files, currentClientVersion, currentClientVersion);
console.log('Finished downloading cache files!');

console.log('Downloading client bundle for current version...');
await downloadClientBundle(currentClientVersion, 15);
console.log('Finished downloading client bundle!');

console.log('All done!');
