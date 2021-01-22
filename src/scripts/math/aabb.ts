import { Node } from "../components/graph";
import { Vector2D } from "./vector";

/**
 * Axis aligned bounding box
 */
export default class AABB {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  constructor(minX:number = Number.MAX_SAFE_INTEGER, 
              minY:number = Number.MAX_SAFE_INTEGER,
              maxX:number = Number.MIN_SAFE_INTEGER,
              maxY:number = Number.MIN_SAFE_INTEGER) 
  { 
    this.minX = minX;
    this.minY = minY;
    this.maxX = maxX;
    this.maxY = maxY;
  }

  reset() {
    this.minX = Number.MAX_SAFE_INTEGER;
    this.minY = Number.MAX_SAFE_INTEGER;
    this.maxX = Number.MIN_SAFE_INTEGER;
    this.maxY = Number.MIN_SAFE_INTEGER;
  }

  containsPoint(x:number, y:number): boolean {
    return x >= this.minX && x <= this.maxX && 
           y >= this.minY && y <= this.maxY;
  }

  containsBbox(bbox: AABB): boolean {
    return (bbox.maxX <= this.maxX &&
            bbox.minX >= this.minX &&
            bbox.maxY <= this.maxY &&
            bbox.minY >= this.minY);
  }

  containsNode(node: Node<any>): boolean {
    return (node.x + node.size.x <= this.maxX &&
            node.x >= this.minX &&
            node.y + node.size.y <= this.maxY &&
            node.y >= this.minY);
  }

  addPoint(x:number, y:number) {
    if (this.maxX < x) {
      this.maxX = x;
    } 
    if (this.minX > x) {
      this.minX = x;
    }

    if (this.maxY < y) {
      this.maxY = y;
    } 
    if (this.minY > y) {
      this.minY = y;
    }
    
    return this;
  }

  addPoint2D(vec: Vector2D) {
    return this.addPoint(vec.x, vec.y);
  }

  get width() {
    return Math.abs(this.maxX - this.minX);
  }

  get height() {
    return Math.abs(this.maxY - this.minY);
  }

  static from(a: Vector2D, b: Vector2D) {
    return new AABB(
      Math.min(a.x, b.x),
      Math.min(a.y, b.y),
      Math.max(a.x, b.x),
      Math.max(a.y, b.y)
    )
  }
}