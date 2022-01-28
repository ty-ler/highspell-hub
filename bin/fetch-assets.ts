import fetch from 'node-fetch';
import path from 'path';
import fs from 'fs';

interface ClientAssetsData {
	data: {
		files: {
			defs: {
				[key: string]: string;
			};
			gameAssets: {
				[key: string]: string;
			};
		};
	};
}

const ensureDirExists = (p: string) => {
	if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

const clientAssetsPath = path.join(fs.realpathSync('.'), 'client-assets');

const clientAssetsRes = await fetch('https://highspell.com:3002/assetsClient');
const clientAssets = (await clientAssetsRes.json()) as ClientAssetsData;

const ensureAssetsDirExists = (dir: string) => {
	const _path = path.join(clientAssetsPath, dir);
	ensureDirExists(_path);
	return _path;
};

const downloadCarbon = async (url: string, dir: string, filename: string) => {
	const contents = await (await fetch(url)).json();
	const _path = ensureAssetsDirExists(dir);

	fs.writeFileSync(path.join(_path, `${filename}.json`), JSON.stringify(contents, null, 2));

	if (dir === 'gameAssets') {
		(contents as { filename: string; data: string }[]).map((v) => {
			const data = v.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/)[2];

			const carbonAssetsPath = path.join(_path, filename);
			ensureDirExists(carbonAssetsPath);
			fs.writeFileSync(path.join(carbonAssetsPath, v.filename), data, 'base64');
		});
	}
};

const downloadPNG = async (url: string, dir: string, filename: string) => {
	const contents = Buffer.from(await (await fetch(url)).arrayBuffer());
	const _path = ensureAssetsDirExists(dir);

	fs.writeFileSync(path.join(_path, `${filename}.png`), contents);
};

const filesObj = clientAssets.data.files;

await Promise.all(
	Object.keys(filesObj).map(async (dir) => {
		const urlObj = filesObj[dir];
		await Promise.all(
			Object.keys(urlObj).map(async (filename) => {
				const url: string = urlObj[filename];
				switch (path.extname(url)) {
					case '.carbon':
						await downloadCarbon(url, dir, filename);
						break;
					case '.png':
						await downloadPNG(url, dir, filename);
						break;
				}
			})
		);
	})
);
