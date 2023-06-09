import {createPool} from "mysql2/promise";

export const pool = createPool({
    /** Database hostname */
    host: 'localhost',
    /** Database username */
    user: 'root',
    /** Database password */
    password: '',
    /** Database name */
    database: 'megak_project',
    namedPlaceholders: true,
    decimalNumbers: true,
})