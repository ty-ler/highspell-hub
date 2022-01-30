import fs from 'fs';
import path from 'path';

export const ensureDirExists = (p: string) => {
	if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

export const writeJsonToFile = (p: string, filename: string, json: any) => {
	if (!fs.existsSync(p)) return false;

	fs.writeFileSync(path.join(p, filename), JSON.stringify(json, null, 2));
	return true;
};
