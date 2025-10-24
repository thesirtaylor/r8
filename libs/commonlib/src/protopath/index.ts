import { existsSync } from 'fs';
import { join } from 'path';

export function protoPath(relativePath: string) {
  const prodPath = join(process.cwd(), 'dist', 'protos', relativePath);

  const devPath = join(
    process.cwd(),
    'libs',
    'commonlib',
    'src',
    'protos',
    relativePath,
  );

  if (existsSync(prodPath)) {
    console.log(`✅ Using proto file: ${prodPath}`);
    return prodPath;
  }

  if (existsSync(devPath)) {
    console.log(`✅ Using proto file: ${devPath}`);
    return devPath;
  }

  console.error(`Proto file not found: ${relativePath}`);
  console.error(`Tried: ${prodPath}`);
  console.error(`Tried: ${devPath}`);

  return prodPath;
}
