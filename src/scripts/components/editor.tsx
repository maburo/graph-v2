import React, { useContext, useRef, useState } from 'react';
import { Graph, Node } from './graph';
import { GraphContext } from '../../index';

interface Props {
  nodeId?: number;
  graph: Graph<any>;
}

interface State {
  node?: Node<any>;
}

// function useNodeState(nodeId: number): [Node<any>, (node: any) => void] {
//   const ctx = useContext(GraphContext);
//   const [ state, setState ] = useState();
  
//   ctx.selctedNodeState(setState);

//   return [];
// }

export default function Editor(props: Props) {
  // const [ state, setState ] = useState<State>({ });
  // const node = props.graph.selctedNodeState(setState);
  // const [ node, setState ] = useNodeState(props.nodeId)

  
  
  return (
    <div style={{display: 'flex', width: 500}}>
      <div 
        style={{
          width: '5px', 
          backgroundColor: '#333',
        }}
        />

      <div style={{width: '100%'}}>
        {/* <textarea 
          onChange={e => setState(JSON.parse(e.target.value))}
          value={JSON.stringify(node?.payload, null, 2)}
          style={{
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
          }}/> */}
      </div>
    </div>
  );
}