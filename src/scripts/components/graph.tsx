import React from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { Graph, Node } from './vgraph';
import { AABB, Vector2D, clamp, Matrix3D, Vector3D } from '../math';
import { NodeFactory } from './node-factory';
import { 
  SelectLayer, 
  HtmlLayer, 
  SvgLayer, 
  DebugLayer,
  EdgeData
} from './layers';

interface GraphProps {
  readonly graph: Graph<FlowElement>
  readonly minZoom: number,
  readonly maxZoom: number,
  readonly zoomSense: number,
  readonly debug?: boolean,
  readonly nodeFactory: NodeFactory,
}

interface GraphState {
  readonly position: Vector3D,
  readonly mousePos: Vector2D,
  readonly projMousePos: Vector2D,
  readonly width: number,
  readonly height: number,
  readonly vpCenter: Vector2D,
  readonly transformMtx: number[],
  readonly invTransformMtx: number[],
  readonly selectRegion: AABB,
  readonly selectOrigin: Vector2D,
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
  readonly ref: React.RefObject<HTMLDivElement>
  private onNodeStartDragFn: (node: Node<any>) => void;
  private animationStepFn: () => void;
  private onMouseMoveFn: (e: React.MouseEvent<unknown>) => void;
  private onMouseDownFn: (e: React.MouseEvent<unknown>) => void;
  private onMouseUpFn: (e: React.MouseEvent<unknown>) => void;
  private onMouseWheelFn: (e: React.WheelEvent) => void;
  private onTouchStartFn: (e: React.TouchEvent) => void;
  private onTouchEndFn: (e: React.TouchEvent)  => void;
  private onTouchMoveFn: (e: React.TouchEvent) => void;

  constructor(props:GraphProps) {
    super(props);

    this.onNodeStartDragFn = this.onNodeStartDrag.bind(this);
    this.animationStepFn = this.animationStep.bind(this);
    this.onMouseMoveFn = this.onMouseMove.bind(this);
    this.onMouseDownFn = this.onMouseDown.bind(this);
    this.onMouseUpFn = this.onMouseUp.bind(this);
    this.onMouseWheelFn = this.onMouseWheel.bind(this);
    this.onTouchStartFn = this.onTouchStart.bind(this);
    this.onTouchEndFn = this.onTouchEnd.bind(this);
    this.onTouchMoveFn = this.onTouchMove.bind(this);

    this.ref = React.createRef();

    const position = move(new Vector3D(0, 0, 1), new Vector2D(), props.graph.bbox);
  
    this.state = {
      position,
      mousePos: new Vector2D(),
      projMousePos: new Vector2D(),
      transformMtx: Matrix3D.identity(),
      invTransformMtx: Matrix3D.identity(),
      width: 0,
      height: 0,
      vpCenter: new Vector2D(),
      selectRegion: new AABB(0, 0, 0, 0), // TODO: min bbox size
      selectOrigin: new Vector2D(),
      mode: Mode.Edit,
    }
  }

  componentDidMount() {
    window.requestAnimationFrame(this.animationStepFn);
  }

  animationStep() {    
    const div = this.ref.current;
    
    if (div) {
      const height = div.clientHeight;
      const width = div.clientWidth;

      if (width != this.state.width || height != this.state.height) {
        const vpCenter = new Vector2D(width / 2, height / 2);
        
        this.setState({
          ...calcTransformMtx(this.state.position, vpCenter),
          width, 
          height, 
          vpCenter,
        });
      }
    }

    window.requestAnimationFrame(this.animationStepFn);
  }

  render() {
    const { graph, nodeFactory } = this.props;
    const { position, mode, width, height, projMousePos, transformMtx } = this.state; 
    const nodes = graph.nodes;
  
    const edges: EdgeData[] = [];
    for (const node of nodes) {
      const adjacent = graph.getAdjacentNodes(node.id);
      if (adjacent.length === 0) continue;
  
      for (const edge of adjacent) {
        edges.push({
          key: '' + node.id + edge.id,
          startX: node.x,
          startY: node.y,
          endX: edge.x,
          endY: edge.y,
        });
      }
    }

    const transform = Matrix3D.cssMatrix(transformMtx);
 
    // TODO: lod, drag
    return (
      <NodeFactoryContext.Provider value={nodeFactory}>
        <div 
          className="container" 
          ref={this.ref}
          // onKeyDown=
          onWheel={this.onMouseWheelFn}
          onMouseMove={this.onMouseMoveFn}
          onMouseDown={this.onMouseDownFn}
          onMouseUp={this.onMouseUpFn}
          onTouchStart={this.onTouchStartFn}
          onTouchEnd={this.onTouchEndFn}
          onTouchMove={this.onTouchMoveFn}
        >
          {/* <GlLayer /> */}
       
          <SvgLayer 
            graph={graph}
            mode={mode}
            width={width}
            height={height}
            transform={transform}
            edges={edges} />
  
          <HtmlLayer 
            onStartDrag={this.onNodeStartDragFn}
            graph={graph}
            mode={mode}
            width={width}
            height={height}
            transform={transform}
            nodes={nodes} />
  
          {
            // TODO: change on zoom
            mode === Mode.Select &&
            <SelectLayer 
              mode={mode}
              graph={graph}
              width={width}
              height={height}
              region={this.state.selectRegion}
            />
          }

          {
            // <MiniMapLayer />
          }

          {
            this.props.debug &&
            <DebugLayer
              parentRef={this.ref}
              transform={transform}
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
              } }
            ]} />
        </div>
      </NodeFactoryContext.Provider>
    );
  }

  onNodeStartDrag(node: Node<any>) {
    // CTRL
    this.props.graph.setSelection(node);
    // this.props.graph.addToSelection(node);
    this.setState({mode: Mode.Drag});
  }

  onMove(clientX: number, clientY: number) {
    const { graph } = this.props;
    const { mode, selectOrigin, position: prevPos, mousePos, vpCenter } = this.state; 
    const projMousePos = new Vector2D(clientX, clientY).mulMtx3D(this.state.invTransformMtx);

    if (mode === Mode.Select) {
      const { x: ox, y: oy } = selectOrigin;
      const bbox = new AABB(ox, oy, ox, oy);
      bbox.addPoint(projMousePos.x, projMousePos.y);
      this.setState({selectRegion: bbox});
    }
    else if (mode === Mode.Move) {
      const bbox = graph.bbox;
      const shift = new Vector2D(
        (clientX - mousePos.x) / prevPos.z, 
        (clientY - mousePos.y) / prevPos.z
      );

      this.setState({
        position: move(prevPos, shift, bbox),
        mousePos: new Vector2D(clientX, clientY),
        projMousePos,
        ...calcTransformMtx(prevPos, vpCenter),
      });
    }
    else if (mode === Mode.Drag) {
      // this.props.graph.selected.forEach(node => {
      //   node.x = projMousePos.x;
      //   node.y = projMousePos.y;
      // });

      graph.moveSelectedTo(projMousePos);

      // this.forceUpdate();
    }
    else if (mode === Mode.Edit) {
      this.setState({
        mousePos: new Vector2D(clientX, clientY),
        projMousePos,
      });
    }
  }

  onStartInteraction(clientX: number, clientY: number) {
    // const { mode } = this.state;

    switch (this.state.mode) {
      case Mode.StartSelection:
        this.setState({ 
          selectRegion: new AABB(clientX, clientY, clientX, clientY),
          selectOrigin: new Vector2D(clientX, clientY),
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
  
  onEndInteraction() {
    switch (this.state.mode) {
      case Mode.Select:
        this.setState({mode: Mode.Edit});
        break;
      case Mode.Move:
        this.setState({mode: Mode.Edit});
        break;
      case Mode.Drag:
        this.setState({mode: Mode.Edit});
        // this.props.graph.bbox.addPoint(new pos)
        break;
    }
  }

  //---------------------- Mouse
  onMouseWheel(e: React.WheelEvent) {
    const { position: prevPosition, vpCenter } = this.state;
    const { minZoom, maxZoom, zoomSense } = this.props;
    const z = clamp(prevPosition.z - e.deltaY * zoomSense * prevPosition.z, minZoom, maxZoom);

    const position = new Vector3D(
      prevPosition.x,
      prevPosition.y,
      z
    );

    this.setState({position, ...calcTransformMtx(position, vpCenter)});
  }

  onMouseMove(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    this.onMove(e.clientX, e.clientY);
  }

  onMouseDown(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    this.onStartInteraction(e.clientX, e.clientY);
  }
  
  onMouseUp(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    this.onEndInteraction();
  }

  //---------------------- Touch
  onTouchStart(e: React.TouchEvent) {
    e.preventDefault();
    const touches = e.changedTouches;
    
    for (let i = 0; e.touches.length; i++) {
      const touch = touches.item(i);
      this.onStartInteraction(touch.clientX, touch.clientY);
      this.onMove(touch.clientX, touch.clientY);
    }
  }

  onTouchEnd(e: React.TouchEvent) {
    e.preventDefault();
    this.onEndInteraction();
  }

  onTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    const touches = e.changedTouches;
    
    for (let i = 0; e.touches.length; i++) {
      const touch = touches.item(i);
      this.onMove(touch.clientX, touch.clientY);
    }
  }
}

function move(prevPos: Vector3D, shift: Vector2D, bbox: AABB) {
  return new Vector3D(
    clamp(prevPos.x - shift.x, bbox.minX, bbox.maxX),
    clamp(prevPos.y - shift.y, bbox.minY, bbox.maxY),
    prevPos.z
  );
}

function calcTransformMtx(pos: Vector3D, vpCenter: Vector2D) {
  const { x, y, z } = pos;

  const transformMtx = Matrix3D.translation(-x + vpCenter.x, -y + vpCenter.y);
  Matrix3D.mul(transformMtx, Matrix3D.translation(x, y));
  Matrix3D.mul(transformMtx, Matrix3D.scale(z));
  Matrix3D.mul(transformMtx, Matrix3D.translation(-x, -y));

  const invTransformMtx = Matrix3D.copy(transformMtx);
  Matrix3D.invert(invTransformMtx);

  return {
    transformMtx,
    invTransformMtx,
  };
}