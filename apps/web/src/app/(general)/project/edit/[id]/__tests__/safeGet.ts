export function safeGet2D<T>(array: T[][], row: number, col: number): T {
  if (row < 0 || row >= array.length) {
    throw new Error(
      `Row ${row} is out of bounds for array of length ${array.length}`
    );
  }
  const rowData = array[row]!;
  if (col < 0 || col >= rowData.length) {
    throw new Error(
      `Column ${col} is out of bounds for row of length ${rowData.length}`
    );
  }
  return rowData[col]!;
}

export function safeGet3D<T>(
  array: T[][][],
  row: number,
  col: number,
  depth: number
): T {
  if (row < 0 || row >= array.length) {
    throw new Error(
      `Row ${row} is out of bounds for array of length ${array.length}`
    );
  }
  const rowData = array[row]!;
  if (col < 0 || col >= rowData.length) {
    throw new Error(
      `Column ${col} is out of bounds for row of length ${rowData.length}`
    );
  }
  const depthData = rowData[col]!;
  if (depth < 0 || depth >= depthData.length) {
    throw new Error(
      `Depth ${depth} is out of bounds for depth of length ${depthData.length}`
    );
  }
  return depthData[depth]!;
}
