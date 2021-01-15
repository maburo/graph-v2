import React, { useContext, useEffect, useState } from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement } from '@infobip/moments-components';
import { Edge, EdgeId, Graph, Node, NodeEdge, NodeId } from './graph';
import { 
  AABB, 
  Vector2D, 
  Vector3D, 
  Matrix3D, 
  move, 
  screenToWorld,
  ZoomFunction,
  zoomToCenter,
} from '../math';
import { NodeFactory } from './node-factory';
import { 
  SelectLayer, 
  NodesLayer, 
  EdgesLayer, 
  DebugLayer,
  EdgeProperties,
} from './layers';
import { 
  KeyboardController, 
  KeyMappingSettings, 
  MouseController, 
  TouchController 
} from '../controllers';
import { GraphContext } from '../..';

export interface ZoomSettings {
  readonly min: number;
  readonly max: number;
  readonly sense: number;
}

interface GraphProps {
  readonly graph: Graph<FlowElement>;
  readonly nodeFactory: NodeFactory;
  readonly zoom: ZoomSettings;
  readonly zoomFunc: ZoomFunction;
  readonly debug?: boolean;
  readonly keymap: KeyMappingSettings[];
  readonly edgeRenderFunction: (props: EdgeProperties) => JSX.Element;
}

interface GraphState {
  readonly nodes: NodeId[];
  readonly edges: EdgeId[];
  readonly position: Vector3D;
  readonly mousePos: Vector2D;
  readonly width: number;
  readonly height: number;
  readonly vpCenter: Vector2D;
  readonly transformMtx: string;
  readonly intercationOrigin: Vector2D;
  readonly intercationEnd: Vector2D;
  readonly mode: Mode;
}

export enum Mode {
  Edit, StartSelection, Select, Move, Drag
}

let prevState = {};

export const NodeFactoryContext = React.createContext<NodeFactory>(null);

/**
 * Editor
 */
export class GraphEditor extends React.Component<GraphProps, GraphState> {
  readonly ref: React.RefObject<HTMLDivElement>;

  private onNodeStartDragFn: (node: React.MouseEvent) => void;
  private animationStepFn: () => void;

  private updateEdgeStateFn: (edges: EdgeId[]) => void;
  private updateNodeStateFn: (edges: NodeId[]) => void;

  private mouseController: MouseController;
  private touchController: TouchController;
  private keyboardController: KeyboardController;

  constructor(props:GraphProps) {
    super(props);

    this.ref = React.createRef();
    this.mouseController = new MouseController(this);
    this.touchController = new TouchController(this);
    this.keyboardController = new KeyboardController(this, this.props.keymap);

    this.onNodeStartDragFn = this.onNodeStartDrag.bind(this);
    this.animationStepFn = this.animationStep.bind(this);

    this.updateEdgeStateFn = this.updateEdgeState.bind(this);
    this.updateNodeStateFn = this.updateNodeState.bind(this);

    const position = move(new Vector3D(-457, -100, 1), new Vector2D(), props.graph.bbox);
  
    this.state = {
      position,
      mousePos: new Vector2D(),
      transformMtx: Matrix3D.cssMatrix(Matrix3D.identity()),
      width: 0,
      height: 0,
      vpCenter: new Vector2D(),
      intercationOrigin: new Vector2D(),
      intercationEnd: new Vector2D(),
      mode: Mode.Edit,
      nodes: props.graph.nodeIds,
      edges: props.graph.edgeIds,
    }

    props.graph.addEdgeStateListner(this.updateEdgeStateFn);
    props.graph.addNodesStateListner(this.updateNodeStateFn);
  }

  updateEdgeState(edges: EdgeId[]) {
    this.setState({edges});
  }

  updateNodeState(nodes: number[]) {
    this.setState({nodes});
  }

  componentDidMount() {
    this.ref.current.addEventListener('wheel', this.mouseController.onWheel, { passive: false });
    window.requestAnimationFrame(this.animationStepFn);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('wheel', this.mouseController.onWheel);

    this.props.graph.removeEdgeStateListner(this.updateEdgeStateFn);
    this.props.graph.removeNodesStateListner(this.updateNodeStateFn);
  }

  animationStep() {
    const div = this.ref.current;
    if (!div) return;

    const { clientHeight, clientWidth } = div;

    if (clientWidth != this.state.width || clientHeight != this.state.height) {
      const vpCenter = new Vector2D(clientWidth * .5, clientHeight * .5);

      this.setState(prev => ({
        transformMtx: Matrix3D.transformMatrix(prev.position, vpCenter),
        width: clientWidth, 
        height: clientHeight, 
        vpCenter,
      }));
    }

    window.requestAnimationFrame(this.animationStepFn);
  }

  shouldComponentUpdate(props: GraphProps, state: GraphState) {
    const propsKeys = [];
    for (const key in this.props) {
      if ((this.props as any)[key] !== (props as any)[key]) {
        propsKeys.push(key);
      }
    }

    const stateKeys = [];
    for (const key in this.state) {
      if (key === 'mousePos') continue;
      if ((this.state as any)[key] !== (state as any)[key]) {
        stateKeys.push(key);
      }
    }

    // if (propsKeys.length || stateKeys.length) console.log(propsKeys, stateKeys);
    
    return true;
  }

  render() {
    const { graph, nodeFactory } = this.props;
    const { 
      position, 
      mode, 
      width, 
      height, 
      mousePos,
      vpCenter,
      transformMtx,
      intercationOrigin,
      intercationEnd,
      nodes,
      edges,
    } = this.state;
    
    return (
      <NodeFactoryContext.Provider value={nodeFactory}>
        <div 
          // className="container omni-canvas-bg" 
          className="container" 
          style={{
            backgroundPositionX: -position.x * position.z,
            backgroundPositionY: -position.y * position.z,
            backgroundSize: `${16*position.z}px ${16*position.z}px`,
          }}
          ref={this.ref}
          tabIndex={0}
          onMouseMove={this.mouseController.onMouseMove}
          onMouseDown={this.mouseController.onMouseDown}
          onMouseUp={this.mouseController.onMouseUp}
          onTouchStart={this.touchController.onTouchStart}
          onTouchEnd={this.touchController.onTouchEnd}
          onTouchMove={this.touchController.onTouchMove}
          onKeyPress={this.keyboardController.onKeyPress}
          onKeyDown={this.keyboardController.onKeyDown}
          >
          {/* <GlLayer /> */}
       
          <EdgesLayer 
            renderFunction={this.props.edgeRenderFunction}
            graph={graph}
            width={width}
            height={height}
            transform={transformMtx}
            edges={edges} />

          <NodesLayer 
            onStartDrag={this.onNodeStartDragFn}
            graph={graph}
            width={width}
            height={height}
            transform={transformMtx}
            nodes={nodes} />
  
          {
            // TODO: change on zoom
            mode === Mode.Select &&
            <SelectLayer 
              graph={graph}
              width={width}
              height={height}
              region={AABB.from(intercationOrigin, intercationEnd)}
            />
          }

          {
            // create new element layer
          }

          {
            // <MiniMapLayer />
          }

          {
            this.props.debug &&
            <DebugLayer
              parentRef={this.ref}
              transform={transformMtx}
              position={position}
              mouseCoords={screenToWorld(mousePos, position, vpCenter)}
              graph={graph}
              mode={mode}
              width={width}
              height={height}
              nodes={nodes}
              />
          }
  
          <ContextMenu 
            parentRef={this.ref}
            items={[
              { id: 'add_node', text: "Add node", callback: () => {} },
              { id: 'select', text: "Select region", callback: () => {
                this.setState({mode: Mode.StartSelection});
              }}
            ]} />
        </div>
      </NodeFactoryContext.Provider>
    );
  }

  onNodeStartDrag(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const { graph } = this.props;
    const { position, vpCenter } = this.state;
    const mousePos = new Vector2D(e.clientX, e.clientY);
    
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const node = graph.getNode(id);
    const pos = screenToWorld(mousePos, position, vpCenter)

    if (e.shiftKey) {
      graph.addToSelection(node);
    } else {
      graph.setSelection(node);
    }
    graph.startDrag(pos);

    this.setState({
      mode: Mode.Drag,
      intercationOrigin: mousePos,
    });
  }

  onMove(clientX: number, clientY: number, shiftKey: boolean = false, altKey: boolean = false) {
    const update = new Date();
    const { graph } = this.props;
    const mousePos = new Vector2D(clientX, clientY);
    const projMousePos = screenToWorld(mousePos, this.state.position, this.state.vpCenter);
    const mode = this.state.mode;
    // const { 
    //   mode, 
    //   intercationOrigin, 
    //   position: prevPos, 
    //   mousePos: currMousePos, 
    //   vpCenter 
    // } = this.state; 
    
    switch (mode) {
      case Mode.Select:
        this.setState({intercationEnd: mousePos});
        break;

      case Mode.Move:
        this.setState(prev => {
          const shift = new Vector2D(
            (prev.mousePos.x - clientX) / prev.position.z, 
            (prev.mousePos.y - clientY) / prev.position.z);

          return {
            position: move(prev.position, shift, graph.bbox),
            mousePos,
            transformMtx: Matrix3D.transformMatrix(prev.position, prev.vpCenter),
          }
        });
        break;

      case Mode.Drag:
        graph.dragSelectedTo(projMousePos, shiftKey);
        // this.setState({update});
        break;

      case Mode.Edit:
        this.setState({mousePos});
        break;
    }
  }

  onStartInteraction(clientX: number, clientY: number) {
    this.ref.current?.focus();

    switch (this.state.mode) {
      case Mode.StartSelection:
        this.setState({
          intercationOrigin: new Vector2D(clientX, clientY),
          intercationEnd: new Vector2D(clientX, clientY),
          mode: Mode.Select,
        });
        break;
      case Mode.Edit:  
        this.setState({
          mode: Mode.Move,
          mousePos: new Vector2D(clientX, clientY),
        });
        break;
    }
  }
  
  onEndInteraction(clientX: number, clientY: number) {
    const {
      position,
      vpCenter,
      intercationOrigin,
      intercationEnd,
    } = this.state;

    switch (this.state.mode) {
      case Mode.Select:
        this.props.graph.select(
          AABB.from(
            screenToWorld(intercationOrigin, position, vpCenter), 
            screenToWorld(intercationEnd, position, vpCenter))
        );
        this.setState({mode: Mode.Edit});
        break;
      case Mode.Move:
        this.setState({mode: Mode.Edit});
        break;
      case Mode.Drag:
        this.props.graph.endDrag();
        this.setState({mode: Mode.Edit});
        break;
    }
  }

  //---------------------- Mouse
  onZoom(delta: number, ox: number, oy: number) {
    const { zoomFunc, zoom, graph } = this.props;
    this.setState(prev => 
      zoomFunc(
        -delta * zoom.sense * prev.position.z, 
        prev.position, 
        prev.vpCenter, 
        zoom, 
        new Vector2D(ox, oy), 
        graph.bbox)
    );
  }

  zoom(step: number) {
    const { zoom } = this.props;
    this.setState(prev => {
      const reminder = -(prev.position.z % step);
      const delta = (step > 0) ? (step + reminder) : (reminder || step);
       
      return zoomToCenter(
        delta,
        prev.position, 
        prev.vpCenter, 
        zoom);
    });
  }

  deleteSelectedNodes() {
    this.props.graph.removeNodes(this.props.graph.selected);
  }
}


export function useNodeState(nodeId: number): Node<any> {
  const ctx = useContext(GraphContext); // Interface
  const node = ctx.getNode(nodeId);

  const [state, setState] = useState(node);
  const setter = (node: Node<any>) => setState({...node});

  useEffect(() => () => ctx.removeListner(nodeId, setter));
  ctx.addListner(nodeId, setter);

  return state;
}

export function useEdgeState(id: string): NodeEdge<any> {
  const ctx = useContext(GraphContext);
  const edge = ctx.getEdge(id);
  
  const [state, setState] = useState(edge);
  const setter = (edge: NodeEdge<any>) => setState({...edge});

  useEffect(() => () => ctx.removeEdgeListner(id, setter));
  ctx.addEdgeListner(id, setter);

  return state;
}

