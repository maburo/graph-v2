export class Vector3D {
  x: number;
  y: number;
  z: number;

  constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  setXY(x: number, y: number): Vector3D {
    return new Vector3D(this.x + x, this.y + y, this.z);
  }
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

  mulMtx3D(m: number[]): Vector2D {
    return new Vector2D(
      this.x * m[0] + this.y * m[1] + m[2], 
      this.x * m[3] + this.y * m[4] + m[5]);
  }
}