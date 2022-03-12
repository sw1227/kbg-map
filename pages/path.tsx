import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import styles from '../styles/Path.module.css'
import { reducer, initialState } from '../lib/reducer'
import { rasterImageLayer } from '../lib/layers'
import { initOptions, overlaySetting, imageVertices } from '../lib/constants'

const Path: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Create map instance on initial render
  useEffect(() => {
    dispatch({ type: 'initMap', payload: initOptions })
  }, [])

  // Add source and event listener to the map
  useEffect(() => {
    if (!state.map) return
    const map = state.map
    map.on('style.load', () => {
      // Sources and layers
      map.addSource('raster-image', {
        type: 'image',
        url: overlaySetting.imageUrl,
        coordinates: [
          [imageVertices.nw.lng, imageVertices.nw.lat],
          [imageVertices.ne.lng, imageVertices.ne.lat],
          [imageVertices.se.lng, imageVertices.se.lat],
          [imageVertices.sw.lng, imageVertices.sw.lat],
        ]
      })
      state.map?.addLayer(rasterImageLayer);
    })
  }, [state.map])

  return (
    <>
      <Head>
        <title>KBG map</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <div id="mapbox" className={styles.mapbox} />
    </>
  )
}

export default Path
