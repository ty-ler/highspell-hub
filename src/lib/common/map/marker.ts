import type { ItemDef } from 'src/interfaces/game/item-defs';
import type { Location } from '$lib/common/locations';
import { L } from './constants';
import { worldXToPixel, worldYToPixel } from './helpers';

export const hideMarker = (marker: L.Marker) => {
	const m: any = marker;
	m.__visible = false;

	marker.setOpacity(0);
	marker.options.interactive = false;

	const tooltip = marker.getTooltip();
	if (tooltip) {
		tooltip.setOpacity(0);
		marker.options.interactive = false;
	}
};
export const showMarker = (marker: L.Marker, interactive: boolean = true) => {
	const m: any = marker;
	m.__visible = true;

	marker.setOpacity(1);
	marker.options.interactive = interactive;

	const tooltip = marker.getTooltip();
	if (tooltip) {
		tooltip.setOpacity(1);
		marker.options.interactive = interactive;
	}
};

export const hideMarkers = (markers: L.Marker[]) => {
	markers.forEach((m) => hideMarker(m));
};

export const showMarkers = (markers: L.Marker[], interactive: boolean = true) => {
	markers.forEach((m) => showMarker(m, interactive));
};

export const setMarkerFilteredOut = (marker: L.Marker, filtered: boolean) => {
	const m: any = marker;
	m.__filtered = filtered;
};

export const getMarkerFilteredOut = (marker: L.Marker) => {
	const m: any = marker;
	return m.__filtered ? true : false;
};

export const isMarkerVisible = (marker: L.Marker) => {
	const m: any = marker;
	return m.__visible ? true : false;
};

export const setMarkerId = (marker: L.Marker, id: string) => {
	const m: any = marker;
	m.__markerId = id;
};

export const getMarkerId = (marker: L.Marker): string => {
	const m: any = marker;
	return m.__markerId;
};

export const setMarkerData = (marker: L.Marker, data: any) => {
	const m: any = marker;
	m.__data = data;
};

export const getMarkerData = (marker: L.Marker) => {
	const m: any = marker;
	return m.__data;
};

export const filterMarkers = (markers: L.Marker[], filterValue: string) => {
	if (!filterValue) {
		markers.forEach((m) => setMarkerFilteredOut(m, false));
		return;
	}

	filterValue = filterValue.toLowerCase();

	markers.forEach((m) => {
		const markerId = getMarkerId(m)?.toLowerCase();
		if (markerId == null) return;
		if (markerId.includes(filterValue)) {
			setMarkerFilteredOut(m, false);
		} else {
			setMarkerFilteredOut(m, true);
		}
	});
};

export const createGroundItemMarkers = (i: ItemDef) => {
	const iconUrl = i.icon;
	const icon = L.icon({
		iconUrl,
		iconSize: [36, 36],
		popupAnchor: [0, 0],
		className: 'map-ground-item-marker-icon'
	});

	return i.groundItems.map((gi) => {
		const pixelX = worldXToPixel(gi.x);
		const pixelY = worldYToPixel(gi.y);

		const marker = L.marker([pixelY, pixelX], { icon, title: i.name });
		marker.bindPopup(
			`
			<a href="/items/${i._id}" class="map-ground-item-popup-title">
				<strong>${i.name}</strong>
			</a>
		`,
			{
				className: 'map-ground-item-popup',
				autoPan: false
			}
		);

		setMarkerId(marker, i.name);
		setMarkerData(marker, {
			item: i,
			groundItem: gi
		});

		return marker;
	});
};

export const addGroundItemsMarkers = (itemDefs: ItemDef[], map: L.Map) => {
	const markers = itemDefs
		.filter((i) => i?.groundItems?.length > 0)
		.map((i) => createGroundItemMarkers(i))
		.flat()
		.map((m) => m.addTo(map));

	return markers;
};

export const createLocationMarker = (loc: Location) => {
	const icon = L.divIcon({
		// html: `<div class="map-location-marker-name">${loc.name}</div>`,
		className: 'map-location-marker'
	});

	const pixelX = worldXToPixel(loc.x);
	const pixelY = worldYToPixel(loc.y);

	const marker = L.marker([pixelY, pixelX], {
		icon
	});

	const div = document.createElement('div');
	div.innerHTML = loc.name;

	if (loc.style) {
		Object.entries(loc.style).map(([style, value]) => {
			div.style.setProperty(style, value as string);
		});
	}

	marker.bindTooltip(div.outerHTML, {
		permanent: true,
		interactive: true,
		direction: 'bottom',
		className: 'map-location-marker-tooltip',
		offset: [0, -16]
	});

	return marker;
};

export const addLocationMarkers = (locs: Location[], map: L.Map) => {
	const markers = locs
		.filter((loc) => loc.x != null && loc.y != null)
		.map((loc) => {
			const marker = createLocationMarker(loc);
			marker.addTo(map);

			setMarkerId(marker, loc.name);
			setMarkerData(marker, {
				loc
			});

			return marker;
		});

	return markers;
};
