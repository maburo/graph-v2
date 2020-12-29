// import { AABB } from '../../utils/math/types';
interface AABB {}

export interface Arrow {
    x: number;
    y: number;
    orientation: string;
}

export interface Connection {
    startX: number;
    endX: number;
    startY: number;
    endY: number;
    path?: string;
    arrow?: Arrow;
    fromId?: number;
    fromOrder: number;
    toId?: number;
    aabb: AABB;
}

export enum NodeType {
    START_ELEMENT,
    START_WITH_RULES_ELEMENT,
    ACTION_ELEMENT,
    RULES_ELEMENT,
    PAUSE_ELEMENT,
    EXIT_ELEMENT,
    MENU_ELEMENT,
}

export interface NodeConnector {
    x: number;
    y: number;
    order: number;
    connectedTo?: number;
    valid?: boolean;
}

export class NodeCoordinates {
    x: number;
    y: number;
}

export class Node extends NodeCoordinates {
    id: number;
    type: NodeType;
    width: number;
    height: number;
    connectors: NodeConnector[];
    hovered?: boolean;
    aabb?: AABB;
}

export interface Diagram {
    nodes: { [id: number]: Node };
    connections: Connection[];
    aabb: AABB;
    flowAABB?: AABB;
}

export interface DiagramPosition {
    centerX: number;
    centerY: number;
    zoomLevel: number;
}

export interface DiagramDimensions extends DiagramPosition {
    width: number;
    height: number;
    selectedId: number;
    preventClick: boolean;
}
