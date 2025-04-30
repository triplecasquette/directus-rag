export const normalizeVector = (vec: number[]): number[] => {
  const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0))
  return norm === 0 ? vec : vec.map((val) => val / norm)
}
