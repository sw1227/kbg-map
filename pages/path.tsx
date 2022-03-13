import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useReducer } from 'react'
import styles from '../styles/Path.module.css'
import { reducer, initialState } from '../lib/reducer'
import { rasterImageLayer, nodesLayer, edgesLayer, routeEdgesLayer } from '../lib/layers'
import { initOptions, overlaySetting, imageVertices } from '../lib/constants'
import { edgesToGeoJson, nodesToGeoJson } from '../lib/map'
import data from '../public/cpp_result.json'

import styled from 'styled-components'
import * as d3 from 'd3'
import Slider from '@mui/material/Slider'


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
      // Raster image
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

      // Edges
      map.addSource('edges', {
        type: 'geojson',
        data: edgesToGeoJson(data.links, data.nodes)
      })
      map.addLayer(edgesLayer)

      // Route
      map.addSource('route', {
        type: 'geojson',
        data: edgesToGeoJson(data.result, data.nodes)
      })
      const routeColors = data.result.map((_, i) => ({
        idx: i,
        color: d3.interpolateSpectral(i / data.result.length)
      }))
      map.addLayer(routeEdgesLayer(routeColors))
      map.setFilter('route', ['<=', ['get', 'route-index'], state.limit])

      // Nodes
      map.addSource('nodes', {
        type: 'geojson',
        data: nodesToGeoJson(data.nodes)
      })
      map.addLayer(nodesLayer)
    })
  }, [state.map])

  // Update feature filter when limit is changed
  useEffect(() => {
    state.map?.setFilter('route') // Remove existing filter
    state.map?.setFilter('route', ['<=', ['get', 'route-index'], state.limit])
  }, [state.limit])

  return (
    <>
      <Head>
        <title>KBG map</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v2.0.1/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <div id="mapbox" className={styles.mapbox} />
      <SliderContainer>
        <Slider
          value={state.limit}
          onChange={(_, value) => { dispatch({ type: 'setLimit', payload: value as number }) }}
          min={0}
          max={data.result.length}
          step={1}
          size="small"
          aria-label="Limit"
          valueLabelDisplay="auto"
        />
      </SliderContainer>
    </>
  )
}

export default Path

const SliderContainer = styled.div`
  position: absolute;
  bottom: 100px;
  left: 10vw;
  width: 80vw;
  height: 32px;
  padding: 0px 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  position: fixed;
  touch-action: pan-x;
`
