import { FlowElement, FlowElementType } from "@infobip/moments-components";
import { Point } from '../../shared-components/diagram/utils/math/types';
import { Edge, EdgeId, Node, NodeEdge } from '../../graph';
import { 
  ACTION_NODE_HEIGHT, 
  ACTION_NODE_WIDTH, 
  EXIT_NODE_HEIGHT, 
  PAUSE_NODE_HEIGHT, 
  PAUSE_NODE_WIDTH, 
  RULES_NODE_HEADER_HEIGHT, 
  RULES_NODE_PADDING, 
  RULES_NODE_TOP, 
  RULES_NODE_WIDTH, 
  START_NODE_HEIGHT, 
  START_NODE_WIDTH 
} from '../../shared-components/diagram/utils/diagram-dimensions.utils';

const HALF_ACTION_NODE_HEIGHT = ACTION_NODE_HEIGHT / 2;
const HALF_PAUSE_NODE_HEIGHT = PAUSE_NODE_HEIGHT / 2;
const HALF_EXIT_NODE_HEIGHT = EXIT_NODE_HEIGHT / 2;
const HALF_START_NODE_HEIGHT = START_NODE_HEIGHT / 2;
const HALF_RULES_NODE_HEADER_HEIGHT = RULES_NODE_HEADER_HEIGHT / 2;

export function calcEdgeConnectionCoord(from: Node<FlowElement>, to: Node<FlowElement>) {
  return {
    ...calcOutCoords(from),
    ...calcInCoords(from),
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
        fromX: node.x + RULES_NODE_WIDTH,
        fromY: node.y + HALF_RULES_NODE_HEADER_HEIGHT,
      }
    case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
    case FlowElementType.START_FLOW_WEBHOOK:
    case FlowElementType.START_IVR_INBOUND:
    case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
    case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
    case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
    case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE:
      return {
        fromX: node.x + START_NODE_WIDTH,
        fromY: node.y + HALF_START_NODE_HEIGHT,
      }
    case FlowElementType.PAUSE:
      return {
        fromX: node.x + PAUSE_NODE_WIDTH,
        fromY: node.y + HALF_PAUSE_NODE_HEIGHT,
      }
    default:
      return { 
        fromX: node.x, 
        fromY: node.y 
      };
    }
}

export function calcInCoords(to: Node<FlowElement>) {
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
      return { 
        toX: to.x, 
        toY: to.y + HALF_ACTION_NODE_HEIGHT 
      };
    case FlowElementType.EXIT:
      return { 
        toX: to.x, 
        toY: to.y + HALF_EXIT_NODE_HEIGHT 
      };
    case FlowElementType.PAUSE:
      return { 
        toX: to.x, 
        toY: to.y + HALF_PAUSE_NODE_HEIGHT 
      };
    default:
      return { 
        toX: to.x, 
        toY: to.y 
      };
    }
}

//------------------ Offset

export function edgeInOffset(type: FlowElementType | string) {
  switch (type) {
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
        toX: 0, 
        toY: HALF_ACTION_NODE_HEIGHT 
      };
    case FlowElementType.EXIT:
      return { 
        toX: 0, 
        toY: HALF_EXIT_NODE_HEIGHT 
      };
    case FlowElementType.PAUSE:
      return { 
        toX: 0, 
        toY: HALF_PAUSE_NODE_HEIGHT 
      };
    default:
      return { 
        toX: 0, 
        toY: 0 
      };
    }
}

export function edgeOutOffset(type: FlowElementType | string): Point {
  switch (type) {
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
        x: ACTION_NODE_WIDTH,
        y: HALF_ACTION_NODE_HEIGHT,
      }
    case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
    case FlowElementType.START_FLOW_WEBHOOK:
    case FlowElementType.START_IVR_INBOUND:
    case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
    case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
    case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
    case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE:
      return {
        x: START_NODE_WIDTH,
        y: HALF_START_NODE_HEIGHT,
      }
    case FlowElementType.PAUSE:
      return {
        x: PAUSE_NODE_WIDTH,
        y: HALF_PAUSE_NODE_HEIGHT,
      }
    default:
      return { 
        x: 0, 
        y: 0 
      };
    }
}
