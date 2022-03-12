import { FeatureCollection, Feature } from 'geojson'

export interface Node {
  id: number;
  lng: number;
  lat: number;
}

export interface Edge {
  source: Node['id'];
  target: Node['id']
}


export const nodesToGeoJson = (nodes: Node[]): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: nodes.map(node => ({
      type: 'Feature',
      id: node.id,
      geometry: {
        type: 'Point',
        coordinates: [node.lng, node.lat]
      },
      properties: {}
    }))
  }
}

export const edgesToGeoJson = (edges: Edge[], nodes: Node[]): FeatureCollection => {
  return {
    type: 'FeatureCollection',
    features: edges.map(edge => edgeToGeoJson(edge, nodes))
  }
}

export const edgeToGeoJson = (edge: Edge, nodes: Node[]): Feature => {
  const p1 = nodes.find(n => n.id === edge.source)
  const p2 = nodes.find(n => n.id === edge.target)
  return {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: (!p1 || !p2) ? [] : [
        [p1.lng, p1.lat],
        [p2.lng, p2.lat]
      ]
    },
    properties: {}
  }
}
