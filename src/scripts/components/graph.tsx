import React, { useState, useEffect, useRef, EventHandler, useContext, useLayoutEffect } from 'react';
import { ContextMenu } from './context-menu';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { Graph, Node } from './vgraph';
import AABB from '../math/aabb';
import { Vector2D } from '../math/vector';
import { 
  clamp, 
  makeTransformMatrix 
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
  debug: boolean,
}

interface GraphState {
  x: number,
  y: number,
  z: number,
  mx: number,
  my: number,
  width: number,
  height: number,
  selectRegion: AABB,
  selectOrigin: Vector2D,
  mode: Mode,
}

export enum Mode {
  Edit, StartSelection, Select, Move, Drag
}

export const GraphContext = React.createContext<Graph<FlowElement>>(null);
export const ModeContext = React.createContext<Mode>(Mode.Edit);

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
      selectRegion: new AABB(0, 0, 0, 0),
      selectOrigin: new Vector2D(0, 0),
      mode: Mode.Edit,
    }
  }

  componentDidMount() {
    window.requestAnimationFrame(this.step.bind(this));
  }

  step() {    
    const div = this.ref.current;
    if (div) {
      const width = div.clientHeight;
      const height = div.clientWidth;
      if (width != this.state.width || height != this.state.height) {
        this.setState({...this.state, width, height}, );
      }
    }

    window.requestAnimationFrame(this.step.bind(this));
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
        edges.push({
          startX: node.x,
          startY: node.y,
          endX: edge.x || 0,
          endY: edge.y || 0
        });
      }
    }
    
    // const transformMtx = makeTransformMatrix(x, y, z);

    
    const center = new Vector2D(width, height).div(2);
    const a = z;
    const d = a;
    const tx = -x;
    const ty = -y;
    // const transformMtx = `matrix(${a},0,0,${d},${tx},${ty})`;

    const cx = x + center.x;
    const cy = y + center.y;
    const mtx = Matrix3D.translation(-x, -y);
    
    Matrix3D.mul(mtx, Matrix3D.translation(cx, cy));
    Matrix3D.mul(mtx, Matrix3D.scale(z));
    Matrix3D.mul(mtx, Matrix3D.translation(-cx, -cy));
    const transformMtx = Matrix3D.cssMatrix(mtx);
  
    return (
      <GraphContext.Provider value={graph}>
      <ModeContext.Provider value={Mode.Edit}>
        <div 
          className="container" 
          ref={this.ref}
          onWheel={this.onMouseWheel.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
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
            graph={graph}
            mode={mode}
            width={width}
            height={height}
            transform={transformMtx}
            nodes={nodes} />
  
          {
            this.state.mode === Mode.Select &&
            <SelectLayer 
              mode={mode}
              graph={graph}
              width={width}
              height={height}
              region={this.state.selectRegion}
            />
          }

          {
            this.props.debug &&
            <DebugLayer
              parentRef={this.ref}
              transform={transformMtx}
              graph={graph}
              mode={mode}
              width={width}
              height={height}
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
      </ModeContext.Provider>
      </GraphContext.Provider>
    );
  }

  onMouseWheel(e: React.WheelEvent) {
    const v = clamp(
      this.state.z - e.deltaY * this.props.zoomSense * this.state.z, 
      this.props.minZoom, 
      this.props.maxZoom);

    this.setState({...this.state, z: v});
  }

  onMouseMove(e: React.MouseEvent<unknown>) {
    const { mode, selectOrigin, x, y, z, mx, my } = this.state; 

    if (mode === Mode.Select) {
      const aabb = new AABB(selectOrigin.x, selectOrigin.y, selectOrigin.x, selectOrigin.y);
      aabb.addPoint(e.clientX, e.clientY);
      this.setState({...this.state, selectRegion: aabb});
    }
    else if (mode === Mode.Move) {
      const aabb = this.props.graph.aabb;

      this.setState({
        ...this.state, 
        x: clamp((x - (e.clientX - mx) / z), aabb.minX, aabb.maxX), 
        y: clamp((y - (e.clientY - my) / z), aabb.minY, aabb.maxY),
        mx: e.clientX,
        my: e.clientY,
      });
    }
  }
  
  onMouseDown(e: React.MouseEvent<unknown>) {
    e.preventDefault();

    const { mode } = this.state;

    if (mode == Mode.StartSelection) {
      this.setState({...this.state, 
        selectRegion: new AABB(e.clientX, e.clientY, e.clientX, e.clientY),
        selectOrigin: new Vector2D(e.clientX, e.clientY),
        mode: Mode.Select,
      });
    }
    else if (mode === Mode.Edit) {
      this.setState({
        ...this.state, 
        mode: Mode.Move,
        mx: e.clientX,
        my: e.clientY,
      });
    }
  }
  
  onMouseUp(e: React.MouseEvent<unknown>) {
    e.preventDefault();
    
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
  }
}