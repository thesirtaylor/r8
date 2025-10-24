import 'dotenv/config';

export const LoadEnvVar = (k: string) => {
  const v = process.env[k];
  if (!v) throw new Error(`Missing required env: ${k}`);
  return v;
};
