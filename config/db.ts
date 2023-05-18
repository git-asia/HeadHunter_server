import {createPool} from "mysql2/promise";
import { config } from "./config";

export const pool = createPool({
    host: 'containers-us-west-131.railway.app',
    user: 'root',
    password: 'po61hpY7GoW0IgXTv3gm',
    database: super2,
    port: 5769,
})
