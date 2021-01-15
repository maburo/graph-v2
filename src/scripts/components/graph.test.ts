import { Vector2D } from '../math';
import { Edge, Node, Graph } from './graph';

const defaultSize = new Vector2D();

interface Element {
  id: number;
  size?: Vector2D;
  x?: number;
  y?: number;
  connections?: number[];
}

function parser(obj: Element): [Node<any>, Edge[]] {
  return [
    {
      id: obj.id,
      payload: obj,
      size: obj.size ?? defaultSize,
      x: obj.x ?? 0,
      y: obj.y ?? 0
    },
    obj.connections?.map((to, idx) => ({from: obj.id, to, idx})) ?? []
  ]
}

test('delete node with edges', () => {
  const graph = new Graph<Element>(parser);

  const expectedNodes = [0, 1, 3];
  const expectedEdges = ['0-1', '3-1'];
  graph.addStateListner((nodes, edges) => {
    expect(nodes).toEqual(expectedNodes);
    expect(edges).toEqual(expectedEdges)
  });

  graph.addAll([
    { id: 0, connections: [1, 2] },
    { id: 1 },
    { id: 2, connections: [3] },
    { id: 3, connections: [1] }
  ]);

  graph.setSelection(graph.getNode(2));
  graph.removeNodes(graph.selected);
  
  expect(graph.nodeIds).toEqual(expectedNodes);
  expect(graph.edgeIds).toEqual(expectedEdges);
});