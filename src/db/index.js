import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

// PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
})

// Test connection on startup
pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL database')
})

pool.on('error', (err) => {
    console.error('❌ Unexpected error on idle client', err)
    process.exit(-1)
})

// Query helper with logging
export async function query(text, params) {
    const start = Date.now()
    try {
        const res = await pool.query(text, params)
        const duration = Date.now() - start
        if (process.env.NODE_ENV !== 'production') {
            console.log('📊 Query executed', { text: text.substring(0, 50), duration, rows: res.rowCount })
        }
        return res
    } catch (error) {
        console.error('❌ Query error:', error.message)
        throw error
    }
}

// Get a client for transactions
export async function getClient() {
    const client = await pool.connect()
    return client
}

// Test database connection
export async function testConnection() {
    try {
        const res = await query('SELECT NOW()')
        console.log('✅ Database connection successful:', res.rows[0].now)
        return true
    } catch (error) {
        console.error('❌ Database connection failed:', error.message)
        return false
    }
}

export default pool
