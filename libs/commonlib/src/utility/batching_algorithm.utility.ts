export function batchSize(totalSize: number) {
  const batchSize = Math.floor(200 * Math.log10(totalSize));
  return Math.max(200, Math.min(batchSize, totalSize));
}
