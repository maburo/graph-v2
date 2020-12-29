// import * as _ from 'lodash';
import { FlowElement, FlowElementType, FlowRule } from '@infobip/moments-components';

import { Node, NodeType } from '../types';

import {
    ACTION_NODE_HEIGHT,
    ACTION_NODE_WIDTH,
    EXIT_NODE_HEIGHT,
    EXIT_NODE_WIDTH,
    MENU_NODE_HEIGHT,
    MENU_NODE_WIDTH,
    PAUSE_NODE_HEIGHT,
    PAUSE_NODE_WIDTH,
    RULES_NODE_CONNECTOR_X,
    RULES_NODE_FIRST_CONNECTOR_Y,
    RULES_NODE_HEADER_HEIGHT,
    RULES_NODE_RULE_DIFF,
    RULES_NODE_WIDTH,
    START_NODE_HEIGHT,
    START_NODE_WIDTH,
} from './diagram-dimensions.utils';
import { getNodeWithAABB } from './diagram-calculator.utils';
import { Connector } from '../connector';

export function mapElementToNode(element: FlowElement): Node | null {
    switch (element.type) {
        case FlowElementType.START_RESOLVE_ONETIME_AUDIENCE:
        case FlowElementType.START_FLOW_WEBHOOK:
        case FlowElementType.START_IVR_INBOUND: {
            const node = {
                id: element.id,
                type: NodeType.START_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: START_NODE_WIDTH,
                height: START_NODE_HEIGHT,
                connectors: [
                    {
                        x: START_NODE_WIDTH,
                        y: START_NODE_HEIGHT / 2,
                        connectedTo: element.action && element.action.nextElementId,
                        order: -1,
                    },
                ],
            };
            return getNodeWithAABB(element, node);
        }
        case FlowElementType.START_EVALUATE_INBOUND_MESSAGE:
        case FlowElementType.START_EVALUATE_PEOPLE_EVENT:
        case FlowElementType.START_EVALUATE_BEHAVIOUR_EVENT:
        case FlowElementType.START_EVALUATE_DATE_TIME_ATTRIBUTE: {
            const node = {
                id: element.id,
                type: NodeType.START_WITH_RULES_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: START_NODE_WIDTH,
                height: START_NODE_HEIGHT + (element.rules ? element.rules.length * RULES_NODE_RULE_DIFF : 0),
                connectors: element.rules?.map((r, i) => mapRuleConnector(r, i, -20)),
            };
            return getNodeWithAABB(element, node);
        }
        case FlowElementType.EXIT: {
            const node = {
                id: element.id,
                type: NodeType.EXIT_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: EXIT_NODE_WIDTH,
                height: EXIT_NODE_HEIGHT,
                connectors: [],
            } as Node;
            return node
        }
        case FlowElementType.PAUSE: {
            const node = {
                id: element.id,
                type: NodeType.PAUSE_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: PAUSE_NODE_WIDTH,
                height: PAUSE_NODE_HEIGHT,
                connectors: [
                    {
                        x: PAUSE_NODE_WIDTH,
                        y: PAUSE_NODE_HEIGHT / 2,
                        connectedTo: element.action && element.action.nextElementId,
                        order: -1,
                        // valid: true,
                    },
                ],
            };
            return getNodeWithAABB(element, node);
        }
        case FlowElementType.SEND_ACTION:
        case FlowElementType.ADD_TAG:
        case FlowElementType.START_CONVERSATION:
        case FlowElementType.REMOVE_TAG:
        case FlowElementType.ADD_TO_BLACKLIST:
        case FlowElementType.REMOVE_FROM_BLACKLIST:
        case FlowElementType.FAILOVER_ACTION:
        case FlowElementType.IVR_HANG_UP:
        case FlowElementType.UPDATE_PERSON_ACTION: {
            const node = {
                id: element.id,
                type: NodeType.ACTION_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: ACTION_NODE_WIDTH,
                height: ACTION_NODE_HEIGHT,
                connectors: [
                    {
                        x: ACTION_NODE_WIDTH,
                        y: ACTION_NODE_HEIGHT / 2,
                        connectedTo: element.action && element.action.nextElementId,
                        order: -1,
                        // valid: true,
                    },
                ],
            };
            return getNodeWithAABB(element, node);
        }
        case FlowElementType.NEW_ELEMENT: {
            const node = {
                id: element.id,
                type: NodeType.MENU_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: MENU_NODE_WIDTH,
                height: MENU_NODE_HEIGHT,
                connectors: [],
            } as Node;
            return node;
        }
        case FlowElementType.EVALUATE_PARTICIPANT_DATA:
        case FlowElementType.EVALUATE_VALUE:
        case FlowElementType.EVALUATE_INBOUND_MESSAGE:
        case FlowElementType.EVALUATE_EVENT:
        case FlowElementType.EVALUATE_BEHAVIOUR_EVENT:
        case FlowElementType.EVALUATE_ATTRIBUTE_EVENT:
        case FlowElementType.DIAL_IVR_ACTION:
        case FlowElementType.RECORD_IVR_ACTION:
        case FlowElementType.PLAY_IVR_ACTION:
        case FlowElementType.CALL_URL:
        case FlowElementType.COLLECT_IVR_ACTION:
        case FlowElementType.START_CALL_IVR_ACTION:
        case FlowElementType.PERFORM_EXPERIMENT_ACTION:
        case FlowElementType.EVALUATE_DATE_TIME_ATTRIBUTE: {
            const node = {
                id: element.id,
                type: NodeType.RULES_ELEMENT,
                x: element.diagramX,
                y: element.diagramY,
                width: RULES_NODE_WIDTH,
                height: RULES_NODE_HEADER_HEIGHT + RULES_NODE_RULE_DIFF * element?.rules.length,
                connectors: element.rules?.map((r, i) => mapRuleConnector(r, i, 0)),
            };
            return getNodeWithAABB(element, node);
        }
        default:
            return null;
    }
}

function mapRuleConnector(rule: FlowRule, index: number, delta: number) {
    return {
        x: RULES_NODE_CONNECTOR_X,
        y: RULES_NODE_FIRST_CONNECTOR_Y + RULES_NODE_RULE_DIFF * index + delta,
        connectedTo: rule.nextElementId,
        order: index,
        // valid: rule.valid,
    };
}
