import React from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement } from '@infobip/moments-components';
import { Graph } from './vgraph';
import { AABB, Vector2D, clamp, Matrix3D, Vector3D } from '../math';
import { NodeFactory } from './node-factory';
import { 
  SelectLayer, 
  HtmlLayer, 
  SvgLayer, 
  DebugLayer,
  EdgeData
} from './layers';
import { MouseController, TouchController } from '../controllers';

interface ZoomSettings {
  readonly min: number,
  readonly max: number,
  readonly sense: number,
}

interface GraphProps {
  readonly graph: Graph<FlowElement>
  readonly zoom: ZoomSettings,
  readonly debug?: boolean,
  readonly nodeFactory: NodeFactory,
}

interface GraphState {
  readonly update: Date,
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
  readonly ref: React.RefObject<HTMLDivElement>;

  private onNodeStartDragFn: (node: React.MouseEvent) => void;
  private animationStepFn: () => void;

  private mouseController: MouseController;
  private touchController: TouchController;

  constructor(props:GraphProps) {
    super(props);

    this.ref = React.createRef();
    this.mouseController = new MouseController(this);
    this.touchController = new TouchController(this);

    this.onNodeStartDragFn = this.onNodeStartDrag.bind(this);
    this.animationStepFn = this.animationStep.bind(this);

    const position = move(new Vector3D(0, 0, 1), new Vector2D(), props.graph.bbox);
  
    this.state = {
      update: new Date(),
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
    this.ref.current.addEventListener('wheel', this.mouseController.onWheel, { passive: false });
    window.requestAnimationFrame(this.animationStepFn);
  }

  componentWillUnmount() {
    this.ref.current.removeEventListener('wheel', this.mouseController.onWheel);
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
          onMouseMove={this.mouseController.onMouseMove}
          onMouseDown={this.mouseController.onMouseDown}
          onMouseUp={this.mouseController.onMouseUp}
          onTouchStart={this.touchController.onTouchStart}
          onTouchEnd={this.touchController.onTouchEnd}
          onTouchMove={this.touchController.onTouchMove}
        >
          {/* <GlLayer /> */}
       
          <SvgLayer 
            update={this.state.update}
            graph={graph}
            mode={mode}
            width={width}
            height={height}
            transform={transform}
            edges={edges} />
  
          <HtmlLayer 
            update={this.state.update}
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

  onNodeStartDrag(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    
    const id = e.currentTarget.getAttribute('data-id');
    const node = this.props.graph.getNode(parseInt(id));
    
    // CTRL +
    // ALT branch
    this.props.graph.setSelection(node);
    // this.props.graph.addToSelection(node);
    this.setState({mode: Mode.Drag});
  }

  onMove(clientX: number, clientY: number) {
    const update = new Date();
    const { graph } = this.props;
    const projMousePos = new Vector2D(clientX, clientY).mulMtx3D(this.state.invTransformMtx);
    const { 
      mode, 
      selectOrigin, 
      position: prevPos, 
      mousePos: currMousePos, 
      vpCenter 
    } = this.state; 
    
    switch (mode) {
      case Mode.Select:
        const { x: ox, y: oy } = selectOrigin;
        const bbox = new AABB(ox, oy, ox, oy);
        bbox.addPoint(projMousePos.x, projMousePos.y);
        this.setState({selectRegion: bbox});
        break;
      case Mode.Move:
        const shift = new Vector2D(
          (currMousePos.x - clientX) / prevPos.z, 
          (currMousePos.y - clientY) / prevPos.z);
        this.setState({
          position: move(prevPos, shift, graph.bbox),
          mousePos: new Vector2D(clientX, clientY),
          projMousePos,
          ...calcTransformMtx(prevPos, vpCenter)
        });
        break;
      case Mode.Drag:
        graph.moveSelectedTo(projMousePos);
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
  
  onEndInteraction(clientX: number, clientY: number) {
    switch (this.state.mode) {
      case Mode.Select:
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
    const { position, vpCenter } = this.state;
    this.setState(zoomToCenter(delta, position, vpCenter, this.props.zoom ));
    // this.setState(zoomToCursor(
    //   delta, 
    //   new Vector2D(ox, oy), 
    //   position, 
    //   vpCenter, 
    //   this.props.zoom, 
    //   this.props.graph.bbox
    // ));
  }
}

function move(prevPos: Vector3D, shift: Vector2D, bbox: AABB) {
  return new Vector3D(
    clamp(prevPos.x + shift.x, bbox.minX, bbox.maxX),
    clamp(prevPos.y + shift.y, bbox.minY, bbox.maxY),
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

function zoomToCenter(
  delta: number,
  prevPosition: Vector3D, 
  vpCenter: Vector2D,
  zoom: ZoomSettings
) {
  const z = clamp(prevPosition.z - delta * zoom.sense * prevPosition.z, zoom.min, zoom.max);
  const position = new Vector3D(
    prevPosition.x,
    prevPosition.y,
    z
  );

  return {position, ...calcTransformMtx(position, vpCenter)};
}

function zoomToCursor(
  delta: number,
  mousePos: Vector2D,
  prevPosition: Vector3D, 
  vpCenter: Vector2D,
  zoom: ZoomSettings,
  bbox: AABB
) {
  const projMousePos = mousePos.mulMtx3D(this.state.invTransformMtx);
  
  const { x: px, y: py, z: pz } = prevPosition;

  const nz = clamp(pz - delta * zoom.sense * pz, zoom.min, zoom.max);
  const nx = clamp(px + (projMousePos.x - px) * (nz - pz), bbox.minX, bbox.maxX);
  const ny = clamp(py + (projMousePos.y - py) * (nz - pz), bbox.minY, bbox.maxY);

  const transformMtx = Matrix3D.translation(-nx + vpCenter.x, -ny + vpCenter.y);
  Matrix3D.mul(transformMtx, Matrix3D.translation(projMousePos.x, projMousePos.y));
  Matrix3D.mul(transformMtx, Matrix3D.scale(nz));
  Matrix3D.mul(transformMtx, Matrix3D.translation(-projMousePos.x, -projMousePos.y));

  const invTransformMtx = Matrix3D.copy(transformMtx);
  Matrix3D.invert(invTransformMtx);

  const newPos = new Vector3D(nx, ny, nz);

  return {position: newPos, transformMtx, invTransformMtx, projMousePos};
}