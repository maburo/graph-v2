/**
 * Axis aligned bounding box
 */
export default class AABB {
  minX;
  minY;
  maxX;
  maxY;

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

  contains(x:number, y:number) {
    return x >= this.minX && x <= this.maxX && 
           y >= this.minY && y <= this.maxY;
  }

  addPoint(x:number, y:number) {
    if (this.maxX < x) {
      this.maxX = x;
    } else if (this.minX > x) {
      this.minX = x;
    }

    if (this.maxY < y) {
      this.maxY = y;
    } else if (this.minY > y) {
      this.minY = y;
    }
  }

  get width() {
    return Math.abs(this.maxX - this.minX);
  }

  get height() {
    return Math.abs(this.maxY - this.minY);
  }

  // get center():Vector2D {
  //   return new Vector2D(this.minX + this.width / 2,
  //                      this.minY + this.height / 2);
  // }
}