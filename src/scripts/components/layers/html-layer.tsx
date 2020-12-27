import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { Graph, Node } from '../vgraph';
import { Mode, NodeFactoryContext } from '../graph';
import { LayerProperties } from './layer-props';

interface HtmlLayerProperties extends LayerProperties {
  onStartDrag: (node: Node<any>) => void,
  nodes: Node<any>[],
  transform: string,
}

function htmlLayer(props: HtmlLayerProperties) { // node-factory arg?
  const { nodes, transform, mode, graph, onStartDrag } = props;

  return (
    <div
      className="render layer"
      style={{ transform, transformOrigin: "0px 0px" }}
    >
      {
        nodes.map(node => (
          <HtmlNode
            onStartDrag={onStartDrag}
            graph={graph}
            mode={mode}
            node={node}
          />))
      }
    </div>
  );
}

export const HtmlLayer = React.memo(htmlLayer);

interface NodeProperties {
  mode: Mode,
  node: Node<any>,
  graph: Graph<any>,
  onStartDrag: ((node: Node<any>) => void),
}

class HtmlNode extends React.PureComponent<NodeProperties> {

  constructor(props: NodeProperties) {
    super(props);
  }

  // shouldComponentUpdate() {
  //   return this.props.mode === Mode.Edit || this.props.mode === Mode.Drag;
  // }

  render() {
    const node = this.props.node;
    let className = "node" + (this.props.graph.isSelected(node) ? ' selected' : '');

    return (
      <NodeFactoryContext.Consumer>
        { factory => (
          <div
            onMouseDown={e => {
              e.preventDefault();
              e.stopPropagation();
              this.props.onStartDrag(this.props.node);
            }}
            // onMouseUp={() => { }}
            // onTouchStart={() => { }}
            // onTouchEnd={() => { }}
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
  }
}