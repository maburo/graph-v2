import './styles/main.scss';
import './styles/omni.scss';

import * as ReactDOM from 'react-dom';
import React from 'react';
import { FlowElement, FlowElementType } from '@infobip/moments-components';
import { GraphEditor } from './scripts/components/graph';
import { Graph, Edge } from './scripts/components/vgraph';

import { ExitNode, PauseNode, ActionNode } from './scripts/components/flow-nodes';
import { AABB } from './scripts/math';
import { NodeFactory } from './scripts/components/node-factory';

const container = document.createElement('div');
container.className = 'container';
document.body.appendChild(container);

// loadGraph('/big_graph.json');
loadGraph('/15065834.json');
// loadGraph('/small.json');

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
          bbox: new AABB(),
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
          nodeFactory={new NodeFactory()}
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
