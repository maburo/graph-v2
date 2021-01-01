import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { Graph, Node } from '../graph';
import { Mode, NodeFactoryContext } from '../graph-editor';
import { LayerProperties } from './layer-props';

interface HtmlLayerProperties extends LayerProperties {
  update: Date,
  onStartDrag: (e: React.MouseEvent) => void,
  nodes: Node<any>[],
  transform: string,
}

export class HtmlLayer extends React.PureComponent<HtmlLayerProperties> {
// function htmlLayer(props: HtmlLayerProperties) { // node-factory arg?

  // shouldComponentUpdate(next: HtmlLayerProperties) {
  //   const a = this.props as any;
  //   const b = next as any;

  //   Object.keys(a).forEach(key => {
  //     if (a[key] !== b[key]) console.log('>> html layer', key);
  //   })
  //   return true;
  // }

  render() {
  const { nodes, transform, mode, graph, onStartDrag } = this.props;

  return (
    <div
      className="render layer"
      style={{ transform, transformOrigin: "0px 0px", width: 0, height: 0 }}
    >
      {
        nodes.map(node => (
          <HtmlNode
            key={node.id}
            x={node.x}
            y={node.y}
            onStartDrag={onStartDrag}
            graph={graph}
            mode={mode}
            node={node}
          />))
      }
    </div>
  );
}
}

// export const HtmlLayer = React.memo(htmlLayer);

interface NodeProperties {
  x: number,
  y: number,
  mode: Mode,
  node: Node<any>,
  graph: Graph<any>,
  onStartDrag: (e: React.MouseEvent) => void,
}

class HtmlNode extends React.PureComponent<NodeProperties> {

  // constructor(props: NodeProperties) {
  //   super(props);
  // }

  // shouldComponentUpdate(next: NodeProperties) {
  //   const a = this.props as any;
  //   const b = next as any;

  //   Object.keys(a).forEach(key => {
  //     if (a[key] !== b[key]) console.log('>> node', key);
  //   })
  //   return false;
  // }

  render() {
    const { x, y, node, onStartDrag } = this.props;
    let className = "node" + (this.props.graph.isSelected(node) ? ' selected' : '');
    
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
            className={className}
          >
            {factory.renderNode(node)}
          </div>
        )}
      </NodeFactoryContext.Consumer>
    )
  }
}