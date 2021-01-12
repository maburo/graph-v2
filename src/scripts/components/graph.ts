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

function outEdgesFilter<T>(edge: NodeEdge<T>) {
  return edge.type === EdgeType.Out;
}

function createEdge<T>(type: EdgeType, from: Node<T>, to: Node<T>, xoffset: number, yoffset: number) {
  return {
    key: `${EdgeType[type]}-${from.id}-${to.id}`,
    from,
    to,
    xoffset: xoffset,
    yoffset: yoffset,
    type,
  };
}

/**
 * MultiMap for edges
 */
class EdgeMap<T> {
  private map: Map<ID, NodeEdge<T>[]> = new Map();

  get: (nodeId: ID) => NodeEdge<T>[] = this.map.get.bind(this.map);

  add(nodeId: ID, value: NodeEdge<T>): this {
    const list = this.map.get(nodeId) ?? [];
    if (list.find(edge => edge.from === value.from && edge.to === value.to)) {
      return this;
    }

    list.push(value);
    this.map.set(nodeId, list);

    return this;
  }

  /**
   * Deletes all edges from all nodes related to the nodeId
   * @param nodeId 
   */
  delete(nodeId: ID): NodeEdge<T>[] {
    const edges = this.map.get(nodeId);
    if (!edges) return;

    const isEdgeNotLinkedToNode = (edge: NodeEdge<T>) => !(edge.to.id === nodeId || edge.from.id === nodeId);

    edges.forEach(edge => {
      const linkId = edge.to.id;
      const filtered = this.map.get(linkId).filter(isEdgeNotLinkedToNode);
      this.map.set(linkId, filtered);
    });

    this.map.delete(nodeId);
    return edges;
  }
}

interface Command {
  execute: () => void;
  undo: () => void;
}

export class StateHistory {
  readonly maxHistoryDepth: number;
  private history: Command[] = [];
  private idx: number = 0

  constructor(maxHistoryDepth: number = 10) {
    this.maxHistoryDepth = maxHistoryDepth;
  }

  undo() {
    if (this.idx === 0) return;

    this.idx -= 1;
    this.history[this.idx].undo();
  }

  redo() {
    this.history[this.idx].execute();
    this.idx += 1;
  }

  push(action: Command) {
    action.execute();
    const startIdx = Math.max(0, this.idx + 1 - this.maxHistoryDepth);
    this.history = this.history.slice(startIdx, this.idx).concat(action);
    this.idx = this.history.length;
  }
}

/**
 * Graph
 */
export class Graph<T> {
  readonly bbox: AABB = new AABB();
  private nodeList: Node<T>[] = [];
  private nodeMap: NodeMap<T> = new Map();
  private edgeMap: EdgeMap<T> = new EdgeMap();
  private selectedNodes: NodeSet<T> = new Set();
  private dragContext: DragContext<T>;
  private history: StateHistory = new StateHistory();

  private selectedNode: Node<T> = null;
  private setState: (state: any) => void;

  private subscribers: Map<ID, () => void[]> = new Map();

  // selctedNodeState(nodeId: ID, setState: (state: any) => void) {
  //   console.log('selctedNodeState');

  //   const node = this.getNode(nodeId);
    
  //   this.setState = setState;

  //   const subscribers = this.subscribers.get(nodeId) ?? [];
  //   subscribers.push(setState);
  //   this.subscribers.set(nodeId, subscribers);
    
  //   return (node: Node<T>) => {
  //     node.payload = payload;

  //     this.subscribers.get(nodeId).forEach(sub => sub(node));
  //   };
  // }

  addNode(node: Node<T>) {
    this.addNodeToBbox(node);
    this.nodeMap.set(node.id, node);
    this.nodeList.push(node);
  }

  addEdge(edge: Edge): boolean {
    const from = this.getNode(edge.from);
    const to = this.getNode(edge.to);

    if (!from || !to) {
      console.warn("Can't add edge", edge);
      return false;
    }

    this.edgeMap.add(edge.from, createEdge(EdgeType.Out, from, to, edge.xoffset, edge.yoffset));
    this.edgeMap.add(edge.to, createEdge(EdgeType.In, to, from, 0, 0));

    return true;
  }
  
  removeNodes(nodes: NodeSet<T>) {
    const edges = [...nodes].flatMap(node => {
      const nodeId = node.id;
      this.nodeMap.delete(nodeId);
      return this.edgeMap.delete(nodeId);
    });

    // onDelete set state

    this.nodeList = this.nodeList.filter(node => !nodes.has(node));
    this.reCalcBbox();
  }

  get isEmpty(): boolean {
    return this.nodeList.length === 0;
  }

  getNode(id: number) {
    return this.nodeMap.get(id);
  }

  get nodes(): Node<T>[] {
    return this.nodeList;
  }

  private getAdjacentNodes(id: ID): Node<T>[] {
    return this.getOutEdges(id).map(edge => edge.to);
  }

  getOutEdges(id: ID) {
    return this.edgeMap.get(id)?.filter(outEdgesFilter) ?? [];
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
    console.log('setSelection', this.setState);
    
    // this.setState({node});

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
