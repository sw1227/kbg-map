import mapboxgl from "mapbox-gl"

export const rasterImageLayer: mapboxgl.RasterLayer = {
  id: 'raster-image',
  type: 'raster',
  source: 'raster-image',
  paint: {
    'raster-fade-duration': 0,
    'raster-opacity': 0.4
  }
}

export const nodesLayer: mapboxgl.CircleLayer = {
  id: 'nodes',
  type: 'circle',
  source: 'nodes',
  layout: {},
  paint: {
    'circle-radius': 4,
    'circle-color': '#f08',
    'circle-opacity': 0.4,
    'circle-stroke-width': 0,
    'circle-stroke-color': '#f00',
  }
}

export const edgesLayer: mapboxgl.LineLayer = {
  id: 'edges',
  type: 'line',
  source: 'edges',
  layout: {},
  paint: {
    'line-color': '#000',
    'line-opacity': 0.1,
    'line-width': 3,
  }
}

export const routeEdgesLayer = (colors: { idx: number, color: string }[]): mapboxgl.LineLayer => ({
  id: 'route',
  type: 'line',
  source: 'route',
  layout: {},
  paint: {
    'line-color': [
      'case',
      ...colors.map(({idx, color}) => [['==', ['get', 'route-index'], idx], color]).flat(),
      '#00f',
    ],
    'line-opacity': 0.8,
    'line-width': 4,
  }
})
