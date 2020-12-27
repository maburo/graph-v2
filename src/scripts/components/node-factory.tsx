import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { FlowElement, FlowElementType } from "@infobip/moments-components"
import { ActionNode, ExitNode, PauseNode } from "./flow-nodes"
import { Node } from "./vgraph"

export class NodeFactory {

  renderNode(node: Node<FlowElement>) {
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
}