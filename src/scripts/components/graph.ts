import { Vector2D } from '../math';
import AABB from '../math/aabb';

export type EdgeId = string;
export type NodeId = number;
export type StateSetter = (nodes: NodeId[], edges: EdgeId[]) => void;
type NodeMap<T> = Map<NodeId, Node<T>>;

interface DragContext<T> {
  origin: Vector2D;
  startPositions: Map<NodeId, Vector2D>;
  nodes: Node<T>[];
  hasChildren: boolean;
}

export interface Node<T> {
  id: NodeId;
  x: number;
  y: number;
  size: Vector2D;
  payload: T;
  selected: boolean;
}

export interface Edge {
  from: NodeId;
  to: NodeId;
  idx: number;
}

export interface NodeEdge<T> {
  id: string;
  idx: number;
  from: Node<T>;
  to: Node<T>;
}

function createEdge<T>(from: Node<T>, to: Node<T>, idx: number): NodeEdge<T> {
  return {
    id: `${from.id}-${to.id}`,
    idx,
    from,
    to,
  };
}

/**
 * MultiMap for edges
 */
class EdgeMap<T> {
  private byEdgeId: Map<EdgeId, NodeEdge<T>> = new Map();
  private adjacencyMap: Map<NodeId, NodeEdge<T>[]> = new Map();

  getByEdgeId: (edgeId: EdgeId) => NodeEdge<T> = this.byEdgeId.get.bind(this.byEdgeId);

  keys(): EdgeId[] {
    const result = [];
    for (const key of this.byEdgeId.keys()) result.push(key);
    return result;
  }

  add(edge: NodeEdge<T>): this {
    const fromId = edge.from.id;
    const toId = edge.to.id;

    if (this.adjacencyMap.has(fromId)) {
      this.adjacencyMap.get(fromId).push(edge);
    } else {
      this.adjacencyMap.set(fromId, [edge]);
    }

    if (this.adjacencyMap.has(toId)) {
      this.adjacencyMap.get(toId).push(edge);
    } else {
      this.adjacencyMap.set(toId, [edge]);
    }

    this.byEdgeId.set(edge.id, edge);

    return this;
  }

  getByNodeId(nodeId: NodeId): NodeEdge<T>[] {
    return this.adjacencyMap.get(nodeId);
  }

  /**
   * Deletes all edges from all nodes related to the nodeId
   * @param nodeId 
   */
  delete(nodeId: NodeId): NodeEdge<T>[] {
    const edges = this.adjacencyMap.get(nodeId);

    if (!edges) return [];
    
    edges.forEach(edge => {
      this.byEdgeId.delete(edge.id);

      if (edge.from.id === nodeId) {
        const children = this.adjacencyMap.get(edge.to.id);
        this.adjacencyMap.set(edge.to.id, children.filter(e => e.id !== edge.id));
      } else {
        const parent = this.adjacencyMap.get(edge.from.id);
        this.adjacencyMap.set(edge.from.id, parent.filter(e => e.id !== edge.id));
      }
    });

    this.adjacencyMap.delete(nodeId);

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
  private selectedNodes: Set<NodeId> = new Set();
  private dragContext: DragContext<T>;
  private history: StateHistory = new StateHistory();

  private nodeSubscribers: Map<NodeId, Set<(node: Node<T>) => void>> = new Map();
  private edgeSubscribers: Map<EdgeId, Set<(node: NodeEdge<T>) => void>> = new Map();
  private stateSubscribers: Set<(nodes: NodeId[], edges: EdgeId[]) => void> = new Set();

  private parser: (payload: T) => [Node<T>, Edge[]];

  constructor(parser: (payload: T) => [Node<T>, Edge[]]) {
    this.parser = parser;
  }

  add(payload: T) {
    const [node, edges] = this.parser(payload);
    this.addNode(node);
    edges.forEach(this.addEdge.bind(this));
  }

  addAll(payload: T[]) {
    let edgeList: Edge[] = [];

    payload.forEach(item => {
      const [node, edges] = this.parser(item);
      this.addNode(node);
      edgeList = edgeList.concat(edges);
    });

    edgeList.forEach(this.addEdge.bind(this));
  }

  /**
   * State
   */
  addStateListner(setter: StateSetter) {
    this.stateSubscribers.add(setter);
  }

  removeStateListner(setter: StateSetter) {
    this.stateSubscribers.delete(setter);
  }
  
  addListner(nodeId: NodeId, setter: (node: Node<any>) => void) {
    const listners = this.nodeSubscribers.get(nodeId) ?? new Set();
    listners.add(setter);
    this.nodeSubscribers.set(nodeId, listners);
  }

  removeListner(nodeId: NodeId, setter: (node: Node<any>) => void) {
    this.nodeSubscribers.get(nodeId)?.delete(setter);
  }

  addEdgeListner(edgeId: EdgeId, setter: (edge: NodeEdge<T>) => void) {
    const listners = this.edgeSubscribers.get(edgeId) ?? new Set();
    listners.add(setter);
    this.edgeSubscribers.set(edgeId, listners);
  }

  removeEdgeListner(edgeId: EdgeId, setter: (edge: NodeEdge<T>) => void) {
    this.edgeSubscribers.get(edgeId).delete(setter);
  }

  updateNode(payload: T) {
    // parse edges
    // update all
  }



  private addNode(node: Node<T>) {
    this.addNodeToBbox(node);
    this.nodeMap.set(node.id, node);
    this.nodeList.push(node);
  }

  private addEdge(edge: Edge): boolean {
    const from = this.getNode(edge.from);
    const to = this.getNode(edge.to);

    if (!from || !to) {
      console.warn("Can't add edge", edge);
      return false;
    }

    this.edgeMap.add(createEdge(from, to, edge.idx));

    return true;
  }
  
  removeNodes(ids: Set<NodeId>) {
    this.nodeList = this.nodeList.filter(n => !ids.has(n.id));
    
    [...ids].flatMap(id => {
      this.nodeSubscribers.delete(id);  
      this.nodeMap.delete(id);
      this.selectedNodes.delete(id);

      return this.edgeMap.delete(id)?.forEach(edge => this.edgeSubscribers.delete(edge.id));
    });

    this.reCalcBbox();
    
    this.stateSubscribers.forEach(sub => sub(this.nodeIds, this.edgeIds));
  }

  /**
   * Getters
   */
  getEdge(id: string): NodeEdge<T> {
    return this.edgeMap.getByEdgeId(id);
  }

  getNode(id: number): Node<T> {
    return this.nodeMap.get(id);
  }

  get nodeIds(): NodeId[] {
    return this.nodeList.map(node => node.id);
  }

  get edgeIds(): EdgeId[] {
    return this.edgeMap.keys();
  }

  private getAdjacentNodes(id: NodeId): Node<T>[] {
    return this.edgeMap.getByNodeId(id).filter(edge => edge.from.id === id).map(edge => edge.to);
  }

  /**
   * Selection
   */
  select(region: AABB): Set<NodeId> {
    const selected = this.nodeList
    .filter(node => region.containsNode(node))
    .map(node => node.id)

    return this.setSelection(selected);
  }

  addToSelection(nodeId: NodeId): Set<NodeId> {
    return this.setSelection([...this.selectedNodes, nodeId]);
  }

  setSelection(nodeIds: NodeId[]): Set<NodeId> {
    console.log('set selection', nodeIds);
    
    const selected = new Set(nodeIds);
    for (const id of new Set([...nodeIds, ...this.selectedNodes])) {
      const node = this.nodeMap.get(id);
      node.selected = selected.has(id);
      
      this.nodeSubscribers.get(id).forEach(sub => sub({...node}));
    }
    this.selectedNodes = new Set(nodeIds);
    return this.selectedNodes;
  }

  get selected(): Set<NodeId> {
    return new Set([...this.selectedNodes]);
  }

  undo() {
    console.log('undo');
    
    this.history.undo();
  }

  redo() {
    this.history.redo();
  }

  /**
   * Drag
   */
  startDrag(origin: Vector2D) {
    const nodes = [...this.selectedNodes].map(id => this.nodeMap.get(id));

    this.dragContext = {
      hasChildren: false,
      origin,
      nodes,
      startPositions: nodes.reduce((acc, node) => acc.set(node.id, new Vector2D(node.x, node.y)), new Map<NodeId, Vector2D>())
    };
  }

  dragSelectedTo(pos: Vector2D, moveChildren?: boolean) {
    const { origin, startPositions, nodes, hasChildren } = this.dragContext;
    const shift = pos.sub(origin);

    if (moveChildren && !hasChildren) {
      const selected = [...this.selectedNodes].map(id => this.nodeMap.get(id));
      this.findAllChildren(selected).forEach(node => {
        nodes.push(node);
        startPositions.set(node.id, new Vector2D(node.x, node.y));
      });
      this.dragContext.hasChildren = true;
    } else if (!moveChildren && hasChildren) {
      nodes.filter(el => !this.selectedNodes.has(el.id))
      .forEach(el => {
        const pos = startPositions.get(el.id);
        el.x = pos.x;
        el.y = pos.y;
      });

      this.dragContext.nodes = [...this.selectedNodes].map(id => this.nodeMap.get(id));
      this.dragContext.hasChildren = false;
    }

    this.move(nodes, startPositions, shift);
    this.reCalcBbox();
  }

  endDrag(pos: Vector2D) {
    const { startPositions, origin, nodes } = this.dragContext;
    this.history.push({
      execute: () => this.move(nodes, startPositions, pos.sub(origin)),
      undo: () => {
        console.log('undo move');
        
        this.move(nodes, startPositions, new Vector2D())
      },
    });

    this.reCalcBbox();
  }

  private move(nodes: Node<T>[], originalPos: Map<NodeId, Vector2D>, shift: Vector2D) {
    nodes.forEach(node => {
      const pos = originalPos.get(node.id).add(shift)
      node.x = pos.x;
      node.y = pos.y;
      
      this.nodeSubscribers.get(node.id).forEach(sub => sub(node));
      this.edgeMap.getByNodeId(node.id).forEach(edge => this.edgeSubscribers.get(edge.id).forEach(sub => sub({...edge})));
    });
  }

  /**
   * Clears bounding box and recalcs its size
   */
  private reCalcBbox() {
    this.bbox.reset();
    this.nodeList.forEach(this.addNodeToBbox.bind(this));
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
