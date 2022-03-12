export const rasterImageLayer: mapboxgl.RasterLayer = {
  id: 'raster-image',
  type: 'raster',
  source: 'raster-image',
  paint: {
    'raster-fade-duration': 0,
    'raster-opacity': 0.4
  }
}
