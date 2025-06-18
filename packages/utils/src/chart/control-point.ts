export interface ControlPoint {
  x: number;
  y: number;
}

export const extractControlPoints = (pathData: string) => {
  const controlPoints: ControlPoint[] = [];
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  commands.forEach((command) => {
    const type = command[0];
    const coords = command
      .slice(1)
      .trim()
      .split(/[,\s]+/)
      .map(Number);
    if (type === "C") {
      for (let i = 0; i < 4; i += 2) {
        const x = coords[i];
        const y = coords[i + 1];
        if (
          typeof x === "number" &&
          typeof y === "number" &&
          !isNaN(x) &&
          !isNaN(y)
        ) {
          controlPoints.push({ x, y });
        }
      }
    } else if (type === "Q") {
      const x = coords[0];
      const y = coords[1];
      if (
        typeof x === "number" &&
        typeof y === "number" &&
        !isNaN(x) &&
        !isNaN(y)
      ) {
        controlPoints.push({ x, y });
      }
    }
  });
  return controlPoints;
};
