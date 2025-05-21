export function Config() {
  return {
    uri: process.env.URI,
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_password: process.env.REDIS_PASSWORD,
    postgres_host: process.env.POSTGRES_HOST,
    postgres_username: process.env.POSTGRES_USERNAME,
    postgres_password: process.env.POSTGRES_PASSWORD,
    postgres_port: process.env.POSTGRES_PORT,
  };
}
