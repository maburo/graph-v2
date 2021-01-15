import React from 'react';

import { NodeFactoryContext, useNodeState } from '../graph-editor';
import { LayerProperties } from './layer-props';

export const NodesLayer = React.memo(nodesLayer);

interface HtmlLayerProperties extends LayerProperties {
  onStartDrag: (e: React.MouseEvent) => void;
  nodes: number[];
  transform: string;
}

function nodesLayer({ nodes, transform, onStartDrag }: HtmlLayerProperties) {
  // console.log('render node layer', [...nodes]);
  
  return (
    <div
      className="render layer"
      style={{ transform, transformOrigin: "0px 0px", width: 0, height: 0 }}
    >
      {
        nodes.map(id => (
          <HtmlNode
            key={id}
            id={id}
            onStartDrag={onStartDrag}
          />))
      }
    </div>
  );
}

interface NodeProperties {
  id: number;
  onStartDrag: (e: React.MouseEvent) => void;
}

const HtmlNode = React.memo(function(props: NodeProperties) {
  // let className = "node" + (this.props.graph.isSelected(node) ? ' selected' : '');
  
  const node = useNodeState(props.id);
  
  return (
    <NodeFactoryContext.Consumer>
      { factory => (
        <div
          data-id={node.id}
          onMouseDown={props.onStartDrag}
          style={{
            left: node.x + 'px',
            top: node.y + 'px'
          }}
          className="node"
        >
          {factory.renderNode(node)}
        </div>
      )}
    </NodeFactoryContext.Consumer>
  )
});
