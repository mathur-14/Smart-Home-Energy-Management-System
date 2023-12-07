import { Pool } from 'pg'

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'SHEMS',
    password: 'postgres@123',
    port: 5432,
})
