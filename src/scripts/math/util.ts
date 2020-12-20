export function clamp(value:number, min:number, max:number) {
  if (value > max) return max;
  if (value < min) return min;
  return value;
}

export function makeTransformMatrix(x: number, y: number, z: number) {
  const a = z;
  const d = a;
  const tx = -x;
  const ty = -y
  return `matrix(${a},0,0,${d},${tx},${ty})`;
}