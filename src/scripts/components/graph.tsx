import React, { useState, useEffect, useRef, EventHandler, useContext, useLayoutEffect } from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { Graph, Node } from './vgraph';
import { AABB, Vector2D, clamp, Matrix3D, Vector3D } from '../math';
import { NodeFactory } from './node-factory';
import { 
  SelectLayer, 
  HtmlLayer, 
  SvgLayer, 
  EdgePos, 
  DebugLayer
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

  constructor(props:GraphProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      position: new Vector3D(0, 0, 1),
      mousePos: new Vector2D(),
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
    window.requestAnimationFrame(this.animationStep.bind(this));
  }

  animationStep() {    
    const div = this.ref.current;
    
    if (div) {
      const height = div.clientHeight;
      const width = div.clientWidth;
      if (width != this.state.width || height != this.state.height) {
        this.setState({
          width, 
          height, 
          vpCenter: new Vector2D(width / 2, height / 2)
        });
      }
    }

    window.requestAnimationFrame(this.animationStep.bind(this));
  }

  render() {
    const { graph, nodeFactory } = this.props;
    const { position, mode, width, height, mousePos, transformMtx, invTransformMtx } = this.state; 
    const nodes = graph.nodes;
  
    const edges: EdgePos[] = [];
    for (const node of nodes) {
      const adjacent = graph.getAdjacentNodes(node.id);
      if (adjacent.length === 0) continue;
  
      for (const edge of adjacent) {
        const top = (edge.payload.type == FlowElementType.EXIT) ? 
          20 : 55;
        edges.push({
          startX: node.x,
          startY: node.y + 55,
          endX: edge.x - 20 || 0,
          endY: edge.y + top || 0
        });
      }
    }

    const transform = Matrix3D.cssMatrix(transformMtx);
    const projMouseCoords = mousePos.mulMtx3D(invTransformMtx);
  
    // TODO: lod, drag
    return (
      <NodeFactoryContext.Provider value={nodeFactory}>
        <div 
          className="container" 
          ref={this.ref}
          // onKeyDown=
          onWheel={this.onMouseWheel.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onTouchStart={this.onTouchStart.bind(this)}
          onTouchEnd={this.onTouchEnd.bind(this)}
          onTouchMove={this.onTouchMove.bind(this)}
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
            onStartDrag={this.onNodeStartDrag.bind(this)}
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
              mouseCoords={projMouseCoords}
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
    this.props.graph.addToSelection(node);
    this.setState({mode: Mode.Drag});
  }

  onMove(clientX: number, clientY: number) {
    const { mode, selectOrigin, position: prevPos, mousePos, vpCenter } = this.state; 

    if (mode === Mode.Select) {
      const { x: ox, y: oy } = selectOrigin;
      const bbox = new AABB(ox, oy, ox, oy);
      bbox.addPoint(clientX, clientY);
      this.setState({selectRegion: bbox});
    }
    else if (mode === Mode.Move) {
      const bbox = this.props.graph.bbox;

      const transformMtx = calcTransformMtx(prevPos, vpCenter);
      const invTransformMtx = Matrix3D.copy(transformMtx);
      Matrix3D.invert(invTransformMtx);

      const position = new Vector3D(
        clamp(prevPos.x - (clientX - mousePos.x) / prevPos.z, bbox.minX, bbox.maxX),
        clamp(prevPos.y - (clientY - mousePos.y) / prevPos.z, bbox.minY, bbox.maxY),
        prevPos.z
      );

      this.setState({
        position,
        mousePos: new Vector2D(clientX, clientY),
        transformMtx,
        invTransformMtx,
      });
    }
    else if (mode === Mode.Drag) {
      this.props.graph.selected.forEach(node => {
        node.x += clientX;
        node.y += clientY;
      });
      this.forceUpdate();
    }
    else if (mode === Mode.Edit) {
      this.setState({mousePos: new Vector2D(clientX, clientY)});
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

    // if (mode == Mode.StartSelection) {
    //   this.setState({ 
    //     selectRegion: new AABB(clientX, clientY, clientX, clientY),
    //     selectOrigin: new Vector2D(clientX, clientY),
    //     mode: Mode.Select,
    //   });
    // }
    // else if (mode === Mode.Edit) {
    //   this.setState({
    //     mode: Mode.Move,
    //     mousePos: new Vector2D(clientX, clientY),
    //   });
    // }
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
    // const { mode } = this.state;

    // if (mode === Mode.Select) {
    //   this.setState({mode: Mode.Edit});
    // }
    // else if (mode === Mode.Move) {
    //   this.setState({mode: Mode.Edit});
    // }
    // else if (mode === Mode.Drag) {
    //   this.setState({mode: Mode.Edit});
    //   // this.props.graph.bbox.addPoint(new pos)
    // }
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

    const transformMtx = calcTransformMtx(position, vpCenter);
    const invTransformMtx = Matrix3D.copy(transformMtx);
    Matrix3D.invert(invTransformMtx);
    
    this.setState({position, transformMtx, invTransformMtx});
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

function calcTransformMtx(pos: Vector3D, vpCenter: Vector2D) {
  const cx = pos.x;
  const cy = pos.y;

  const mtx = Matrix3D.translation(-pos.x + vpCenter.x, -pos.y + vpCenter.y);
  Matrix3D.mul(mtx, Matrix3D.translation(cx, cy));
  Matrix3D.mul(mtx, Matrix3D.scale(pos.z));
  Matrix3D.mul(mtx, Matrix3D.translation(-cx, -cy));

  return mtx;
}