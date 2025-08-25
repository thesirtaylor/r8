import { existsSync } from 'fs';
import { join } from 'path';

export function protoPath(relativePath: string) {
  const devPath = join(
    __dirname,
    '..',
    '..',
    '..',
    'libs',
    'commonlib',
    'src',
    'protos',
    relativePath,
  );

  const buildPath = join(
    __dirname,
    '..',
    '..',
    '..',
    'dist',
    'protos',
    relativePath,
  );

  return existsSync(devPath) ? buildPath : devPath;
}
