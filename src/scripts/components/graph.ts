import { Vector2D } from '../math';
import AABB from '../math/aabb';

export interface Node<T> {
  id: number,
  x: number,
  y: number,
  ox: number,
  oy: number,
  size: Vector2D,
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
    this.addNodeToBbox(node);
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
    const selected = this.nodes.filter(node => region.containsBbox(new AABB(node.x, node.y, node.x + node.size.x, node.y + node.size.y)));
    this.selectedNodes = new Set(selected);
    return this.selectedNodes;
  }

  addToSelection(node: Node<T>) {
    node.ox = node.x;
    node.oy = node.y;
    this.selectedNodes.add(node);
  }

  setSelection(node: Node<T>) {
    this.selectedNodes = new Set();
    this.addToSelection(node);
  }

  get selected(): Set<Node<T>> {
    return this.selectedNodes;
  }

  isSelected(node: Node<T>): boolean {
    return this.selectedNodes.has(node);
  }

  moveSelectedTo(pos: Vector2D, moveChildren?: boolean) {
    this.selectedNodes.forEach(node => {
      node.x = node.ox + pos.x;
      node.y = node.oy + pos.y;
    });

    // if (moveChildren) {
    //   this.findAllChildren(this.selectedNodes).forEach(node => {
    //     node.x = node.ox + pos.x;
    //     node.y = node.oy + pos.y;
    //   });
    // }

    this.calcBbox();
  }

  private calcBbox() {
    this.bbox.reset();
    this.nodes.forEach(this.addNodeToBbox.bind(this));
  }

  private addNodeToBbox(node: Node<T>) {
    this.bbox.addPoint(node.x, node.y);
    this.bbox.addPoint(node.x + node.size.x, node.y + node.size.y);
  }

  private findAllChildren(nodes: Node<T>[] | Set<Node<T>>): Node<T>[] {
    const children: Node<T>[] = [];
    const visited = new Set(nodes);

    nodes.forEach((node: Node<T>) => {
      const adjacent = this.getAdjacentNodes(node.id);
      children.push(...adjacent, ...this.findAllChildren(adjacent.filter(visited.has)))
    });

    return children;
  }
}




