import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';

import { FlowElement, FlowElementType } from "@infobip/moments-components"
// import { ActionNode, ExitNode, PauseNode } from "./flow-nodes"
import {
  ActionNode,
  ExitNode,
  PauseNode,
  RulesNode,
  StartInboundNode,
  StartNode,
} from './shared-components/diagram/nodes'
import { Node } from "./vgraph"

export class NodeFactory {

  renderNode(node: Node<FlowElement>) {
    switch (node.payload.type) {
      case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
      case FlowElementType.START_FLOW_WEBHOOK:
      case FlowElementType.START_IVR_INBOUND:
        return (
          <StartNode
            type={node.payload.type}
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
            // zoomLevel={this.props.store.diagramDimensions.zoomLevel}
            totalNumberOfElements={10}
            // validationResult={this.getValidationResult(element)}
          />
        );
      // case FlowElementType.NEW_ELEMENT:
      //   return (
      //     <CreateElementMenu
      //       id={node.id}
      //       deleteElement={() => {}}
      //       // accountRoutesPresent={accountRoutesPresent(this.props.config)}
      //       changeType={() => {}}
      //       // commonData={this.props.store.commonDataStore.commonData}
      //       // zoomLevel={this.props.store.diagramDimensions.zoomLevel}
      //       createdFromType={() => {}}
      //       isEditingFlow={true}
      //       // ivrChains={getIvrChainsEndedBy(elements, element)}
      //     />
      //   );
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