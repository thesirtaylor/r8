import * as zlib from 'zlib';
import { promisify } from 'util';

const deflate = promisify(zlib.deflate);
const inflate = promisify(zlib.inflate);

export async function setCompression(
  cache: any,
  key: string,
  value: any,
  ttl: number,
) {
  const json = JSON.stringify(value);
  const compressed = await deflate(json);
  await cache.set(key, compressed.toString('base64'), ttl);
}

export async function getCompression<T>(
  cache: any,
  key: string,
): Promise<T | null> {
  const base64 = await cache.get(key);
  if (!base64) return null;

  const buffer = Buffer.from(base64, 'base64');
  const inflated = await inflate(buffer);
  return JSON.parse(inflated.toString());
}

export async function deleteCache(pattern: string, cache: any) {
  const keys = await cache.keys(pattern);
  if (keys) {
    await cache.del(...keys);
    console.log(`${keys.length} rating cache keys for entity ${pattern}`);
  }
}
