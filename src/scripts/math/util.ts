import { ZoomSettings } from "../components/graph-editor";
import AABB from "./aabb";
import { Matrix3D } from "./matrix";
import { Vector2D, Vector3D } from "./vector";

export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export function move(prevPos: Vector3D, shift: Vector2D, bbox: AABB) {
  return new Vector3D(
    clamp(prevPos.x + shift.x, bbox.minX, bbox.maxX),
    clamp(prevPos.y + shift.y, bbox.minY, bbox.maxY),
    prevPos.z
  );
}

export type ZoomFunction = (
  delta: number,
  prevPosition: Vector3D, 
  vpCenter: Vector2D,
  zoom: ZoomSettings,
  origin: Vector2D,
  bbox: AABB) => Transform;

interface Transform {
  position: Vector3D,
  transformMtx: string,
}

export function zoomToCenter(
  delta: number,
  prevPosition: Vector3D, 
  vpCenter: Vector2D,
  zoom: ZoomSettings,
) {
  const position = new Vector3D(
    prevPosition.x,
    prevPosition.y,
    clamp(prevPosition.z + delta, zoom.min, zoom.max)
  );

  return {position, transformMtx: Matrix3D.transformMatrix(position, vpCenter) };
}

// https://stackoverflow.com/questions/21561724/opengl-google-maps-style-2d-camera-zoom-to-mouse-cursor
// https://godotengine.org/qa/25983/camera2d-zoom-position-towards-the-mouse
export function zoomToCursor(
  delta: number,
  prevPosition: Vector3D, 
  vpCenter: Vector2D,
  zoom: ZoomSettings,
  origin: Vector2D,
  bbox: AABB
) {
  const { x: px, y: py, z: pz } = prevPosition;
  const nz = clamp(pz + delta, zoom.min, zoom.max);
  const prevMousePos = screenToWorld(origin, prevPosition, vpCenter);
  const newMousePos = screenToWorld(origin, new Vector3D(px, py, nz), vpCenter);

  const shift = newMousePos.sub(prevMousePos);

  const position = new Vector3D(
    clamp(px - shift.x, bbox.minX, bbox.maxX),
    clamp(py - shift.y, bbox.minY, bbox.maxY),
    nz
  );

  return { position, transformMtx: Matrix3D.transformMatrix(position, vpCenter) };
}

export function screenToWorld(screen: Vector2D, position: Vector3D, vpCenter: Vector2D): Vector2D {
  return new Vector2D(
    (screen.x - vpCenter.x) / position.z + position.x,
    (screen.y - vpCenter.y) / position.z + position.y
  );
}
