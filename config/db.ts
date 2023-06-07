import { config } from './config';
import { knex } from 'knex';

export const pool = knex({
    client: 'mysql2',
    connection: {
        host: config.dbHost,
        user: config.dbUser,
        password: config.dbPassword,
        database: config.dbDatabase,
        namedPlaceholders: true,
        decimalNumbers: true,
    }
});
