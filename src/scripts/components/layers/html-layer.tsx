import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { Node } from '../vgraph';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { ActionNode, ExitNode, PauseNode } from '../flow-nodes';
import { Mode } from '../graph';
import { LayerProperties } from './layer-props';
import { Vector2D } from '../../math';

interface HtmlLayerProperties extends LayerProperties {
  nodes: Node<FlowElement>[],
  transform: string,
}

export function HtmlLayer(props: HtmlLayerProperties) {
  const { nodes, transform, mode } = props;
  
  return (
    <div 
      className="render layer"
      style={{transform, transformOrigin: "0px 0px"}}
    >
      { 
        nodes.map(node => (<HtmlNode mode={mode} node={node} />)) 
      }
    </div>
  );
}

interface NodeProperties {
  mode: Mode,
  node: Node<FlowElement>
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

    return (
      <div
          style={{
            left: node.x + 'px', 
            top: node.y + 'px'
          }} 
          className="node">
        { child }
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