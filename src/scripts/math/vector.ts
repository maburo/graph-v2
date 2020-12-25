export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export class Vector2D {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  add(vec: Vector2D): Vector2D {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  add2d(x: number, y: number): Vector2D {
    this.x += x;
    this.y += y;
    return this;
  }

  sub(vec: Vector2D): Vector2D {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  mul(scalar: number): Vector2D {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  div(scalar: number): Vector2D {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }
}