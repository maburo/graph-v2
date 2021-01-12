import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { FlowElement, FlowElementType } from "@infobip/moments-components"
import {
  ActionNode,
  ExitNode,
  PauseNode,
  RulesNode,
  StartInboundNode,
  StartNode,
} from './shared-components/diagram/nodes'
import { Node } from "./graph"

export class NodeFactory {

  renderNode(node: Node<FlowElement>) {
    switch (node.payload.type) {
      case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
      case FlowElementType.START_FLOW_WEBHOOK:
      case FlowElementType.START_IVR_INBOUND:
        return (
          <StartNode
            type={node.payload.type}
            rules={node.payload.rules}
            id={node.id}
            loadingStatistics={false}
            onAddRule={() => {}}
            onRemoveRule={() => {}}
            onDelete={() => {}}
            readonly={false}
            // validationResult={this.getValidationResult(element)}
          />
        );
      case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
      case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
      case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
      case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE:
        return (
          <StartInboundNode
            key={node.id}
            rules={node.payload.rules}
            loadingStatistics={false}
            onAddRule={() => {}}
            onRemoveRule={() => {}}
            onDelete={() => {}}
            onDuplicate={() => {}}
            canAddRule={true}
            readonly={false}
            // validationResult={this.getValidationResult(element)}
          />
        );
      case FlowElementType.SEND_ACTION:
      case FlowElementType.ADD_TAG:
      case FlowElementType.START_CONVERSATION:
      case FlowElementType.REMOVE_TAG:
      case FlowElementType.ADD_TO_BLACKLIST:
      case FlowElementType.REMOVE_FROM_BLACKLIST:
      case FlowElementType.FAILOVER_ACTION:
      case FlowElementType.IVR_HANG_UP:
      case FlowElementType.UPDATE_PERSON_ACTION:
        return (
          <ActionNode
            id={node.id}
            type={node.payload.type}
            loadingStatistics={false}
            failover={node.payload.type === FlowElementType.FAILOVER_ACTION}
            onDelete={() => {}}
            onDuplicate={() => {}}
            renderContent={() => null}
            // zoomLevel={this.props.store.diagramDimensions.zoomLevel}
            totalNumberOfElements={10}
            // validationResult={this.getValidationResult(element)}
          />
        );
      case FlowElementType.EVALUATE_PARTICIPANT_DATA:
      case FlowElementType.EVALUATE_VALUE:
      case FlowElementType.EVALUATE_BEHAVIOUR_EVENT:
      case FlowElementType.EVALUATE_ATTRIBUTE_EVENT:
      case FlowElementType.EVALUATE_EVENT:
      case FlowElementType.EVALUATE_INBOUND_MESSAGE:
      case FlowElementType.DIAL_IVR_ACTION:
      case FlowElementType.RECORD_IVR_ACTION:
      case FlowElementType.PLAY_IVR_ACTION:
      case FlowElementType.CALL_URL:
      case FlowElementType.COLLECT_IVR_ACTION:
      case FlowElementType.START_CALL_IVR_ACTION:
      case FlowElementType.PERFORM_EXPERIMENT_ACTION:
      case FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE:
        return (
          <RulesNode
            key={node.id}
            loadingStatistics={false}
            addingRuleDisabled={false}
            rules={node.payload.rules}
            onAddRule={() => {}}
            onRemoveRule={() => {}}
            onDelete={() => {}}
            onDuplicate={() => {}}
            // zoomLevel={this.props.store.diagramDimensions.zoomLevel}
            canAddRule={true}
            // validationResult={this.getValidationResult(element)}
          />
        );
      case FlowElementType.PAUSE:
        return (
          <PauseNode
            id={node.id}
            type={node.payload.type}
            onDelete={() => {}}
            onDuplicate={() => {}}
            // validationResult={this.getValidationResult(element)}
          />
        );
      case FlowElementType.EXIT:
        return (
          <ExitNode
            id={node.id}
            type={node.payload.type}
            onDelete={() => {}}
            // validationResult={this.getValidationResult(element)}
          />
        );
      default:
        return (
          <span className="default">
            {`${node.id} ${node.payload?.action?.type}`}
          </span>)
    }
  }
}

import schnippleIcon from '../../../assets/img/canvas/elements/connect-schnipple.svg';

interface ConnectorProps {
  x: number;
  y: number;
}

function Connector(props: ConnectorProps) {
  const style: Record<string, unknown> = {
    position: 'absolute',
    left: props.x,
    top: props.y * .5,
    // width: SCHNIPPLE_SIZE,
    // height: SCHNIPPLE_SIZE,
  };

  return (
    <div
      data-tip=""
      // data-for={`connector-tooltip-${this.props.order}`}
      className="ib-flow-shnipple-wrapper"
      style={style}
      // onMouseDown={this.onMouseDown}
      // onDragStart={this.onDragStart}
    >
      <div className="connecting-line" />
      <button className="ib-flow-shnipple">
          <img src={schnippleIcon} />
      </button>

      {/* <DiagramReactTooltip
          id={`connector-tooltip-${this.props.order}`}
          place="right"
          zoomLevel={this.props.zoomLevel}
          className="ib-flow-tooltip flow-schnipple-tooltip"
      >
          {__('Click to add an element or drag to connect to an existing element')}
      </DiagramReactTooltip> */}
  </div>
  )
}

function renderNewConnection(path?: string, end?: { x: number; y: number }) {
  const { left, top, zoomLevel } = this.props;

  if (!path || !end) {
      return null;
  }

  return (
      <g className="omni-flow-path" transform={`translate(${left},${top}) scale(${zoomLevel} ${zoomLevel})`}>
          <path strokeDasharray="5" className="omni-flow-path-path" d={path} />
          <path className="omni-flow-new-path-overlay" d={path} />
          <circle cx={end.x} cy={end.y} r="15" fill="rgba(41, 184, 153, 0.1)" />
          <circle cx={end.x} cy={end.y} r="10" fill="rgba(41, 184, 153, 0.1)" />
          <circle cx={end.x} cy={end.y} r="5" fill="black" />
      </g>
  );
};