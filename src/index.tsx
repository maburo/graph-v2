import './styles/main.scss';
import './styles/omni.scss';

import * as ReactDOM from 'react-dom';
import React, { useRef, useState } from 'react';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { GraphEditor } from './scripts/components/graph-editor';
import { Graph, Edge } from './scripts/components/graph';

import { AABB, Vector2D, zoomToCursor } from './scripts/math';
import { NodeFactory } from './scripts/components/node-factory';

import Editor from './scripts/components/editor';
import { calcEdgeConnectionCoord, edgeOutOffset } from './scripts/components/layers/edges-layer';
import { RULES_NODE_HEADER_HEIGHT, RULES_NODE_TOP, RULES_NODE_PADDING } from './scripts/components/shared-components/diagram/utils/diagram-dimensions.utils';
import { off } from 'process';

const container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

// loadGraph('/big_graph.json');
loadGraph('/all.json');
// loadGraph('/small.json');
// loadGraph('/rules.json');

// ReactDOM.render((
//   <div>
//     <ExitNode
//       // config={{}}
//       id={1}
//       readonly={false}
//       type={FlowElementType.EXIT}
//       />
//     <PauseNode
//       id={2}
//       type={FlowElementType.PAUSE}
//       />
//     <ActionNode
//       totalNumberOfElements={3}
//       id={3}
//       readonly={false}
//       type={FlowElementType.SEND_ACTION}
//       />
//   </div>
// ), container);


function loadGraph(file: string) {
  fetch(file)
    .then((response) => response.json())
    .then((json:any) => {
      const elements = [
        ...json.flowData.startElements, 
        ...json.flowData.flowElements
      ]
           
      const edges: Edge[] = [];
      const graph: Graph<FlowElement> = new Graph();

      elements.forEach((el: FlowElement) => {
        graph.addNode({
          id: el.id,
          x: el.diagramX,
          y: el.diagramY,
          payload: el,
          size: calcNodeSize(el),
        });
        
        if (el.action?.nextElementId) {
          const offset = edgeOutOffset(el.type)
          edges.push({
            xoffset: offset.x,
            yoffset: offset.y,
            from: el.id, 
            to: el.action.nextElementId
          });
        }

        el.rules?.forEach((rule, idx) => {
          const yoffset = RULES_NODE_HEADER_HEIGHT 
            + RULES_NODE_TOP 
            + RULES_NODE_PADDING * idx;

          if (rule.nextElementId) edges.push({
            xoffset: 264,
            yoffset,
            from: el.id, 
            to: rule.nextElementId,
          });
        });
      });

      edges.forEach(edge => {
        graph.addEdge(edge);
      });

      // const node33 = graph.nodes.find(el => el.id === 33)
      // graph.findAllChildren([node33])
      
      ReactDOM.render(
        <div className="root">
          <GraphEditor 
            nodeFactory={new NodeFactory()}
            zoomFunc={zoomToCursor}
            // debug={true}
            graph={graph} 
            zoom={{
              min: 0.05,
              max: 1,
              sense: 0.001,
            }}
            />
          {/* <Editor /> */}
        </div>
        , container
      )
    })
    .catch((error) => {
      console.error(error);
    });
}


function calcNodeSize(node: FlowElement): Vector2D {
  switch (node.type) {
    case FlowElementType.SEND_ACTION:
    case FlowElementType.ADD_TAG:
    case FlowElementType.START_CONVERSATION:
    case FlowElementType.REMOVE_TAG:
    case FlowElementType.ADD_TO_BLACKLIST:
    case FlowElementType.REMOVE_FROM_BLACKLIST:
    case FlowElementType.FAILOVER_ACTION:
    case FlowElementType.IVR_HANG_UP:
    case FlowElementType.UPDATE_PERSON_ACTION:
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
      return new Vector2D(330, 102);
    case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
    case FlowElementType.START_FLOW_WEBHOOK:
    case FlowElementType.START_IVR_INBOUND:
    case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
    case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
    case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
    case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE:
      return new Vector2D(300, 60);
    case FlowElementType.PAUSE:
      return new Vector2D(127, 52);
    case FlowElementType.EXIT:
      return new Vector2D(132, 42);
    default:
      return new Vector2D(10, 10);
    }
}