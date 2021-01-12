// import { 
//     getLocalStorageItem, 
//     setLocalStorageItem 
// } from '../../../utils/localStorage.utils';
import { FLOW_DIAGRAM_POSITIONS, MAX_COUNT_STORED_DIAGRAM_POSITIONS } from '../../constants';
import { DiagramPosition } from '../types';

export const NODE_TRANSFORM_DELTA_X = 60;
export const NODE_TRANSFORM_DELTA_Y = 45;
export const NODE_PADDING = 20;

export const ACTION_NODE_WIDTH = 300;
export const ACTION_NODE_HEIGHT = 80;
export const RULES_NODE_WIDTH = ACTION_NODE_WIDTH;
export const RULES_NODE_HEADER_HEIGHT = ACTION_NODE_HEIGHT;

export const RULES_NODE_RULE_PADDING = 10;
export const RULES_NODE_RULE_HEIGHT = 30;
export const RULES_NODE_CONNECTOR_X = 263;

export const RULES_NODE_TOP = 25;
export const RULES_NODE_PADDING = 40;

export const RULES_NODE_DELTA_X = RULES_NODE_HEADER_HEIGHT / 2 + NODE_PADDING;
export const RULES_NODE_FIRST_CONNECTOR_Y_PADDED =
    RULES_NODE_HEADER_HEIGHT + RULES_NODE_RULE_PADDING + RULES_NODE_RULE_HEIGHT / 2 + NODE_PADDING;
export const RULES_NODE_FIRST_CONNECTOR_Y =
    RULES_NODE_HEADER_HEIGHT + RULES_NODE_RULE_PADDING + RULES_NODE_RULE_HEIGHT / 2;
export const RULES_NODE_RULE_DIFF = RULES_NODE_RULE_PADDING + RULES_NODE_RULE_HEIGHT;

export const MENU_NODE_DELTA_X = 40;


export const MENU_NODE_WIDTH = 320;
export const MENU_NODE_HEIGHT = 360;

export const START_NODE_WIDTH = 300;
export const START_NODE_HEIGHT = 60;

export const PAUSE_NODE_WIDTH = 125;
export const PAUSE_NODE_HEIGHT = 50;

export const EXIT_NODE_WIDTH = 130;
export const EXIT_NODE_HEIGHT = 40;

export const CONNECTOR_SIZE = 8;
export const SCHNIPPLE_SIZE = 30;

export const NECESSARILY_VISIBLE_FLOW_SIZE = 100;

export const storeDiagramPosition = (position: DiagramPosition, communicationId: number): void => {
    // let positions = getLocalStorageItem<Record<number, DiagramPosition>>(FLOW_DIAGRAM_POSITIONS) || {};

    // if (Object.keys(positions).length > MAX_COUNT_STORED_DIAGRAM_POSITIONS) {
    //     positions = {};
    // }

    // positions[communicationId] = position;

    // setLocalStorageItem(FLOW_DIAGRAM_POSITIONS, positions);
};

export const getDiagramPosition = (communicationId: number): DiagramPosition => {
    // const localStoragePositions = getLocalStorageItem<Record<number, DiagramPosition>>(FLOW_DIAGRAM_POSITIONS);
    // const storedPosition = localStoragePositions && localStoragePositions[communicationId];

    // return storedPosition || { centerX: 0, centerY: 0, zoomLevel: 1 };
    return { centerX: 0, centerY: 0, zoomLevel: 1 };
};
