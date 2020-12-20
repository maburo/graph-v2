import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import { Mode } from '../graph';
import { LayerProperties } from './layer-props';
import * as ReactDOM from 'react-dom';

interface DebugLayerProperties extends LayerProperties {
  transform: string,
  parentRef?: React.MutableRefObject<any>,
}

export function DebugLayer(props: DebugLayerProperties) {
  const { transform, graph, mode } = props;

  return (
    <div>
      <div
        style={{transform, transformOrigin: "0px 0px"}}
        className="render layer"
        >
        <svg id="debug-info" width="100%" height="100%">
          <g id="center">
            <line stroke="#F00" x1="0" y1="0" x2="100" y2="0" strokeWidth="4" />
            <line stroke="#F00" x1="100" y1="0" x2="85" y2="6" strokeWidth="1.5" />
            <line stroke="#00F" x1="0" y1="0" x2="0" y2="100" strokeWidth="4" />
            <line stroke="#00F" x1="0" y1="100" x2="6" y2="85" strokeWidth="1.5" />
            <rect fill="#000" x="0" y="0" width="15" height="15" />
          </g>
        </svg>
        <div 
          style={{
            position: "absolute",
            left: graph.aabb.minX,
            top: graph.aabb.minY,
            width: graph.aabb.maxX - graph.aabb.minX,
            height: graph.aabb.maxY - graph.aabb.minY,
            border: "#000 2px solid",
          }}
        />
      </div>
      
      <div className="debug-mode-preview">
        Mode: {Mode[mode]}
      </div>

      <div 
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            opacity: "0.5",
            pointerEvents: "none",
          }}
        >
          <svg style={{
            position: "absolute",
            left: "-15px",
            top: "-15px"
          }}>
            <g>
              <line stroke="#000" x1="0" x2="30" y1="15" y2="15" />
              <line stroke="#000" x1="15" x2="15" y1="30" y2="0" />
            </g>
          </svg>
        </div>
    </div>
  )
}