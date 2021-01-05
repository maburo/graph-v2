import { FlowElement, FlowElementType } from '@infobip/moments-components';
import React, { useState, useEffect, useRef, EventHandler, useContext } from 'react';
import { render } from 'react-dom';
import { start } from 'repl';
import { clamp, Vector2D } from '../../math';
import { Node } from '../graph';
import { LayerProperties } from './layer-props';

// const EdgeComponent = React.memo(edgeComponent);

interface EdgesLayerProps extends LayerProperties {
  update: Date,
  edges: EdgeData[],
  transform: string,
}

// function svgLayer(props: SvgLayerProps) {
export class EdgesLayer extends React.PureComponent<EdgesLayerProps> {
  // shouldComponentUpdate(next: SvgLayerProps) {
  //   const a = this.props as any;
  //   const b = next as any;

  //   Object.keys(a).forEach(key => {
  //     if (a[key] !== b[key]) console.log('>> svg layer', key);
  //   })
  //   return true;
  // }

  render() {
    const props = this.props;

  const transform = props.transform;
  const edges = props.edges.map(edge => (
    <EdgeComponent 
      key={edge.key} 
      startX={edge.startX}
      startY={edge.startY}
      endX={edge.endX}
      endY={edge.endY}
      />
  ));
 
  return (
    <svg className="render layer">
    <defs>
      <marker id="circle" markerWidth="4" markerHeight="4" refX="2" refY="2">
        <circle cx="2" cy="2" r="2" stroke="none" fill="#000" />
      </marker>
      <marker id="arrow" markerWidth="10" markerHeight="4" refX="0" refY="2">
        <path d="M0,0 L10,2 L0,4" fill="#000" />
      </marker>
    </defs>

    <g style={{transform}}>
      { edges }
    </g>
  </svg>
  );
}
}

// export const SvgLayer = React.memo(svgLayer);

export interface EdgeData {
  key: string,
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface EdgeProperties {
  key: string,
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const curve = 50;
const curveFactor = 2/curve;
const COLOR_VALUES = ['0', '1', '2', '3', '4', '5', '6', '7', 
'8', '9', '0', 'A', 'B', 'C', 'D', 'E', 'F'];

// function edgeComponent(props: EdgeProperties) {
class EdgeComponent extends React.PureComponent<EdgeProperties> {

  // shouldComponentUpdate(next: EdgeProperties) {
  //   const a = this.props as any;
  //   const b = next as any;

  //   Object.keys(a).forEach(key => {
  //     if (a[key] !== b[key]) console.log('>> edge', key);
  //   })
  //   return true;
  // }

  render() {    
    const props = this.props;

  const { startX, startY, endX, endY } = props;
  
  const halfLen = (endX - startX) * .5;
  const curveMag = -clamp((halfLen - curve) * curveFactor, Number.MIN_SAFE_INTEGER, 0);
  const factor = curve * curveMag;
  const centerX = startX + halfLen;
  const x1 = centerX + factor;
  const x2 = centerX - factor;
  const path = `M ${startX} ${startY} C${x1} ${startY}, ${x2} ${endY} ${endX-10} ${endY}`;

  const color = "#000";
  // const color = '#'
  //   + COLOR_VALUES[Math.floor(Math.random() * 16)] 
  //   + COLOR_VALUES[Math.floor(Math.random() * 16)] 
  //   + COLOR_VALUES[Math.floor(Math.random() * 16)];

  
  return (
    <g>
      <path 
        className="omni-flow-path-path-overlay"
        d={path} 
        stroke={color} 
        fill="none"
        stroke-width="10px" 
        />

      <path 
        style={{
          pointerEvents: 'none'
        }}
        d={path} 
        stroke={color} 
        fill="none"
        stroke-width="1px" 
        markerStart="url(#circle)"
        markerEnd="url(#arrow)"
        />
    </g>
  );
}
}

export function calcEdgeConnectionCoord(from: Node<FlowElement>, to: Node<FlowElement>) {
  return {
    ...calcOutCoords(from),
    ...calcInCoords(from, to),
  }
}

export function calcOutCoords(node: Node<FlowElement>) {
  switch (node.payload.type) {
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
      return {
        fromX: node.x + 300,
        fromY: node.y + 80 / 2,
      }
    case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
    case FlowElementType.START_FLOW_WEBHOOK:
    case FlowElementType.START_IVR_INBOUND:
    case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
    case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
    case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
    case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE:
      return {
        fromX: node.x + 300,
        fromY: node.y + 80 /2,
      }
    case FlowElementType.PAUSE:
      return {
        fromX: node.x + 125,
        fromY: node.y + 50 / 2,
      }
    default:
      return { fromX: node.x, fromY: node.y };
    }
}

export function calcInCoords(from: Node<FlowElement>, to: Node<FlowElement>) {
  switch (to.payload.type) {
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
      return { toX: to.x, toY: to.y + 80 / 2 };
    case FlowElementType.EXIT:
      return { toX: to.x, toY: to.y + 40 / 2 };
    case FlowElementType.PAUSE:
      return { toX: to.x, toY: to.y + 50 / 2 };
    default:
      return { toX: to.x, toY: to.y };
    }
}