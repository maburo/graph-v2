import React from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { Graph, Node } from './graph';
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
import { calcEdgeConnectionCoord } from './layers/svg-layer';

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
        ...calcTransformMtx(this.state.position, vpCenter),
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
    const transform = Matrix3D.cssMatrix(transformMtx);
    const nodes = graph.nodes;
  
    const edges: EdgeData[] = [];
    edges.length = 0;
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
 
    // TODO: lod
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
              region={AABB.from(this.state.intercationOrigin, this.state.intercationEnd)}
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

  onMove(clientX: number, clientY: number) {
    const update = new Date();
    const { graph } = this.props;
    // const projMousePos = new Vector2D(clientX, clientY).mulMtx3D(this.state.invTransformMtx);

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
          ...calcTransformMtx(prevPos, vpCenter)
        });
        break;

      case Mode.Drag:
        const projIntOrigin = intercationOrigin.mulMtx3D(this.state.invTransformMtx);     
        graph.moveSelectedTo(projMousePos.copy().sub(projIntOrigin));
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
    const { position, vpCenter } = this.state;
    // this.setState(zoomToCenter(delta, position, vpCenter, this.props.zoom));
    this.setState(prev => zoomToCursor(
      delta, 
      new Vector2D(ox, oy), 
      position, 
      vpCenter, 
      this.props.zoom, 
      this.props.graph.bbox
    ));
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

  // const transformMtx = Matrix3D.translation(-x + vpCenter.x, -y + vpCenter.y);
  // Matrix3D.mul(transformMtx, Matrix3D.translation(x, y));
  // Matrix3D.mul(transformMtx, Matrix3D.scale(z));
  // Matrix3D.mul(transformMtx, Matrix3D.translation(-x, -y));

  // const transformMtx = Matrix3D.translation(vpCenter.x, vpCenter.y);
  // Matrix3D.mul(transformMtx, Matrix3D.scale(z));
  // Matrix3D.mul(transformMtx, Matrix3D.translation(-x, -y));

  // const cx = -x + vpCenter.x;
  // const cy = -y + vpCenter.y;
  const transformMtx = [
    z, 0, (z * -x) + vpCenter.x,
    0, z, (z * -y) + vpCenter.y,
    0, 0, 1
  ]

  // const transformMtx = [
  //   z, 0, (z * -x) + cx + x,
  //   0, z, (z * -y) + cy + y,
  //   0, 0, 1
  // ]
  // const zz = 1 - z;
  // const transformMtx = [
  //   z, 0, x * zz + cx,
  //   0, z, y * zz + cy,
  //   0, 0, 1
  // ]
  // const cssmtx = `matrix(${z},0,0,${z},${(z * -x) + cx + x},${(z * -y) + cy + y})`
  
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

// https://stackoverflow.com/questions/21561724/opengl-google-maps-style-2d-camera-zoom-to-mouse-cursor
// https://godotengine.org/qa/25983/camera2d-zoom-position-towards-the-mouse
function zoomToCursor(
  delta: number,
  mousePos: Vector2D,
  position: Vector3D, 
  vpCenter: Vector2D,
  zoom: ZoomSettings,
  bbox: AABB
) {  
  const { x: px, y: py, z: pz } = position;

  const nz = clamp(pz - delta * zoom.sense * pz, zoom.min, zoom.max);
  // const nx = clamp(px + (projMousePos.x - px) * (nz - pz), bbox.minX, bbox.maxX);
  // const ny = clamp(py + (projMousePos.y - py) * (nz - pz), bbox.minY, bbox.maxY);

  const worldMouseCoords = screenToWorld(mousePos, position, vpCenter);
  // const worldMouseCoords = screenToWorld(
  //   vpCenter.copy().add(new Vector2D(100, 100)), 
  //   position, 
  //   vpCenter)
  const { x: ox, y: oy } = worldMouseCoords;

  const zoomDelta = nz - pz;
  const nx = px + (ox - px) * zoomDelta;
  const ny = py + (oy - py) * zoomDelta;

  // const nx = px;
  // const ny = py;

  // const nx = px + (ox - px) * -0.005;
  // const ny = py + (oy - py) * -0.005;

  // console.log(`zDelta ${zoomDelta.toFixed(2)}, diff ${ox - px}; ${(ox -px) * zoomDelta}`);

  // const transformMtx = Matrix3D.translation(-nx + vpCenter.x, -ny + vpCenter.y);
  // Matrix3D.mul(transformMtx, Matrix3D.translation(ox, oy));
  // Matrix3D.mul(transformMtx, Matrix3D.scale(nz));
  // Matrix3D.mul(transformMtx, Matrix3D.translation(-ox, -oy));

  // // const md = new Vector2D(mousePos.x - vpCenter.x, mousePos.y - vpCenter.y);
  // // worldMouseCoords.mulMtx3D(Matrix3D.invert(Matrix3D.copy(transformMtx)));

  // // const transformMtx = [
  // //   nz, 0, (nz * -px) + vpCenter.x,
  // //   0, nz, (nz * -py) + vpCenter.y,
  // //   0, 0, 1
  // // ]
  

  // // const zz = 1 - nz;
  // // const transformMtx = [
  // //   nz, 0, projMousePos.x * zz + nx,
  // //   0, nz, projMousePos.y * zz + ny,
  // //   0, 0, 1
  // // ]


  // // const ox = -px + vpCenter.x;
  // // const oy = -py + vpCenter.y;
  
  // // const transformMtx = [
  // //   nz, 0, (nz * -nx) + worldMouseCoords.x + nx,
  // //   0, nz, (nz * -ny) + worldMouseCoords.y + ny,
  // //   0, 0, 1
  // // ]

  const transformMtx = [
    nz, 0, (nz * -nx) + vpCenter.x,
    0, nz, (nz * -ny) + vpCenter.y,
    0, 0, 1
  ]

  const invTransformMtx = Matrix3D.copy(transformMtx);
  Matrix3D.invert(invTransformMtx);

  const newPos = new Vector3D(nx, ny, nz);

  return {
    position: newPos, 
    transformMtx, invTransformMtx,
    // mousePos: mousePos,
    // projMousePos: worldMouseCoords,
  };
}

function screenToWorld(screen: Vector2D, position: Vector3D, vpCenter: Vector2D): Vector2D {
  return new Vector2D(
    (screen.x - vpCenter.x) / position.z + position.x,
    (screen.y - vpCenter.y) / position.z + position.y
  );
}