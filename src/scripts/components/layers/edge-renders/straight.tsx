import React from 'react';
import { EdgeProperties } from '..';
import { useEdgeState } from '../../graph-editor';
import { RULES_NODE_PADDING, RULES_NODE_TOP } from '../../shared-components/diagram/utils/diagram-dimensions.utils';
import { calcInCoords, edgeOutOffset } from './util';


export const StraightEdgeRender = React.memo(straightEdgeRender);

function straightEdgeRender({id}: EdgeProperties) {
  const edge = useEdgeState(id);

  const end = calcInCoords(edge.to);
  const offset = edge.idx === 0 
    ? edgeOutOffset(edge.from.payload.type)
    : { x: 264, y: edge.from.size.y + RULES_NODE_TOP + RULES_NODE_PADDING * (edge.idx - 1) };


  const startX = edge.from.x + offset.x;
  const startY = edge.from.y + offset.y;
  const endX = end.toX;
  const endY = end.toY;
  const path = `M ${startX} ${startY} L${endX-10} ${endY}`;

  return (
    <g>
      
      <path 
        className="omni-flow-path-path-overlay"
        d={path} 
        stroke="#000" 
        fill="none"
        stroke-width="10px" 
        />

      <path 
        style={{
          pointerEvents: 'none'
        }}
        d={path} 
        stroke="#000" 
        fill="none"
        stroke-width="1px" 
        markerStart="url(#circle)"
        markerEnd="url(#arrow)"
        />
    </g>
  );
}