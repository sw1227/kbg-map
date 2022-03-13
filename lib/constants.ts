import mapboxgl, { MapboxOptions } from 'mapbox-gl'
import { ORIGINS, PlaneRectangularConverter, rotate } from '../lib/converter'

export const initOptions: MapboxOptions = {
  // token: only for public usage (URL restricted)
  accessToken: "pk.eyJ1Ijoic3cxMjI3IiwiYSI6ImNrbngyazRhcjBtY3Iyd3RnODhjbDhscWsifQ.6Uc-Lboqa0WhZbnnFJWFSA",
  container: 'mapbox',
  style: 'mapbox://styles/mapbox/light-v10',
  localIdeographFontFamily: 'sans-serif',
  center: new mapboxgl.LngLat(139.744, 35.72),
  zoom: 16,
} as const

// Image overlay
type OverlaySetting = {
  imageUrl: string,
  imageShape: { width: number, height: number }, // shape of uploaded image [px]
  imageShapeMeter: {width: number, height: number}, // shape of image on map [m]
  imageRotationDeg: number,
  imageCenterLngLat: mapboxgl.LngLat,
}

export const overlaySetting: OverlaySetting = {
  imageUrl: '/kbg-map/bgmap.png',
  imageShape: { width: 5046, height: 2206 }, // shape of uploaded image [px]
  imageShapeMeter: { width: 790, height: 345 }, // shape of image on map [m]
  imageRotationDeg: -36.9,
  imageCenterLngLat: new mapboxgl.LngLat(139.74435, 35.72014),
}

const getImageVertices = (setting: OverlaySetting) => {
  const prc = new PlaneRectangularConverter(ORIGINS.IX) // Tokyo
  const { x: cx, y: cy } = prc.lngLatToXY(setting.imageCenterLngLat)

  // Plane Rectangular Coordinates (x, y) is left-handed
  // x: North, y: East
  // https://www.gsi.go.jp/LAW/heimencho.html#9
  const theta = setting.imageRotationDeg || 0
  const offsetMeter = {
    nw: rotate(- theta, { x: + setting.imageShapeMeter.height / 2, y: - setting.imageShapeMeter.width / 2}),
    ne: rotate(- theta, { x: + setting.imageShapeMeter.height / 2, y: + setting.imageShapeMeter.width / 2}),
    se: rotate(- theta, { x: - setting.imageShapeMeter.height / 2, y: + setting.imageShapeMeter.width / 2}),
    sw: rotate(- theta, { x: - setting.imageShapeMeter.height / 2, y: - setting.imageShapeMeter.width / 2}),
  }

  return {
    nw: prc.XYToLngLat({ x: cx + offsetMeter.nw.x, y: cy + offsetMeter.nw.y}),
    ne: prc.XYToLngLat({ x: cx + offsetMeter.ne.x, y: cy + offsetMeter.ne.y}),
    se: prc.XYToLngLat({ x: cx + offsetMeter.se.x, y: cy + offsetMeter.se.y}),
    sw: prc.XYToLngLat({ x: cx + offsetMeter.sw.x, y: cy + offsetMeter.sw.y}),
  }
}

export const imageVertices = getImageVertices(overlaySetting)
