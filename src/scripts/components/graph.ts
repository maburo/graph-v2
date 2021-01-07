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
  xoffset: number;
  yoffset: number;
  from: number;
  to: number;
}

interface NodeEdge<T> {
  key: string,
  xoffset: number;
  yoffset: number;
  from: Node<T>;
  to: Node<T>;
  type: EdgeType,
}

enum EdgeType {
  In, Out
}

function outEdges<T>(edge: NodeEdge<T>) {
  return edge.type === EdgeType.Out;
}

function inEdges<T>(edge: NodeEdge<T>) {
  return edge.type === EdgeType.In;
}

export class Graph<T> {
  readonly bbox: AABB = new AABB();
  private nodeList: Node<T>[] = [];
  private nodeMap: NodeMap<T> = new Map();
  private edgeMap: Map<ID, NodeEdge<T>[]> = new Map();
  // private adjacencyMap: Map<ID, ID[]> = new Map();
  private selectedNodes: NodeSet<T> = new Set();
  private dragContext: DragContext<T>;

  addNode(node: Node<T>) {
    this.addNodeToBbox(node);
    this.nodeMap.set(node.id, node);
    this.nodeList.push(node);
  }

  addEdge(edge: Edge): boolean {
    if (!this.nodeMap.has(edge.from) ||
        !this.nodeMap.has(edge.to)) 
    {
      console.warn("Can't add edge", edge);
      return false;
    }
   
    const edges = this.edgeMap.get(edge.from) ?? [];
    edges.push({
      key: `${edge.from}-${edge.to}`,
      from: this.getNode(edge.from),
      to: this.getNode(edge.to),
      xoffset: edge.xoffset,
      yoffset: edge.yoffset,
      type: EdgeType.Out
    });
    this.edgeMap.set(edge.from, edges);

    // const to = this.adjacencyMap.get(edge.from) || [];
    // to.push(edge.to);
    // this.adjacencyMap.set(edge.from, to);
    return true;
  }

  removeNode(id: ID) {
    this.nodeMap.delete(id);
    this.nodeList = this.nodeList.filter(node => node.id === id);
    this.reCalcBbox();
  }
  
  removeNodes(nodes: NodeSet<T>) {
    console.log('delete', nodes);
    
    nodes.forEach(node => this.nodeMap.delete(node.id));
    this.nodeList = this.nodeList.filter(node => !nodes.has(node));
    // this.selectedNodes = this.selectedNodes.filter(node => ids.has(node));
    // this.adjacencyMap.delete
    // this.edgeMap.delete

    this.reCalcBbox();
  }

  get empty(): boolean {
    return this.nodeList.length === 0;
  }

  getNode(id: number) {
    return this.nodeMap.get(id);
  }

  get nodes(): Node<T>[] {
    return this.nodeList;
  }

  getNodes(filter: (node: Node<T>) => Boolean) {
    return this.nodeList.filter(filter)
  }

  getAdjacentNodes(id: ID): Node<T>[] {
    return this.edgeMap.get(id)?.filter(outEdges).map(edge => edge.to) ?? [];
    // const ids = this.adjacencyMap.get(id);
    // if (!ids) return [];
    // return ids.map(id => this.nodeMap.get(id));
  }

  getEdges(id: ID) {
    return this.edgeMap.get(id) ?? [];
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

  endDrag() {
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
