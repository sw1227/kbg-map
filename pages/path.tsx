import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import mapboxgl, { MapboxOptions } from 'mapbox-gl'
import styles from '../styles/Path.module.css'
import { reducer, initialState } from '../lib/reducer'

const initOptions: MapboxOptions = {
  // token: only for public usage (URL restricted)
  accessToken: "pk.eyJ1Ijoic3cxMjI3IiwiYSI6ImNrbngyazRhcjBtY3Iyd3RnODhjbDhscWsifQ.6Uc-Lboqa0WhZbnnFJWFSA",
  container: 'mapbox',
  style: 'mapbox://styles/mapbox/light-v10',
  localIdeographFontFamily: 'sans-serif',
  center: new mapboxgl.LngLat(139.744, 35.72),
  zoom: 16,
} as const

const Path: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Create map instance on initial render
  useEffect(() => {
    dispatch({ type: 'initMap', payload: initOptions })
  }, [])

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
