import {createPool} from "mysql2/promise";

export const pool = createPool({
    /** Database hostname */
    host: 'localhost',
    /** Database username */
    user: '',
    /** Database password */
    password: '',
    /** Database name */
    database: '',
    namedPlaceholders: true,
    decimalNumbers: true,
})