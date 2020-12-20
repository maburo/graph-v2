import AABB from '../math/aabb';

export interface Node<T> {
  id: number,
  x: number,
  y: number,
  payload: T
}

export interface Edge {
  from: number,
  to: number
}

export class Graph<T> {
  aabb: AABB = new AABB();
  private elementsList: Node<T>[] = [];
  private elementsMap: Map<number, Node<T>> = new Map()
  private adjacencyMap: Map<number, number[]> = new Map();

  addNode(node: Node<T>) {
    this.aabb.addPoint(node.x, node.y);
    this.elementsMap.set(node.id, node);
    this.elementsList.push(node);
  }

  addEdge(edge: Edge) {
    const to = this.adjacencyMap.get(edge.from) || [];
    to.push(edge.to);
    this.adjacencyMap.set(edge.from, to);
  }

  removeNode(id: number) {
    this.elementsMap.delete(id);
    this.elementsList = this.elementsList.filter(node => node.id === id);

    this.aabb = new AABB();
    for (const node of this.nodes) {
      this.aabb.addPoint(node.x, node.y);
    }
  }

  get empty(): boolean {
    return this.elementsList.length === 0;
  }

  get nodes() {
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
}