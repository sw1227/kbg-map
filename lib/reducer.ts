import { Reducer } from 'react'
import mapboxgl, { MapboxOptions } from 'mapbox-gl'

export type EditorState = {
  map?: mapboxgl.Map,
  limit: number,
}

export const initialState: EditorState = {
  limit: 100,
}

type Action =
  | { type: 'initMap', payload: MapboxOptions }
  | { type: 'setLimit', payload: number }


export const reducer: Reducer<EditorState, Action> = (state, action) => {
  switch (action.type) {
    case 'initMap':
      const map = new mapboxgl.Map(action.payload)
      return {
        ...state,
        map,
      }
    case 'setLimit':
      return {
        ...state,
        limit: action.payload,
      }
    default:
      return state
  }
}
