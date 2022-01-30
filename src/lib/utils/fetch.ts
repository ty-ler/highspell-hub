import type { ClientCacheVersion } from 'lib';

type Fetch = (info: RequestInfo, init?: RequestInit) => Promise<Response>;

export const fetchItemDefs = async (version: ClientCacheVersion, fetch: Fetch) => {
	const res = await fetch(`/client-caches/${version}/compiled/itemDefs/itemDefs.json`);
	return await res.json();
};
