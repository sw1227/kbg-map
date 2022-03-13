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
import IconButton from '@mui/material/IconButton'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import GpsFixedIcon from '@mui/icons-material/GpsFixed'


const Path: NextPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Create map instance on initial render
  useEffect(() => {
    dispatch({ type: 'initMap', payload: initOptions })
    dispatch({ type: 'setMaxLimit', payload: data.result.length })
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
    if (!state.map?.isStyleLoaded()) return
    state.map.setFilter('route') // Remove existing filter
    state.map.setFilter('route', ['<=', ['get', 'route-index'], state.limit])

    // Highlight the leading node
    const hightlighNodeId = data.result[state.limit].target
    dispatch({ type: 'highlightNode', payload: hightlighNodeId })
  }, [state.limit])

  const findLocation = () => {
    if (navigator.geolocation) {
      dispatch({ type: 'setGettingLocation', payload: true })
      navigator.geolocation.getCurrentPosition(
        (pos) => { // onSuccess
          dispatch({
            type: 'setLocation',
            payload: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude
            }
          })
        },
        (err) => { // onError
          dispatch({ type: 'setGettingLocation', payload: false })
          alert(`現在地の取得に失敗しました。\n${err}`)
        },
        { timeout: 10000 }
      )
    } else {
      alert('お使いのブラウザでは現在地を取得できません')
    }
  }

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
          valueLabelDisplay="on"
        />
      </SliderContainer>
      <RightButton
        aria-label="right"
        onClick={() => { dispatch({ type: 'incrementLimit' }) }}
      >
        <ArrowForwardIcon />
      </RightButton>
      <LeftButton
        aria-label="left"
        onClick={() => { dispatch({ type: 'decrementLimit' }) }}
      >
        <ArrowBackIcon />
      </LeftButton>
      <GpsButton
        aria-label="gps"
        onClick={findLocation}
        disabled={state.gettingLocation}
      >
        <GpsFixedIcon />
      </GpsButton>
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

const RightButton = styled(IconButton)`
  position: absolute;
  bottom: 50px;
  left: calc(50% + 10px);
  position: fixed;
  touch-action: none;
  background-color: rgba(255, 255, 255, 0.8);
`

const LeftButton = styled(IconButton)`
  position: absolute;
  bottom: 50px;
  left: calc(50% - 50px);
  position: fixed;
  touch-action: none;
  background-color: rgba(255, 255, 255, 0.8);
`

const GpsButton = styled(IconButton)`
  position: absolute;
  bottom: 40px;
  right: 60px;
  position: fixed;
  touch-action: none;
  background-color: rgba(255, 255, 255, 0.8);
`
