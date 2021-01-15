import React from 'react';
import { EdgeId } from '../graph';
import { LayerProperties } from './layer-props';

export const EdgesLayer = React.memo(edgesLayer);


export interface EdgeProperties {
  id: EdgeId;
}

interface Props extends LayerProperties {
  edges: EdgeId[];
  transform: string;
  renderFunction: (props: EdgeProperties) => JSX.Element;
}



function edgesLayer({transform, renderFunction: RenderFunction, edges}: Props) {
  const paths = edges.map(id => <RenderFunction id={id} key={id} />);
 
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
      { paths }
    </g>
  </svg>
  );
}


