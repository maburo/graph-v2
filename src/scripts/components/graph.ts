import { Vector2D } from '../math';
import AABB from '../math/aabb';

type ID = number;
type NodeMap<T> = Map<ID, Node<T>>;
type NodeSet<T> = Set<Node<T>>;

interface DragContext<T> {
  origin: Vector2D;
  startPositions: Map<ID, Vector2D>;
  nodes: Node<T>[];
  hasChildren: boolean;
}

export interface Node<T> {
  id: ID;
  x: number;
  y: number;
  size: Vector2D;
  payload: T;
}

export interface Edge {
  from: number;
  to: number;
}

export class Graph<T> {
  readonly bbox: AABB = new AABB();
  private elementsList: Node<T>[] = [];
  private elementsMap: NodeMap<T> = new Map()
  private adjacencyMap: Map<ID, ID[]> = new Map();
  private selectedNodes: NodeSet<T> = new Set();
  private dragContext: DragContext<T>;

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
    this.reCalcBbox();
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

  /**
   * Selection
   */
  select(region: AABB): NodeSet<T> {
    const selected = this.nodes.filter(node => region.containsBbox(new AABB(node.x, node.y, node.x + node.size.x, node.y + node.size.y)));
    this.selectedNodes = new Set(selected);
    return this.selectedNodes;
  }

  addToSelection(node: Node<T>): NodeSet<T> {
    this.selectedNodes.add(node);
    return this.selectedNodes;
  }

  setSelection(node: Node<T>): NodeSet<T> {
    this.selectedNodes = new Set();
    return this.addToSelection(node);
  }

  get selected(): NodeSet<T> {
    return this.selectedNodes;
  }

  isSelected(node: Node<T>): boolean {
    return this.selectedNodes.has(node);
  }

  /**
   * Drag
   */
  startDrag(origin: Vector2D) {
    const nodes = [...this.selectedNodes];

    this.dragContext = {
      hasChildren: false,
      origin,
      nodes,
      startPositions: nodes.reduce((acc, node) => acc.set(node.id, new Vector2D(node.x, node.y)), new Map<ID, Vector2D>())
    };
  }

  dragSelectedTo(pos: Vector2D, moveChildren?: boolean) {
    const { origin, startPositions, nodes, hasChildren } = this.dragContext;
    const shift = pos.sub(origin);

    if (moveChildren && !hasChildren) {
      const selected = [...this.selectedNodes];
      this.findAllChildren(selected).forEach(node => {
        nodes.push(node);
        startPositions.set(node.id, new Vector2D(node.x, node.y));
      });
      this.dragContext.hasChildren = true;
    } else if (!moveChildren && hasChildren) {
      nodes.filter(el => !this.selectedNodes.has(el))
      .forEach(el => {
        const pos = startPositions.get(el.id);
        el.x = pos.x;
        el.y = pos.y;
      });

      this.dragContext.nodes = [...this.selectedNodes];
      this.dragContext.hasChildren = false;
    }

    nodes.forEach(node => {
      const pos = startPositions.get(node.id).add(shift)
      node.x = pos.x;
      node.y = pos.y;
    });

    this.reCalcBbox();
  }

  /**
   * Clears bounding box and recalcs its size
   */
  private reCalcBbox() {
    this.bbox.reset();
    this.nodes.forEach(this.addNodeToBbox.bind(this));
  }

  private addNodeToBbox(node: Node<T>) {
    this.bbox.addPoint(node.x, node.y);
    this.bbox.addPoint(node.x + node.size.x, node.y + node.size.y);
  }

  /**
   * Recursevly searches for children nodes
   * @param nodes starting array
   * @param visited a set which contains already visited nodes
   */
  private findAllChildren(nodes: Node<T>[]): Node<T>[] {
    if (nodes.length === 0) return [];

    const children: Node<T>[] = [];
    const visited = new Set(nodes);
    const isNotVisited = (node: Node<T>) => !visited.has(node);
    const toVisit: Node<T>[] = nodes.reduce((acc, node) => {
      acc.push(...this.getAdjacentNodes(node.id).filter(isNotVisited));
      return acc;
    }, []);
   
    while (toVisit.length > 0) {
      const node = toVisit.pop()
      children.push(node);
      visited.add(node);
      toVisit.push(...this.getAdjacentNodes(node.id).filter(isNotVisited));
    }

    return children;
  }
}
