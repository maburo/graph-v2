import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import { Vector2D } from '../../math';
import { Mode } from '../graph';
import { LayerProperties } from './layer-props';

interface SvgLayerProps extends LayerProperties {
  edges: EdgeData[],
  transform: string,
}

function svgLayer(props: SvgLayerProps) {
  const transform = props.transform;
  const edges = props.edges.map(edge => (
    <Edge 
      key={edge.key} 
      startX={edge.startX}
      startY={edge.startY}
      endX={edge.endX}
      endY={edge.endY}
      mode={props.mode} />
  ));
 
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

export const SvgLayer = React.memo(svgLayer);

export interface EdgeData {
  key: string,
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface EdgeProperties {
  key: string,
  mode: Mode,
  // pos: EdgeData,
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const COLOR_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', 
'8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'];

class Edge extends React.PureComponent<EdgeProperties> {

  // shouldComponentUpdate(nextProps: EdgeProperties) {
  //   const a = this.props as any;
  //   const b = nextProps as any;

  //   Object.keys(a).forEach(key => {
  //     if (a[key] !== b[key]) {
  //       console.log(key);
  //     }
  //   })
  //   // return this.props.mode === Mode.Edit || this.props.mode === Mode.Drag;
  //   return true;
  // }

  render() {
    const { startX, startY, endX, endY } = this.props;
    const x1 = startX + (endX - startX) / 2;
    const y1 = startY;
    const x2 = x1;
    const y2 = endY;

    // const color = "#000";
    const color = '#'
      + COLOR_VALUES[Math.floor(Math.random() * 16)] 
      + COLOR_VALUES[Math.floor(Math.random() * 16)] 
      + COLOR_VALUES[Math.floor(Math.random() * 16)];

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