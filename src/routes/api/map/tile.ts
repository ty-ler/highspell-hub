import {
	MAP_DEFAULT_TILE_SIZE,
	MAP_MAX_ZOOM,
	MAP_OVERWORLD_FILENAME,
	MAP_SIZE
} from '$lib/common/map';
import type { Load } from '@sveltejs/kit';
import fetch from 'node-fetch';
import sharp from 'sharp';

export const extractTile = async (image: Buffer, x: number, y: number, zoom: number) => {
	const divisor = MAP_MAX_ZOOM - (MAP_MAX_ZOOM - zoom) + 1;
	const tileSize = Math.round(MAP_DEFAULT_TILE_SIZE / divisor);
	console.log(tileSize, divisor);

	const left = Math.round(x * tileSize);
	const top = Math.round(y * tileSize);

	return new Promise<Buffer>((resolve) => {
		const buffer = sharp(image)
			.extract({
				left,
				top,
				width: tileSize,
				height: tileSize
			})
			.toBuffer();

		resolve(buffer);
	});
};

export const get: Load = async ({ url, params }) => {
	const baseUrl = url.origin;
	const queryParams = new URLSearchParams(url.search);

	const x = Number(queryParams.get('x'));
	const y = Number(queryParams.get('y'));
	const zoom = Number(queryParams.get('zoom'));

	if (isNaN(x) || isNaN(y) || isNaN(zoom) || x > MAP_SIZE || y > MAP_SIZE)
		return {
			body: {
				error: {
					message: 'Invalid request'
				}
			},
			status: 400
		};

	if (x < 0 || y < 0) {
		return {
			body: null,
			status: 200
		};
	}

	const mapOverworldImage = await (
		await fetch(`${baseUrl}/client-caches/current/gameAssets/${MAP_OVERWORLD_FILENAME}`)
	).blob();
	const mapOverworldImageBuffer = Buffer.from(await mapOverworldImage.arrayBuffer());

	try {
		const tileBuffer = await extractTile(mapOverworldImageBuffer, x, y, zoom);

		return {
			body: tileBuffer,
			status: 200
		};
	} catch (e) {
		return {
			body: null,
			status: 200
		};
	}
};
