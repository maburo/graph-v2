import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import { Vector2D } from '../../math';
import { Mode } from '../graph';
import { LayerProperties } from './layer-props';

interface SvgLayerProps extends LayerProperties {
  edges: EdgePos[],
  transform: string,
}

export function SvgLayer(props: SvgLayerProps) {
  const edges = props.edges.map(edge => (<Edge pos={edge} mode={props.mode} />));
  const transform = props.transform;
 
  return (
    <svg className="render layer">
    <defs>
      <marker id="circle" markerWidth="4" markerHeight="4" refX="2" refY="2">
        <circle cx="2" cy="2" r="2" stroke="none" fill="#000" />
      </marker>
      <marker id="arrow" markerWidth="10" markerHeight="4" refX="0" refY="2">
        <path d="M0,0 L10,2 L0,4" fill="#000" />
      </marker>
    </defs>

    <g style={{transform}}>
      { edges }
    </g>
  </svg>
  );
}

export interface EdgePos {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface EdgeProperties {
  mode: Mode,
  pos: EdgePos,
}

const COLOR_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', 
'8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'];

class Edge extends React.Component<EdgeProperties> {

  shouldComponentUpdate() {
    return this.props.mode === Mode.Edit;
  }

  render() {
    const pos = this.props.pos;
    const startX = pos.startX;
    const startY = pos.startY;
    const x1 = pos.startX + (pos.endX - pos.startX) / 2;
    const y1 = pos.startY;
    const x2 = x1;
    const y2 = pos.endY;
    const endX = pos.endX;
    const endY = pos.endY;

    const color = "#000";
    // const color = '#'
    //   + COLOR_VALUES[Math.floor(Math.random() * 16)] 
    //   + COLOR_VALUES[Math.floor(Math.random() * 16)] 
    //   + COLOR_VALUES[Math.floor(Math.random() * 16)];

    return (
      <path 
        d={`M${startX},${startY} C${x1},${y1} ${x2},${y2} ${endX},${endY}`} 
        stroke={color} 
        fill="none"
        stroke-width="2px" 
        markerStart="url(#circle)"
        markerEnd="url(#arrow)"
      />
    );
  }
}