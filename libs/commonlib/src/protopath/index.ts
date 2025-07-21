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
  console.log({ devPath });

  const buildPath = join(
    __dirname,
    '..',
    '..',
    '..',
    'dist',
    'protos',
    relativePath,
  );
  console.log({ buildPath });

  return existsSync(devPath) ? buildPath : devPath;
}
