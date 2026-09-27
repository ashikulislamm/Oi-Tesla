interface Config {
  port: number;
  nodeEnv: string;
  databaseUrl?: string;
  jwtSecret: string;
  clientUrl: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || 'dev_jwt_secret_oi_tesla_key',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
};

export default config;
