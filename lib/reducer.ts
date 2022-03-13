import { Reducer } from 'react'
import mapboxgl, { MapboxOptions } from 'mapbox-gl'

export type EditorState = {
  map?: mapboxgl.Map,
  maxLimit?: number,
  limit: number,
  highlightNodeId?: number,
  gettingLocation: boolean,
  location?: { lng: number, lat: number },
  gpsMarker?: mapboxgl.Marker,
}

export const initialState: EditorState = {
  limit: 100,
  gettingLocation: false,
}

type Action =
  | { type: 'initMap', payload: MapboxOptions }
  | { type: 'setMaxLimit', payload: number }
  | { type: 'setLimit', payload: number }
  | { type: 'incrementLimit' }
  | { type: 'decrementLimit' }
  | { type: 'highlightNode', payload: number }
  | { type: 'setGettingLocation', payload: boolean }
  | { type: 'setLocation', payload: { lng: number, lat: number } }


export const reducer: Reducer<EditorState, Action> = (state, action) => {
  switch (action.type) {
    case 'initMap':
      const map = new mapboxgl.Map(action.payload)
      return {
        ...state,
        map,
      }
    case 'setMaxLimit':
      return {
        ...state,
        maxLimit: action.payload,
      }
    case 'setLimit':
      return {
        ...state,
        limit: action.payload,
      }
    case 'incrementLimit':
      return {
        ...state,
        limit: Math.min(state.limit + 1, state.maxLimit || Infinity),
      }
    case 'decrementLimit':
      return {
        ...state,
        limit: Math.max(state.limit - 1, 0),
      }
    case 'highlightNode':
      const highlightNodeId = action.payload
      // Unset flag of previously highlighted node if exists
      if (state.highlightNodeId !== undefined) {
        state.map?.setFeatureState(
          { source: 'nodes', id: state.highlightNodeId },
          { highlight: false }
        )
      }
      // Set flag of newly highlighted node
      state.map?.setFeatureState(
        { source: 'nodes', id: highlightNodeId },
        { highlight: true }
      )
      return {
        ...state,
        highlightNodeId
      }
    case 'setGettingLocation':
      return {
        ...state,
        gettingLocation: action.payload,
      }
    case 'setLocation':
      const loc = action.payload
      let ret: EditorState = {
        ...state,
        location: loc,
        gettingLocation: false,
        gpsMarker: undefined,
      }
      if (state.gpsMarker) state.gpsMarker.remove()
      if (state.map) {
        const gpsMarker = new mapboxgl.Marker()
          .setLngLat([loc.lng, loc.lat])
          .addTo(state.map)
        ret = { ...ret, gpsMarker }
      }
      return ret
    default:
      return state
  }
}
