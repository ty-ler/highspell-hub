import { fetchItems } from '$lib/utils/fetch';
import type { Load } from '@sveltejs/kit';
import type { ClientCacheVersion } from 'lib';

export const get: Load = ({ fetch }) => {
	const ver: ClientCacheVersion = 'current';
	const items = fetchItems(ver, fetch);

	return {
		status: 200
	};
};
