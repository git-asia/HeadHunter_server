export const config = {
  dbHost: process.env.MYSQLHOST || 'localhost',
  dbUser: process.env.MYSQLUSER,
  dbPassword: process.env.MYSQLPASSWORD,
  dbDatabase: process.env.MYSQLDATABASE,
  dbPort: process.env.MYSQLPORT,
  sqlUrl: process.env.DATABASE_URL,
  corsOrigin: process.env.CORS_ORIGIN,
  appPort: process.env.PORT || 3001,
};
