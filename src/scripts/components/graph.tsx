import React, { useState, useEffect, useRef, EventHandler, useContext, useLayoutEffect } from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { Graph, Node } from './vgraph';
import AABB from '../math/aabb';
import { Vector2D } from '../math/vector';
import { 
  clamp, 
} from '../math/util';
import { 
  SelectLayer, 
  HtmlLayer, 
  SvgLayer, 
  EdgePos, 
  DebugLayer
} from './layers';
import { Matrix3D } from '../math';

interface GraphProps {
  graph: Graph<FlowElement>
  minZoom: number,
  maxZoom: number,
  zoomSense: number,
  debug?: boolean,
}

interface GraphState {
  readonly x: number,
  readonly y: number,
  readonly z: number,
  readonly mx: number,
  readonly my: number,
  readonly width: number,
  readonly height: number,
  readonly selectRegion: AABB,
  readonly selectOrigin: Vector2D,
  readonly mode: Mode,
}

export enum Mode {
  Edit, StartSelection, Select, Move, Drag
}


/**
 * Editor
 */
export class GraphEditor extends React.Component<GraphProps, GraphState> {
  readonly ref: React.RefObject<HTMLDivElement>

  constructor(props:GraphProps) {
    super(props);
    this.ref = React.createRef();
    this.state = {
      x: 0,
      y: 0,
      z: 1,
      mx: 0,
      my: 0,
      width: 0,
      height: 0,
      selectRegion: new AABB(0, 0, 0, 0), // TODO: min aabb size
      selectOrigin: new Vector2D(0, 0),
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
        this.setState({...this.state, width, height}, );
      }
    }

    window.requestAnimationFrame(this.animationStep.bind(this));
  }

  render() {
    const { graph } = this.props;
    const { x, y, z, mode, width, height } = this.state; 
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
    
    const center = new Vector2D(width, height).div(2).add2d(x, y);

    const mtx = Matrix3D.translation(-x, -y);
    
    Matrix3D.mul(mtx, Matrix3D.translation(center.x, center.y));
    Matrix3D.mul(mtx, Matrix3D.scale(z));
    Matrix3D.mul(mtx, Matrix3D.translation(-center.x, -center.y));
    const transformMtx = Matrix3D.cssMatrix(mtx);
  
    // TODO: lod, drag
    return (
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
            transform={transformMtx}
            edges={edges} />
  
          <HtmlLayer 
            onStartDrag={this.onNodeStartDrag.bind(this)}
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
              transform={transformMtx}
              position={{x, y, z}}
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
                this.setState({...this.state, mode: Mode.StartSelection})
              } }
            ]} />
        </div>
    );
  }

  onNodeStartDrag(node: Node<any>) {
    this.setState({...this.state, mode: Mode.Drag});
  }

  onMove(clientX: number, clientY: number) {
    const { mode, selectOrigin, x, y, z, mx, my } = this.state; 

    if (mode === Mode.Select) {
      const aabb = new AABB(selectOrigin.x, selectOrigin.y, selectOrigin.x, selectOrigin.y);
      aabb.addPoint(clientX, clientY);
      this.setState({...this.state, selectRegion: aabb});
    }
    else if (mode === Mode.Move) {
      const aabb = this.props.graph.aabb;

      const hw = this.state.width / 2;
      const hh = this.state.height / 2;

      this.setState({
        ...this.state, 
        x: clamp((x - (clientX - mx) / z), aabb.minX - hw, aabb.maxX - hw), 
        y: clamp((y - (clientY - my) / z), aabb.minY - hh, aabb.maxY - hh),
        mx: clientX,
        my: clientY,
      });
    }
    else if (mode === Mode.Drag) {

    }
  }

  onStartInteraction(clientX: number, clientY: number) {
    const { mode } = this.state;

    if (mode == Mode.StartSelection) {
      this.setState({...this.state, 
        selectRegion: new AABB(clientX, clientY, clientX, clientY),
        selectOrigin: new Vector2D(clientX, clientY),
        mode: Mode.Select,
      });
    }
    else if (mode === Mode.Edit) {
      this.setState({
        ...this.state, 
        mode: Mode.Move,
        mx: clientX,
        my: clientY,
      });
    }
  }
  
  onEndInteraction() {
    const { mode } = this.state;

    if (mode === Mode.Select) {
      this.setState({...this.state, mode: Mode.Edit});
    }
    else if (mode === Mode.Move) {
      this.setState({
        ...this.state, 
        mode: Mode.Edit,
      });
    }
    else if (mode === Mode.Drag) {
      this.setState({
        ...this.state,
        mode: Mode.Edit,
      })
    }
  }

  //---------------------- Mouse
  onMouseWheel(e: React.WheelEvent) {
    const v = clamp(
      this.state.z - e.deltaY * this.props.zoomSense * this.state.z, 
      this.props.minZoom, 
      this.props.maxZoom);

    this.setState({...this.state, z: v});
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