import { Reducer } from 'react'
import mapboxgl, { MapboxOptions } from 'mapbox-gl'

export type EditorState = {
  map?: mapboxgl.Map,
  maxLimit?: number,
  limit: number,
  highlightNodeId?: number,
}

export const initialState: EditorState = {
  limit: 100,
}

type Action =
  | { type: 'initMap', payload: MapboxOptions }
  | { type: 'setMaxLimit', payload: number }
  | { type: 'setLimit', payload: number }
  | { type: 'incrementLimit' }
  | { type: 'decrementLimit' }
  | { type: 'highlightNode', payload: number }


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
    default:
      return state
  }
}
