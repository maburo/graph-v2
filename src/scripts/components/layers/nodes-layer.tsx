import React, { useContext } from 'react';
import { GraphContext } from '../../..';
import { NodeId } from '../graph';

import { NodeFactoryContext, useNodeState } from '../graph-editor';
import { LayerProperties } from './layer-props';

export const NodesLayer = React.memo(nodesLayer);

interface HtmlLayerProperties extends LayerProperties {
  onStartDrag: (e: React.MouseEvent) => void;
  nodes: NodeId[];
  transform: string;
}

function nodesLayer({ nodes, transform, onStartDrag }: HtmlLayerProperties) {
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
  id: NodeId;
  onStartDrag: (e: React.MouseEvent) => void;
}

const HtmlNode = React.memo(function(props: NodeProperties) {
  const node = useNodeState(props.id);
  let className = "node" + (node.selected ? ' selected' : '');
  
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
          className={className}
        >
          {factory.renderNode(node)}
        </div>
      )}
    </NodeFactoryContext.Consumer>
  )
});
