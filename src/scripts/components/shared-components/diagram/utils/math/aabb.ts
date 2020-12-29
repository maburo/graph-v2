import { AABB } from './types';

export const haveIntersection = (firstAABB: AABB, secondAABB: AABB): boolean => {
    return (
        firstAABB.min.x <= secondAABB.max.x &&
        firstAABB.max.x >= secondAABB.min.x &&
        firstAABB.min.y <= secondAABB.max.y &&
        firstAABB.max.y >= secondAABB.min.y
    );
};

export const haveSegmentsIntersection = (minA: number, maxA: number, minB: number, maxB: number): boolean =>
    minA <= minB ? maxA >= minB : maxB >= minA;

export const getDiagramAABB = (left: number, top: number, width: number, height: number, zoomLevel: number): AABB => ({
    min: {
        x: -left / zoomLevel,
        y: -top / zoomLevel,
    },
    max: {
        x: (-left + width) / zoomLevel,
        y: (-top + height) / zoomLevel,
    },
});

export const narrowAABB = (aabb: AABB, value: number): AABB => {
    const width = aabb.max.x - aabb.min.x;
    const height = aabb.max.y - aabb.min.y;
    const valueX = width < value ? width / 2 : value;
    const valueY = height < value ? height / 2 : value;

    return {
        min: {
            x: aabb.min.x + valueX,
            y: aabb.min.y + valueY,
        },
        max: {
            x: aabb.max.x - valueX,
            y: aabb.max.y - valueY,
        },
    };
};

export const getMinSegmentsDistance = (a1: number, a2: number, b1: number, b2: number) => {
    let distance = 0;
    const minA = Math.min(a1, a2);
    const minB = Math.min(b1, b2);
    const maxA = Math.max(a1, a2);
    const maxB = Math.max(b1, b2);
    if (!haveSegmentsIntersection(minA, maxA, minB, maxB)) {
        const leftDistance = minA - maxB;
        const rightDistance = maxA - minB;
        distance = Math.abs(leftDistance) > Math.abs(rightDistance) ? rightDistance : leftDistance;
    }
    return distance;
};

export const getMinDistance = (aabb1: AABB, aabb2: AABB): { x: number; y: number } => {
    const x = getMinSegmentsDistance(aabb1.min.x, aabb1.max.x, aabb2.min.x, aabb2.max.x);
    const y = getMinSegmentsDistance(aabb1.min.y, aabb1.max.y, aabb2.min.y, aabb2.max.y);

    return { x, y };
};
