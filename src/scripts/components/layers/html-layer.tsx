import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { Graph, Node } from '../vgraph';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { ActionNode, ExitNode, PauseNode } from '../flow-nodes';
import { Mode } from '../graph';
import { LayerProperties } from './layer-props';

interface HtmlLayerProperties extends LayerProperties {
  onStartDrag: (node: Node<any>) => void,
  nodes: Node<FlowElement>[],
  transform: string,
}

export function HtmlLayer(props: HtmlLayerProperties) {
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

interface NodeProperties {
  mode: Mode,
  node: Node<FlowElement>,
  graph: Graph<any>,
  onStartDrag: ((node: Node<any>) => void),
}

class HtmlNode extends React.Component<NodeProperties> {

  constructor(props: NodeProperties) {
    super(props);
  }

  shouldComponentUpdate() {
    return this.props.mode === Mode.Edit;
  }

  render() {
    const node = this.props.node;
    const child = createChild(node);
    let className = "node" + (this.props.graph.isSelected(node) ? ' selected' : '');

    return (
      <div
        onMouseDown={e => {
          e.preventDefault();
          e.stopPropagation();
          console.log('node mouse down');
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
        { child}
      </div>
    )
  }
}

function createChild(node: Node<FlowElement>) {
  switch (node.payload.type) {
    case FlowElementType.EXIT:
      return (
        <ExitNode
          id={node.id}
          type={FlowElementType.EXIT}
        />
      )
    case FlowElementType.PAUSE:
      return (
        <PauseNode
          id={node.id}
          type={FlowElementType.PAUSE}
        />
      )
    case FlowElementType.SEND_ACTION:
      return (
        <ActionNode
          id={node.id}
          totalNumberOfElements={1}
          type={FlowElementType.SEND_ACTION}
        />
      )
    default:
      return (
        <span className="default">
          {`${node.id} ${node.payload?.action?.type}`}
        </span>)
  }
}