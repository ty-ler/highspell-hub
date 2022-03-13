<script lang="ts">
	import { onMount } from 'svelte';
	import type { ItemDef } from 'src/interfaces/game/item-defs';
	import Fa from 'svelte-fa/src/fa.svelte';
	import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
	import { Location, locations } from '$lib/common/locations';
	import InputText from '../InputText/InputText.svelte';
	import {
		MAP_CENTER,
		MAP_DEFAULT_ZOOM,
		MAP_MAX_ZOOM,
		MAP_MIN_ZOOM,
		MAP_OVERWORLD_FILENAME,
		MAP_OVERWORLD_MINIMAP_FILENAME,
		MAP_SIZE
	} from '$lib/common/map/constants';
	import {
		addGroundItemsMarkers,
		addLocationMarkers,
		filterMarkers,
		getMarkerData,
		getMarkerFilteredOut
	} from '$lib/common/map/marker';
	import type { Coordinates } from 'src/interfaces/common/map';
	import { pixelXToWorld, pixelYToWorld } from '$lib/common/map/helpers';
	import { delay } from '$lib/utils/delay';
	import { orderBy } from 'lodash-es';
	import { browser } from '$app/env';

	export let itemDefs: ItemDef[];

	let mouseWorld: Coordinates;
	let mousePixel: Coordinates;
	let map: L.Map;
	let mapReady: boolean = false;
	let legendOpen: boolean = true;
	let legendSectionOpenStates: { [sectionId: string]: boolean } = {};
	let forceHideCoordinates: boolean = false;

	let groundItemMarkers: L.Marker[];
	let locationMarkers: L.Marker[];

	$: {
		itemDefs = orderBy(itemDefs, (i) => i.name);
	}

	const handleMapMouseMove = (e: L.LeafletMouseEvent) => {
		const { latlng } = e;
		const pixelX = latlng.lng;
		const pixelY = latlng.lat;

		if (pixelX < 0 || pixelY < 0 || pixelX > MAP_SIZE || pixelY > MAP_SIZE) {
			mouseWorld = null;
			mousePixel = null;
			return;
		}

		const worldX = pixelXToWorld(pixelX);
		const worldY = pixelYToWorld(pixelY);

		mouseWorld = {
			x: Math.floor(worldX),
			y: Math.floor(worldY)
		};

		mousePixel = {
			x: Math.floor(pixelX),
			y: Math.floor(pixelY)
		};
	};

	const handleMapMouseOut = (e: L.LeafletMouseEvent) => {
		mouseWorld = null;
		mousePixel = null;
	};

	const handleLegendMouseEnter = (e: MouseEvent) => {
		disableMapZoom();
		disableMapPan();

		forceHideCoordinates = true;
	};

	const handleLegendMouseLeave = (e: MouseEvent) => {
		enableMapZoom();
		enableMapPan();

		forceHideCoordinates = false;
	};

	const handleClickMapLegendHeader = (e: MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();

		legendOpen = !legendOpen;
	};

	const handleClickMapLegendSectionHeader = (e: MouseEvent, sectionId: string) => {
		const openState = legendSectionOpenStates[sectionId];
		legendSectionOpenStates[sectionId] = !openState;
	};

	const handleClickMapLegendLocation = (e: MouseEvent, marker: L.Marker) => {
		flyToMarker(marker);
	};

	const handleClickMapLegendGroundItem = (e: MouseEvent, marker: L.Marker) => {
		flyToMarker(marker);
	};

	const handleChangeFilterField = (filterValue: string) => {
		filter(filterValue);
	};

	const flyToMarker = (marker: L.Marker) => {
		map.flyTo(marker.getLatLng(), 2, {
			animate: false
		});

		if (marker.getPopup()) {
			delay().then(() => {
				marker.openPopup();
			});
		}
	};

	const showFilteredMarker = (marker: L.Marker) => !getMarkerFilteredOut(marker);

	const allMarkersFilteredOut = (markers: L.Marker[]) => {
		return markers?.filter((m) => !getMarkerFilteredOut(m))?.length > 0;
	};

	const filter = (filterValue: string) => {
		filterMarkers(groundItemMarkers, filterValue);
		filterMarkers(locationMarkers, filterValue);

		groundItemMarkers = groundItemMarkers;
		locationMarkers = locationMarkers;

		if (allMarkersFilteredOut(groundItemMarkers)) legendSectionOpenStates['ground-items'] = true;
		if (allMarkersFilteredOut(locationMarkers)) legendSectionOpenStates['locations'] = true;
	};

	const disableMapZoom = () => {
		if (!map) return;

		map.boxZoom.disable();
		map.scrollWheelZoom.disable();
		map.doubleClickZoom.disable();
		map.scrollWheelZoom.disable();
	};

	const enableMapZoom = () => {
		if (!map) return;

		map.boxZoom.enable();
		map.scrollWheelZoom.enable();
		map.doubleClickZoom.enable();
		map.scrollWheelZoom.enable();
	};

	const disableMapPan = () => {
		if (!map) return;

		map.dragging.disable();
	};

	const enableMapPan = () => {
		if (!map) return;

		map.dragging.enable();
	};

	const buildMap = async () => {
		if (browser) {
			mapReady = false;

			const L = window.L;

			map = L.map('map', {
				crs: L.CRS.Simple,
				center: [MAP_CENTER, MAP_CENTER],
				maxBoundsViscosity: 1,
				maxZoom: MAP_MAX_ZOOM,
				minZoom: MAP_MIN_ZOOM,
				bounceAtZoomLimits: false
			});

			const mapBounds = new L.LatLngBounds([
				[0, MAP_SIZE],
				[MAP_SIZE, 0]
			]);

			map.setView([MAP_CENTER, MAP_CENTER], MAP_DEFAULT_ZOOM);
			map.setMaxBounds(mapBounds);

			L.imageOverlay(
				`/client-caches/current/gameAssets/${MAP_OVERWORLD_FILENAME}`,
				mapBounds
			).addTo(map);
			L.imageOverlay(
				`/client-caches/current/gameAssets/${MAP_OVERWORLD_MINIMAP_FILENAME}`,
				mapBounds
			).addTo(map);

			map.addEventListener('mouseout', (e: L.LeafletMouseEvent) => handleMapMouseOut(e));
			map.addEventListener('mousemove', (e: L.LeafletMouseEvent) => handleMapMouseMove(e));

			groundItemMarkers = addGroundItemsMarkers(itemDefs, map);
			locationMarkers = addLocationMarkers(locations, map);

			mapReady = true;
		}
	};

	onMount(async () => {
		await buildMap();
	});
</script>

<div id="map-container">
	<div id="map" style:--map-size="{MAP_SIZE}px" />
	{#if mapReady}
		<!-- on:mouseenter={(e) => handleLegendMouseEnter(e)}
				on:mouseleave={(e) => handleLegendMouseLeave(e)} -->
		<div class="map-info-panels">
			{#if !forceHideCoordinates}
				<div class="map-info-coords map-info-panel" class:map-info-coords-hidden={!mouseWorld}>
					<strong>x: </strong>
					<span>{mouseWorld?.x ?? 0}, </span>
					<strong>z: </strong>
					<span>{mouseWorld?.y ?? 0}</span>
				</div>
			{/if}
			<div class="map-info-legend map-info-panel" class:map-info-legend-open={legendOpen}>
				<div class="map-info-legend-header" on:click={(e) => handleClickMapLegendHeader(e)}>
					<div class="map-info-legend-title">Legend</div>
					<Fa icon={faChevronDown} />
				</div>
				<div class="map-info-legend-content">
					<div class="map-info-legend-content-filter">
						<InputText
							showClear
							disableFocusBorder
							placeholder="Filter"
							class="map-info-legend-content-filter-input"
							on:valueChanged={({ detail }) => handleChangeFilterField(detail.value)}
						/>
					</div>
					<div class="map-info-legend-content-sections">
						{#if allMarkersFilteredOut(locationMarkers)}
							<div class="map-info-legend-content-section">
								<div
									class="map-info-legend-content-section-header"
									on:click={(e) => handleClickMapLegendSectionHeader(e, 'locations')}
								>
									<div class="map-info-legend-content-section-title">Locations</div>
									<Fa icon={faChevronDown} />
								</div>
								{#if legendSectionOpenStates['locations']}
									<div class="map-info-legend-content-section-content">
										<div class="map-info-legend-content-section-content-list">
											{#each locationMarkers as m}
												{#if showFilteredMarker(m)}
													<div
														class="map-info-legend-content-section-content-list-item"
														on:click={(e) => handleClickMapLegendLocation(e, m)}
													>
														{getMarkerData(m).loc.name}
													</div>
												{/if}
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/if}
						{#if allMarkersFilteredOut(groundItemMarkers)}
							<div class="map-info-legend-content-section">
								<div
									class="map-info-legend-content-section-header"
									on:click={(e) => handleClickMapLegendSectionHeader(e, 'ground-items')}
								>
									<div class="map-info-legend-content-section-title">Ground Items</div>
									<Fa icon={faChevronDown} />
								</div>
								{#if legendSectionOpenStates['ground-items']}
									<div class="map-info-legend-content-section-content">
										<div class="map-info-legend-content-section-content-list">
											{#each groundItemMarkers as m}
												{#if showFilteredMarker(m)}
													<div
														class="map-info-legend-content-section-content-list-item"
														on:click={(e) => handleClickMapLegendGroundItem(e, m)}
													>
														{getMarkerData(m).item.name}
													</div>
												{/if}
											{/each}
										</div>
									</div>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	#map-container {
		display: flex;
		flex-direction: column;
		overflow: hidden;

		--map-overlay-margin: 10px;

		.map-info-panels {
			display: flex;
			flex-direction: row;
			align-items: flex-start;
			gap: 0.5rem;
			position: absolute;
			top: var(--map-overlay-margin);
			right: var(--map-overlay-margin);
			max-height: calc(100% - (10px * 2));
			overflow: hidden;
			z-index: 401;
			pointer-events: none;

			.map-info-panel {
				background: var(--surface-100);
				border: 1px solid var(--surface-300);
				border-radius: 4px;
				padding: 0.5rem;
				color: var(--text-color);
				box-shadow: 0 0px 8px rgb(0 0 0 / 40%);
				pointer-events: all;
			}
		}

		.map-info-legend {
			display: flex;
			flex-direction: column;
			align-self: stretch;
			width: 225px;
			padding: 0 !important;
			max-height: 100%;

			.map-info-legend-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				border-bottom: 1px solid var(--surface-300);
				width: 100%;
				font-size: 1rem;
				font-weight: bold;
				padding: 0.65rem 0.75rem;
				cursor: pointer;

				transition: background 0.2s ease 0s;

				&:hover {
					// background: var(--surface-200);
				}
			}

			.map-info-legend-content {
				display: flex;
				flex-direction: column;
				height: 100%;
				overflow: hidden;
				// max-height: 450px;

				.map-info-legend-content-filter {
					display: flex;

					:global {
						> * {
							width: 100%;
						}

						.map-info-legend-content-filter-input {
							width: 100%;
							border-radius: 0;
							padding: 0.75rem;
							max-height: 35px;
							background: var(--surface-150);

							&:not(:focus) {
								border-color: transparent;
								border-bottom-color: var(--surface-200);
							}

							&:focus {
							}
						}
					}
				}
				.map-info-legend-content-sections {
					display: flex;
					flex-direction: column;
					overflow: auto;
					flex: 1;
				}

				.map-info-legend-content-section {
					display: flex;
					flex-direction: column;
					// height: 100%;

					&:not(:last-of-type) {
						.map-info-legend-content-section-header {
							border-bottom: 1px solid var(--surface-200);
						}
					}

					.map-info-legend-content-section-header {
						display: flex;
						justify-content: space-between;
						align-items: center;
						font-size: 0.85rem;
						font-weight: bold;
						gap: 0.5rem;
						padding: 0.65rem 0.75rem;
						cursor: pointer;
						position: sticky;
						top: 0;
						background: var(--surface-100);

						&:hover {
							// background: var(--surface-200);
						}

						.map-info-legend-content-section-title {
						}
					}

					.map-info-legend-content-section-content {
						display: flex;
						flex-direction: column;
						background: var(--surface-150);

						.map-info-legend-content-section-content-list {
							display: flex;
							flex-direction: column;

							.map-info-legend-content-section-content-list-item {
								font-size: 14px;
								padding: 0.65rem 0.75rem;
								cursor: pointer;

								&:hover {
									background: var(--surface-200);
								}
							}
						}
					}
				}
			}

			&:not(.map-info-legend-open) {
				.map-info-legend-content {
					display: none;
				}
			}

			&.map-info-legend-open {
				.map-info-legend-header {
					// background: var(--surface-150);

					&:hover {
						// background: var(--surface-200);
					}
				}
			}
		}

		.map-info-coords {
			font-size: 0.9rem;
			opacity: 1;
			pointer-events: none !important;

			transition: opacity 0.2s ease 0s;

			&.map-info-coords-hidden {
				opacity: 0;
			}
		}
	}

	:global {
		#map-container {
			position: relative;
			height: 100%;
			width: 100%;

			.leaflet-left .leaflet-control {
				margin-left: var(--map-overlay-margin);
			}

			.leaflet-top .leaflet-control {
				margin-top: var(--map-overlay-margin);
			}
		}

		#map {
			// position: relative;
			height: 100%;
			width: 100%;
			// max-width: var(--map-size);
			// max-height: var(--map-size);
			margin: 0 auto;
			user-select: none;

			.leaflet-control-attribution {
				display: none;
			}

			.map-ground-item-marker-icon {
				// background: blue;
				max-width: 48px !important;
				max-height: 48px !important;
			}

			.map-ground-item-popup-title {
				// background: blue;
				font-size: 1rem;
			}

			.map-location-marker {
				display: flex;
				justify-content: center;
				align-items: center;
				line-height: normal !important;
				width: auto !important;
				height: auto !important;
				white-space: nowrap;
				left: -50%;
				position: relative;
				z-index: 500 !important;

				.map-location-marker-name {
					text-align: center;
					font-size: 1.35rem;
					font-weight: bold;
					-webkit-text-stroke-width: 1px;
					-webkit-text-stroke-color: black;
				}
			}

			.leaflet-popup-content-wrapper {
				a {
					color: var(--text-color);
				}
			}

			.map-location-marker-tooltip {
				color: white;
				font-size: 1rem;
				// font-weight: bold;
				background: transparent;
				box-shadow: none;
				border: none;
				padding: 0;
				margin: 0;
				white-space: normal;
				text-align: center;
				line-height: 1.25;
				text-shadow: 2px 2px 0px black;
				// -webkit-text-stroke-width: 1px;
				// -webkit-text-stroke-color: black;

				&::before {
					border: none;
				}
			}
		}
	}
</style>
