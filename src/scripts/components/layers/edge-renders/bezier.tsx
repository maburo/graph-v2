import React from 'react';
import { EdgeProperties } from '..';
import { clamp } from '../../../math';
import { useEdgeState } from '../../graph-editor';
import { RULES_NODE_PADDING, RULES_NODE_TOP } from '../../shared-components/diagram/utils/diagram-dimensions.utils';
import { calcInCoords, edgeOutOffset } from './util';

const curve = 50;
const curveFactor = 2/curve;
const COLOR_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'];

export const BezierEdgeRender = React.memo(bezierEdgeRender);

function bezierEdgeRender({id}: EdgeProperties) {
  const edge = useEdgeState(id);

  const end = calcInCoords(edge.to);
  const offset = edge.idx === 0 
    ? edgeOutOffset(edge.from.payload.type)
    : { x: 264, y: edge.from.size.y + RULES_NODE_TOP + RULES_NODE_PADDING * (edge.idx - 1) };


  const startX = edge.from.x + offset.x;
  const startY = edge.from.y + offset.y;
  const endX = end.toX;
  const endY = end.toY;
  
  const halfLen = (endX - startX) * .5;
  const curveMag = -clamp((halfLen - curve) * curveFactor, Number.MIN_SAFE_INTEGER, 0);
  const factor = curve * curveMag;
  const centerX = startX + halfLen;
  const x1 = centerX + factor;
  const x2 = centerX - factor;
  const path = `M ${startX} ${startY} C${x1} ${startY}, ${x2} ${endY} ${endX-10} ${endY}`;

  const color = "#000";
  // const color = '#'
  //   + COLOR_VALUES[Math.floor(Math.random() * 16)] 
  //   + COLOR_VALUES[Math.floor(Math.random() * 16)] 
  //   + COLOR_VALUES[Math.floor(Math.random() * 16)];
  
  return (
    <g>
      <path 
        className="omni-flow-path-path-overlay"
        d={path} 
        stroke={color} 
        fill="none"
        stroke-width="10px" 
        />

      <path 
        style={{
          pointerEvents: 'none'
        }}
        d={path} 
        stroke={color} 
        fill="none"
        stroke-width="1px" 
        markerStart="url(#circle)"
        markerEnd="url(#arrow)"
        />
    </g>
  );
}