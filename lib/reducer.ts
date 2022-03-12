import { Reducer } from 'react'
import mapboxgl, { MapboxOptions } from 'mapbox-gl'

export type EditorState = {
  map?: mapboxgl.Map,
}

export const initialState: EditorState = {
}

type Action =
  | { type: 'initMap', payload: MapboxOptions }


export const reducer: Reducer<EditorState, Action> = (state, action) => {
  switch (action.type) {
    case 'initMap':
      const map = new mapboxgl.Map(action.payload)
      return {
        ...state,
        map,
      }
    default:
      return state
  }
}
