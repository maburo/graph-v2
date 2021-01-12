import React from 'react';
import { Vector2D } from '../../math';

import { Graph, Node } from '../graph';
import { Mode, NodeFactoryContext } from '../graph-editor';
import { LayerProperties } from './layer-props';

interface HtmlLayerProperties extends LayerProperties {
  update: Date,
  onStartDrag: (e: React.MouseEvent) => void,
  nodes: Node<any>[],
  transform: string,
}

function nodesLayer({ nodes, transform, mode, graph, onStartDrag }: HtmlLayerProperties) {
  return (
    <div
      className="render layer"
      style={{ transform, transformOrigin: "0px 0px", width: 0, height: 0 }}
    >
      {
        nodes.map((node: Node<any>) => (
          <HtmlNode
            key={node.id}
            x={node.x}
            y={node.y}
            size={node.size}
            onStartDrag={onStartDrag}
            graph={graph}
            mode={mode}
            node={node}
          />))
      }
    </div>
  );
}

interface NodeProperties {
  x: number;
  y: number;
  size: Vector2D;
  mode: Mode;
  node: Node<any>;
  graph: Graph<any>;
  onStartDrag: (e: React.MouseEvent) => void;
}

const HtmlNode = React.memo(function({ x, y, node, onStartDrag, size }: NodeProperties) {
  // let className = "node" + (this.props.graph.isSelected(node) ? ' selected' : '');
  
  return (
    <NodeFactoryContext.Consumer>
      { factory => (
        <div
          data-id={node.id}
          onMouseDown={onStartDrag}
          style={{
            left: x + 'px',
            top: y + 'px'
          }}
          className="node"
        >
          {factory.renderNode(node)}
        </div>
      )}
    </NodeFactoryContext.Consumer>
  )
});

export const NodesLayer = React.memo(nodesLayer);
