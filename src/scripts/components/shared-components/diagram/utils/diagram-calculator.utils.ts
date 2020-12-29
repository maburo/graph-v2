// import * as _ from 'lodash';
import { FlowElement } from '@infobip/moments-components';

import { Connection, Node, NodeType } from '../types';
import { AABB, Point } from './math/types';

import {
    CONNECTOR_SIZE,
    MENU_NODE_DELTA_X,
    NODE_PADDING,
    RULES_NODE_DELTA_X,
    RULES_NODE_FIRST_CONNECTOR_Y_PADDED,
    RULES_NODE_RULE_DIFF,
    SCHNIPPLE_SIZE,
} from './diagram-dimensions.utils';

interface Zone {
    xRange: number[];
    yRange: number[];
}

interface Rule {
    position: string;
    plot: (start: Point, end: Point, startBounds?: Node, endBounds?: Node) => Point[];
}

export function buildConnection(startNode: Node, endNode: Node, conditionOrder: number): Connection | undefined {
    startNode = padNode(startNode);
    endNode = padNode(endNode);

    const startPoint = getStart(startNode, conditionOrder);
    const endPointsByPosition = getEndsByPosition(endNode);

    const zones = defineZones(startNode.y, startNode.y + startNode.height, startPoint.x, startPoint.y);

    
    const selectedRule = zones.map(zone => zone.rules.find(rule => contains(zone, (endPointsByPosition as any)[rule.position])))[0] as Rule;
    if (!selectedRule) {
        return;
    }

    const endPoint = (endPointsByPosition as any)[selectedRule.position];

    const actualStartPoint = getActualStart(startNode, startPoint);
    const actualEndPoint = getActualEnd(selectedRule.position, endPoint);

    const pathPoints = selectedRule.plot(startPoint, endPoint, startNode, endNode);
    const allPoints = removeExtraPoints([actualStartPoint, startPoint, ...pathPoints, endPoint, actualEndPoint]);

    return {
        startX: actualStartPoint.x,
        endX: actualEndPoint.x,
        startY: actualStartPoint.y,
        endY: actualEndPoint.y,
        path: buildSvgPath(allPoints),
        fromId: startNode.id,
        fromOrder: conditionOrder,
        toId: endNode.id,
        arrow: {
            ...actualEndPoint,
            orientation: calculateOrientation(endPoint, actualEndPoint),
        },
        aabb: {
            min: {
                x: Math.min(actualStartPoint.x, actualEndPoint.x) - NODE_PADDING,
                y: Math.min(actualStartPoint.y, actualEndPoint.y) - NODE_PADDING,
            },
            max: {
                x: Math.max(actualStartPoint.x, actualEndPoint.x) + NODE_PADDING,
                y: Math.max(actualStartPoint.y, actualEndPoint.y) + NODE_PADDING,
            },
        },
    };
}

function padNode(node: Node): Node {
    return {
        ...node,
        x: node.x - NODE_PADDING,
        y: node.y - NODE_PADDING,
        width: node.width + 2 * NODE_PADDING,
        height: node.height + 2 * NODE_PADDING,
    };
}

function getStart(node: Node, order: number) {
    if (node.type === NodeType.START_ELEMENT) {
        return {
            x: node.x + node.width,
            y: node.y + node.height / 2,
        };
    }

    if (node.type === NodeType.START_WITH_RULES_ELEMENT) {
        return {
            x: node.x + node.width - 40,
            y: node.y + RULES_NODE_FIRST_CONNECTOR_Y_PADDED - 20 + RULES_NODE_RULE_DIFF * order,
        };
    }

    if (node.type === NodeType.RULES_ELEMENT) {
        return {
            x: node.x + node.width,
            y: node.y + RULES_NODE_FIRST_CONNECTOR_Y_PADDED + RULES_NODE_RULE_DIFF * order,
        };
    }

    return {
        x: node.x + node.width,
        y: node.y + node.height / 2,
    };
}

function getEndsByPosition(toNode: Node) {
    switch (toNode.type) {
        case NodeType.EXIT_ELEMENT:
            return {
                LEFT: { x: toNode.x, y: toNode.y + toNode.height / 2 },
                UP: { x: toNode.x + toNode.width / 2, y: toNode.y },
                RIGHT: { x: toNode.x + toNode.width, y: toNode.y + toNode.height / 2 },
                DOWN: { x: toNode.x + toNode.width / 2, y: toNode.y + toNode.height },
            };

        case NodeType.ACTION_ELEMENT:
        case NodeType.PAUSE_ELEMENT:
            return {
                LEFT: { x: toNode.x, y: toNode.y + toNode.height / 2 },
                UP: { x: toNode.x + toNode.width / 2, y: toNode.y },
                DOWN: { x: toNode.x + toNode.width / 2, y: toNode.y + toNode.height },
            };

        case NodeType.RULES_ELEMENT:
            return {
                LEFT: { x: toNode.x, y: toNode.y + RULES_NODE_DELTA_X },
                UP: { x: toNode.x + toNode.width / 2, y: toNode.y },
                RIGHT: { x: toNode.x + toNode.width, y: toNode.y + RULES_NODE_DELTA_X },
            };

        case NodeType.MENU_ELEMENT:
            return {
                LEFT: { x: toNode.x, y: toNode.y + MENU_NODE_DELTA_X },
                UP: { x: toNode.x + toNode.width / 2, y: toNode.y },
                RIGHT: { x: toNode.x + toNode.width, y: toNode.y + MENU_NODE_DELTA_X },
            };
    }
    return {};
}

function defineZones(nodeTopY: number, nodeBottomY: number, startX: number, startY: number) {
    return [
        {
            xRange: [startX, Infinity],
            yRange: [-Infinity, startY],
            rules: [
                {
                    position: 'LEFT',
                    plot: (start: Point, end: Point) => [
                        { x: (end.x + start.x) / 2, y: start.y },
                        { x: (end.x + start.x) / 2, y: end.y },
                    ],
                },
                {
                    position: 'DOWN',
                    plot: (start: Point, end: Point) => [{ x: end.x, y: start.y }],
                },
                {
                    position: 'RIGHT',
                    plot: (start: Point, end: Point) => [{ x: end.x, y: start.y }],
                },
            ],
        },
        {
            xRange: [startX, Infinity],
            yRange: [startY, Infinity],
            rules: [
                {
                    position: 'LEFT',
                    plot: (start: Point, end: Point) => [
                        { x: (end.x + start.x) / 2, y: start.y },
                        { x: (end.x + start.x) / 2, y: end.y },
                    ],
                },
                {
                    position: 'UP',
                    plot: (start: Point, end: Point) => [{ x: end.x, y: start.y }],
                },
                {
                    position: 'RIGHT',
                    plot: (start: Node, end: Node) => [{ x: end.x, y: start.y }],
                },
            ],
        },
        {
            xRange: [-Infinity, startX],
            yRange: [-Infinity, nodeTopY],
            rules: [
                {
                    position: 'DOWN',
                    plot: (start: Point, end: Point, bounds: Node) => [
                        { x: start.x, y: (end.y + bounds.y) / 2 },
                        { x: end.x, y: (end.y + bounds.y) / 2 },
                    ],
                },
                {
                    position: 'RIGHT',
                    plot: (start: Point, end: Point) => [{ x: start.x, y: end.y }],
                },
                {
                    position: 'UP',
                    plot: (start: Point, end: Point, startBounds: Node, endBounds: Node) => [
                        { x: Math.max(start.x, end.x + endBounds.width / 2), y: start.y },
                        { x: Math.max(start.x, end.x + endBounds.width / 2), y: end.y },
                    ],
                },
            ],
        },
        {
            xRange: [-Infinity, startX],
            yRange: [nodeBottomY, Infinity],
            rules: [
                {
                    position: 'UP',
                    plot: (start: Point, end: Point, startBounds: Node) => [
                        { x: start.x, y: (end.y + startBounds.y + startBounds.height) / 2 },
                        { x: end.x, y: (end.y + startBounds.y + startBounds.height) / 2 },
                    ],
                },
                {
                    position: 'RIGHT',
                    plot: (start: Point, end: Point) => [{ x: start.x, y: end.y }],
                },
                {
                    position: 'DOWN',
                    plot: (start: Point, end: Point, startBounds: Node, endBounds: Node) => [
                        { x: Math.max(start.x, end.x + endBounds.width / 2), y: start.y },
                        { x: Math.max(start.x, end.x + endBounds.width / 2), y: end.y },
                    ],
                },
            ],
        },
        {
            xRange: [-Infinity, startX],
            yRange: [nodeTopY, nodeBottomY],
            rules: [
                {
                    position: 'DOWN',
                    plot: (start: Point, end: Point, bounds: Node) => [
                        { x: start.x, y: bounds.y + bounds.height },
                        {
                            x: end.x,
                            y: bounds.y + bounds.height,
                        },
                    ],
                },
                {
                    position: 'UP',
                    plot: (start: Point, end: Point, bounds: Node) => [
                        { x: start.x, y: bounds.y },
                        { x: end.x, y: bounds.y },
                    ],
                },
            ],
        },
        {
            xRange: [startX, Infinity],
            yRange: [-Infinity, startY],
            rules: [
                {
                    position: 'UP',
                    plot: (start: Point, end: Point) => [{ x: start.x, y: end.y }],
                },
            ],
        },
    ];
}

function contains(zone: Zone, point: Node) {
    return (
        point &&
        zone.xRange[0] <= point.x &&
        point.x <= zone.xRange[1] &&
        zone.yRange[0] <= point.y &&
        point.y <= zone.yRange[1]
    );
}

function getActualStart(startNode: Node, startPoint: Point) {
    return startNode.type === NodeType.RULES_ELEMENT
        ? { ...startPoint, x: startPoint.x - RULES_NODE_DELTA_X }
        : { ...startPoint, x: startPoint.x - NODE_PADDING };
}

function getActualEnd(position: string, endPoint: Point) {
    switch (position) {
        case 'UP':
            return { ...endPoint, y: endPoint.y + NODE_PADDING - 1 };
        case 'DOWN':
            return { ...endPoint, y: endPoint.y - NODE_PADDING + 1 };
        case 'LEFT':
            return { ...endPoint, x: endPoint.x + NODE_PADDING - 1 };
        case 'RIGHT':
            return { ...endPoint, x: endPoint.x - NODE_PADDING + 1 };
        default:
            return endPoint;
    }
}

function removeExtraPoints(points: Point[]) {
    for (let i = 1; i < points.length - 1; i++) {
        const previous = points[i - 1];
        const current = points[i];
        const next = points[i + 1];
        if ((previous.x === current.x && current.x === next.x) || (previous.y === current.y && current.y === next.y)) {
            points.splice(i, 1);
            i--;
        }
    }
    return points;
}

function buildSvgPath(path: Point[]) {
    let result = '';
    for (let i = 0; i < path.length; i++) {
        if (i === 0) {
            result += `${`M${path[0].x}`},${path[0].y} `;
        } else if (i !== path.length - 1) {
            const prev = path[i - 1];
            const curr = path[i];
            const next = path[i + 1];

            const deltaPrev = { x: curr.x - prev.x, y: curr.y - prev.y };
            const deltaNext = { x: next.x - curr.x, y: next.y - curr.y };
            const deltaNextPrev = { x: next.x - prev.x, y: next.y - prev.y };

            const radius = Math.min(10, Math.abs(deltaNextPrev.x), Math.abs(deltaNextPrev.y)) / 2;
            result += `${`L${curr.x - radius * sign(deltaPrev.x)}`},${curr.y - radius * sign(deltaPrev.y)} `;

            const direction = Math.max(-sign(deltaPrev.y * deltaNext.x - deltaNext.y * deltaPrev.x), 0);
            result += ` a${radius},${radius} 0 0 ${direction} ${sign(deltaNextPrev.x) * radius},${
                sign(deltaNextPrev.y) * radius
            } `;
            result += `${`L${curr.x + radius * sign(deltaNext.x)}`},${curr.y + radius * sign(deltaNext.y)} `;
        } else {
            result += `${`L${path[i].x}`},${path[i].y}`;
        }
    }
    return result;
}

function sign(x: number) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
}

function calculateOrientation(start: Point, end: Point) {
    if (start.x === end.x) {
        return start.y < end.y ? 'DOWN' : 'UP';
    }

    return start.x < end.x ? 'LEFT' : 'RIGHT';
}

export function calculatePositionOfNewStartElement(
    startElements: FlowElement[],
    initialPosition: { x: number; y: number },
): { x: number; y: number } {
    let newPositionY = initialPosition.y;

    const verticalOffset = 110; // Start element height + additional top offset

    // Bucket is number which represents multiplier of vertical offset of of initial Y position.
    // For example - if we have elements with coordinates: (0,0) and (0,20) and vertical offset is 10 - then we have buckets [0, 2].
    const takenPositionBuckets: number[] = [];
    startElements.forEach((element: FlowElement) => {
        const posX = element.diagramX || 0;
        const posY = element.diagramY || 0;

        if (posX === initialPosition.x && (posY - initialPosition.y) % verticalOffset === 0) {
            takenPositionBuckets.push((posY - initialPosition.y) / verticalOffset);
        }
    });

    // Find first available bucket, e.g for taken bucket list: [0, 1, 3] first available bucket would be 2.
    takenPositionBuckets.sort();
    if (takenPositionBuckets.length > 0) {
        let availableBucket = 0;
        for (let i = 0; i < takenPositionBuckets.length; i++) {
            const takenBucket = takenPositionBuckets[i];
            if (takenBucket >= availableBucket + 2) {
                availableBucket += 1;
                break;
            } else if (i === takenPositionBuckets.length - 1) {
                availableBucket = takenBucket + 1;
                break;
            }
            availableBucket = takenBucket;
        }
        newPositionY += availableBucket * verticalOffset;
    }

    return {
        x: initialPosition.x,
        y: newPositionY,
    };
}

export function calculateCanvasStyle(dimensions: any): Record<string, unknown> {
    const { width, height, centerX, centerY, zoomLevel } = dimensions;

    return {
        position: 'absolute',
        left: width / 2 + centerX,
        top: height / 2 + centerY,
        MsTransform: `scale(${zoomLevel})`,
        MsTransformOrigin: '0 0',
        MozTransform: `scale(${zoomLevel})`,
        MozTransformOrigin: '0 0',
        OTransform: `scale(${zoomLevel})`,
        OTransformOrigin: '0 0',
        WebkitTransform: `scale(${zoomLevel})`,
        WebkitTransformOrigin: '0 0',
        transform: `scale(${zoomLevel})`,
        transformOrigin: '0 0',
    };
}

export function getNodeWithAABB(element: FlowElement, node: Omit<Node, 'aabb'>): Node {
    const connectorExtraWidth = element.rules?.length
        ? 0
        : node.connectors.some(connector => connector.connectedTo)
        ? CONNECTOR_SIZE / 2
        : CONNECTOR_SIZE + SCHNIPPLE_SIZE;

    return {
        ...node,
        aabb: {
            min: {
                x: node.x,
                y: node.y,
            },
            max: {
                x: node.x + node.width + connectorExtraWidth,
                y: node.y + node.height,
            },
        },
    };
}

export function getFlowAABB(nodes: Node[], connections: Connection[]): AABB | undefined {
    if (!nodes.length) return undefined;

    // const criticalPoints = [...nodes, ...connections].reduce(
    //     (result: { minx: number[]; miny: number[]; maxx: number[]; maxy: number[] }, current) => {
    //         result.minx.push(current.aabb.min.x);
    //         result.maxx.push(current.aabb.max.x);
    //         result.miny.push(current.aabb.min.y);
    //         result.maxy.push(current.aabb.max.y);
    //         return result;
    //     },
    //     { minx: [], miny: [], maxx: [], maxy: [] },
    // );
    // return {
    //     min: {
    //         x: Math.min(...criticalPoints.minx),
    //         y: Math.min(...criticalPoints.miny),
    //     },
    //     max: {
    //         x: Math.max(...criticalPoints.maxx),
    //         y: Math.max(...criticalPoints.maxy),
    //     },
    // };
}
