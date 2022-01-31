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

	const cacheContents = fs.readdirSync(cacheDirPath);
	console.log(cacheContents);
	const body: CacheVersions = cacheContents;

	return {
		status: 200,
		body: []
	};
};

class TreeNode {
	public path: string;
	public children: Array<TreeNode>;

	constructor(path: string) {
		this.path = path;
		this.children = [];
	}
}

function buildTree(rootPath: string) {
	const root = new TreeNode(rootPath);

	const stack = [root];

	while (stack.length) {
		const currentNode = stack.pop();
		if (currentNode) {
			const children = fs
				.readdirSync(currentNode.path)
				.filter((filename) => !filename.startsWith('.'));

			for (let child of children) {
				const childPath = `${currentNode.path}/${child}`;
				const childNode = new TreeNode(childPath);
				currentNode.children.push(childNode);

				if (fs.statSync(childNode.path).isDirectory()) {
					stack.push(childNode);
				}
			}
		}
	}

	return root;
}
