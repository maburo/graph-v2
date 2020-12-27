import { Vector2D } from '../math';
import AABB from '../math/aabb';

export interface Node<T> {
  id: number,
  x: number,
  y: number,
  bbox: AABB,
  payload: T
}

export interface Edge {
  from: number,
  to: number
}

export class Graph<T> {
  readonly bbox: AABB = new AABB();
  private elementsList: Node<T>[] = [];
  private elementsMap: Map<number, Node<T>> = new Map()
  private adjacencyMap: Map<number, number[]> = new Map();
  private selectedNodes: Set<Node<T>> = new Set();

  addNode(node: Node<T>) {
    this.bbox.addPoint(node.x, node.y);
    this.elementsMap.set(node.id, node);
    this.elementsList.push(node);
  }

  addEdge(edge: Edge): boolean {
    if (!this.elementsMap.has(edge.from) ||
        !this.elementsMap.has(edge.to)) 
    {
      console.warn("Can't add edge", edge);
      return false;
    }
    
    const to = this.adjacencyMap.get(edge.from) || [];
    to.push(edge.to);
    this.adjacencyMap.set(edge.from, to);
    return true;
  }

  removeNode(id: number) {
    this.elementsMap.delete(id);
    this.elementsList = this.elementsList.filter(node => node.id === id);
    this.calcBbox();
  }

  private calcBbox() {
    this.bbox.reset();
    for (const node of this.nodes) {
      this.bbox.addPoint(node.x, node.y);
    }
  }

  get empty(): boolean {
    return this.elementsList.length === 0;
  }

  getNode(id: number) {
    return this.elementsMap.get(id);
  }

  get nodes(): Node<T>[] {
    return this.elementsList;
  }

  getNodes(filter: (node: Node<T>) => Boolean) {
    return this.elementsList.filter(filter)
  }

  getAdjacentNodes(id: number): Node<T>[] {
    const ids = this.adjacencyMap.get(id);
    if (!ids) return [];
    return ids.map(id => this.elementsMap.get(id));
  }

  select(region: AABB): Set<Node<T>> {
    const selected = this.nodes.filter(node => region.containsBbox(node.bbox));
    this.selectedNodes = new Set(selected);
    return this.selectedNodes;
  }

  addToSelection(node: Node<T>) {
    this.selectedNodes.add(node);
  }

  setSelection(node: Node<T>) {
    this.selectedNodes = new Set([node]);
  }

  get selected(): Set<Node<T>> {
    return this.selectedNodes;
  }

  isSelected(node: Node<T>): boolean {
    return this.selectedNodes.has(node);
  }

  moveSelectedTo(pos: Vector2D) {
    this.selectedNodes.forEach(node => {
      node.x = pos.x;
      node.y = pos.y;
    });
    this.calcBbox();
  }
}