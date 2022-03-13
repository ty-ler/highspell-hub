import type { Coordinates } from 'src/interfaces/common/map';
import { MAP_CENTER } from './constants';

export const worldXToPixel = (worldX: number) => worldX + MAP_CENTER;
export const worldYToPixel = (worldY: number) => worldY + MAP_CENTER;

export const worldToPixel = (worldX: number, worldY: number): Coordinates => ({
	x: worldXToPixel(worldX),
	y: worldYToPixel(worldY)
});

export const pixelXToWorld = (pixelX: number) => pixelX - MAP_CENTER;
export const pixelYToWorld = (pixelY: number) => pixelY - MAP_CENTER;

export const pixelToWorld = (pixelX: number, pixelY: number): Coordinates => ({
	x: pixelXToWorld(pixelX),
	y: pixelYToWorld(pixelY)
});
