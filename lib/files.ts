import fs from 'fs';

export const ensureDirExists = (p: string) => {
	if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};
