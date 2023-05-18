export const config = {
  dbHost: process.env.DB_HOST || 'localhost',
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbDatabase: process.env.DB_NAME,
  dbPort: process.env.DB_PORT,
  corsOrigin: process.env.CORS_ORIGIN,
};
