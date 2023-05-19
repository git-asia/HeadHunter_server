import { config } from './config';
import { createPool, PoolConnection } from 'mysql2/promise';
import { RowDataPacket } from 'mysql2';

export const pool = createPool({
  host: config.dbHost,
  user: config.dbUser,
  password: config.dbPassword,
  database: config.dbDatabase,
  port: config.dbPort,
  socketPath: config.dbSocket,
  namedPlaceholders: true,
  decimalNumbers: true,
});

/// Test the connection
(async () => {
  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    console.log('Connected to MySQL database!');
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
})();

// Use the connection pool for executing queries

// Use the connection pool for executing queries
// Example:
(async () => {
  let connection: PoolConnection | null = null;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query<RowDataPacket[]>(
      'SELECT `studentId` FROM `students`',
    );
    console.log('Query results:', rows);
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    if (connection) {
      connection.release();
    }
  }
})();
