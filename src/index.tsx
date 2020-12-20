import './styles/main.scss';
import './styles/omni.scss';

import * as ReactDOM from 'react-dom';
import React from 'react';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { GraphEditor } from './scripts/components/graph';
import { Graph, Edge } from './scripts/components/vgraph';

import { ExitNode, PauseNode, ActionNode } from './scripts/components/flow-nodes';

const container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

loadGraph('/big_graph.json');

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

// ReactDOM.render((
//   <svg width="800" height="600">
//     <defs>
//       <marker id="circle" markerWidth="4" markerHeight="4" refX="2" refY="2">
//         <circle cx="2" cy="2" r="2" stroke="none" fill="#000" />
//       </marker>
//       <marker id="arrow" markerWidth="10" markerHeight="4" refX="0" refY="2">
//         <path d="M0,0 L10,2 L0,4" fill="#000" />
//       </marker>
//     </defs>

//     <path 
//       d="M100,200 c50,0 50,20 100,20" 
//       stroke="black" 
//       fill="none"
//       stroke-width="2px" 
//       markerStart="url(#circle)"
//       markerEnd="url(#arrow)"
//     />

//     <path 
//       d="M100,100 C150,100 150,120 200,120" 
//       stroke="black" 
//       fill="none"
//       stroke-width="2px" 
//       markerStart="url(#circle)"
//       markerEnd="url(#arrow)"
//     />
//   </svg>
// ), container)

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
          payload: el
        });
        
        if (el.action?.nextElementId) edges.push({from: el.id, to: el.action.nextElementId});
        el.rules?.forEach(rule => {
          if (rule.nextElementId) edges.push({from: el.id, to: rule.nextElementId});
        });
      });

      edges.forEach(edge => {
        graph.addEdge(edge);
      });

      ReactDOM.render(
        <GraphEditor 
          debug={true}
          graph={graph} 
          minZoom={0.05}
          maxZoom={1}
          zoomSense={0.001}
        />, container
      )
    })
    .catch((error) => {
      console.error(error);
    });
}
