import React from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { Graph, Node } from './graph';
import { 
  AABB, 
  Vector2D, 
  Vector3D, 
  Matrix3D, 
  move, 
  screenToWorld,
  ZoomFunction,
} from '../math';
import { NodeFactory } from './node-factory';
import { 
  SelectLayer, 
  NodesLayer, 
  EdgesLayer, 
  DebugLayer,
  EdgeData
} from './layers';
import { 
  KeyboardController, 
  MouseController, 
  TouchController 
} from '../controllers';
import { calcEdgeConnectionCoord } from './layers/svg-layer';

export interface ZoomSettings {
  readonly min: number,
  readonly max: number,
  readonly sense: number,
}

interface GraphProps {
  readonly graph: Graph<FlowElement>
  readonly nodeFactory: NodeFactory,
  readonly zoom: ZoomSettings,
  readonly zoomFunc: ZoomFunction,
  readonly debug?: boolean,
}

interface GraphState {
  readonly update: Date,
  readonly position: Vector3D,
  readonly mousePos: Vector2D,
  readonly projMousePos: Vector2D,
  readonly width: number,
  readonly height: number,
  readonly vpCenter: Vector2D,
  readonly transformMtx: string,
  readonly intercationOrigin: Vector2D,
  readonly intercationEnd: Vector2D,
  readonly mode: Mode,
}

export enum Mode {
  Edit, StartSelection, Select, Move, Drag
}

export const NodeFactoryContext = React.createContext<NodeFactory>(null);

/**
 * Editor
 */
export class GraphEditor extends React.Component<GraphProps, GraphState> {
  readonly ref: React.RefObject<HTMLDivElement>;

  private onNodeStartDragFn: (node: React.MouseEvent) => void;
  private animationStepFn: () => void;

  private mouseController: MouseController;
  private touchController: TouchController;
  private keyboardController: KeyboardController;

  constructor(props:GraphProps) {
    super(props);

    this.ref = React.createRef();
    this.mouseController = new MouseController(this);
    this.touchController = new TouchController(this);
    this.keyboardController = new KeyboardController(this);

    this.onNodeStartDragFn = this.onNodeStartDrag.bind(this);
    this.animationStepFn = this.animationStep.bind(this);

    const position = move(new Vector3D(0, 0, 1), new Vector2D(), props.graph.bbox);
  
    this.state = {
      update: new Date(),
      position,
      mousePos: new Vector2D(),
      projMousePos: new Vector2D(),
      transformMtx: Matrix3D.cssMatrix(Matrix3D.identity()),
      width: 0,
      height: 0,
      vpCenter: new Vector2D(),
      intercationOrigin: new Vector2D(),
      intercationEnd: new Vector2D(),
      mode: Mode.Edit,
    }
  }

  componentDidMount() {
    this.ref.current.addEventListener('wheel', this.mouseController.onWheel, { passive: false });
    window.requestAnimationFrame(this.animationStepFn);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('wheel', this.mouseController.onWheel);
  }

  animationStep() {    
    const div = this.ref.current;
    if (!div) return;

    const { clientHeight, clientWidth } = div;

    if (clientWidth != this.state.width || clientHeight != this.state.height) {
      const vpCenter = new Vector2D(clientWidth / 2, clientHeight / 2)

      this.setState({
        transformMtx: Matrix3D.transformMatrix(this.state.position, vpCenter),
        width: clientWidth, 
        height: clientHeight, 
        vpCenter,
      });
    }

    window.requestAnimationFrame(this.animationStepFn);
  }

  render() {
    const { graph, nodeFactory } = this.props;
    const { 
      position, 
      mode, 
      width, 
      height, 
      projMousePos, 
      transformMtx,
      intercationOrigin,
      intercationEnd,
    } = this.state; 
    const nodes = graph.nodes;
    const edges: EdgeData[] = [];
    
    for (const node of nodes) {
      const adjacent = graph.getAdjacentNodes(node.id);
      if (adjacent.length === 0) continue;
  
      for (const edge of adjacent) {
        const conCoords = calcEdgeConnectionCoord(node, edge);

        edges.push({
          key: '' + node.id + edge.id,
          startX: conCoords.fromX,
          startY: conCoords.fromY,
          endX: conCoords.toX,
          endY: conCoords.toY,
        });
      }
    }
    
    return (
      <NodeFactoryContext.Provider value={nodeFactory}>
        <div 
          className="container omni-canvas-bg" 
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
            update={this.state.update}
            graph={graph}
            mode={mode}
            width={width}
            height={height}
            transform={transformMtx}
            edges={edges} />

          <NodesLayer 
            update={this.state.update}
            onStartDrag={this.onNodeStartDragFn}
            graph={graph}
            mode={mode}
            width={width}
            height={height}
            transform={transformMtx}
            nodes={nodes} />
  
          {
            // TODO: change on zoom
            mode === Mode.Select &&
            <SelectLayer 
              mode={mode}
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
              mouseCoords={projMousePos}
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
    
    const id = parseInt(e.currentTarget.getAttribute('data-id'));
    const node = this.props.graph.getNode(id);
    
    // CTRL +
    // ALT branch
    this.props.graph.setSelection(node);
    // this.props.graph.addToSelection(node);
    this.setState(prev => ({
      mode: Mode.Drag,
      intercationOrigin: prev.mousePos.copy(),
    }));
  }

  onMove(clientX: number, clientY: number, altKey: boolean = false) {
    const update = new Date();
    const { graph } = this.props;
    
    const projMousePos = screenToWorld(
      new Vector2D(clientX, clientY), 
      this.state.position, 
      this.state.vpCenter);

    const { 
      mode, 
      intercationOrigin, 
      position: prevPos, 
      mousePos: currMousePos, 
      vpCenter 
    } = this.state; 
    
    switch (mode) {
      case Mode.Select:
        this.setState({intercationEnd: new Vector2D(clientX, clientY)});
        break;

      case Mode.Move:
        const shift = new Vector2D(
          (currMousePos.x - clientX) / prevPos.z, 
          (currMousePos.y - clientY) / prevPos.z);
        this.setState({
          position: move(prevPos, shift, graph.bbox),
          mousePos: new Vector2D(clientX, clientY),
          projMousePos,
          transformMtx: Matrix3D.transformMatrix(prevPos, vpCenter),
        });
        break;

      case Mode.Drag:
        const projIntOrigin = screenToWorld(intercationOrigin, prevPos, vpCenter);
        graph.moveSelectedTo(projMousePos.copy().sub(projIntOrigin), altKey);
        this.setState({update});
        break;

      case Mode.Edit:
        this.setState({
          mousePos: new Vector2D(clientX, clientY),
          projMousePos,
        });
        break;
    }
  }

  onStartInteraction(clientX: number, clientY: number) {
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
        this.setState({mode: Mode.Edit});
        break;
    }
  }

  //---------------------- Mouse
  onZoom(delta: number, ox: number, oy: number) {
    const { zoomFunc, zoom, graph } = this.props;
    this.setState(prev => 
      zoomFunc(
        delta, 
        prev.position, 
        prev.vpCenter, 
        zoom, 
        new Vector2D(ox, oy), 
        graph.bbox)
    );
  }
}
