import type { Load } from '@sveltejs/kit';

export const get: Load = ({ fetch }) => {
	return {
		status: 200
	};
};
