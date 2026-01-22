import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigrations() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    })

    try {
        console.log('🔌 Connecting to database...')
        await client.connect()
        console.log('✅ Connected successfully!')

        const migrationsPath = join(__dirname, 'migrations')

        // Run schema migration
        console.log('\n📦 Running 001_create_tables.sql...')
        const schemaSql = readFileSync(join(migrationsPath, '001_create_tables.sql'), 'utf8')
        await client.query(schemaSql)
        console.log('✅ Schema created!')

        // Run seed migration
        console.log('\n🌱 Running 002_seed_data.sql...')
        const seedSql = readFileSync(join(migrationsPath, '002_seed_data.sql'), 'utf8')
        await client.query(seedSql)
        console.log('✅ Seed data inserted!')

        // Verify tables
        console.log('\n📊 Verifying tables...')
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name
        `)
        console.log('Tables created:', tables.rows.map(r => r.table_name).join(', '))

        // Count records
        const counts = await client.query(`
            SELECT 
                (SELECT COUNT(*) FROM municipios) as municipios,
                (SELECT COUNT(*) FROM usuarios) as usuarios,
                (SELECT COUNT(*) FROM solucoes) as solucoes,
                (SELECT COUNT(*) FROM escolas) as escolas,
                (SELECT COUNT(*) FROM alunos) as alunos
        `)
        console.log('\n📈 Record counts:')
        console.log(counts.rows[0])

        console.log('\n🎉 Migrations completed successfully!')

    } catch (error) {
        console.error('❌ Migration failed:', error.message)
        process.exit(1)
    } finally {
        await client.end()
    }
}

runMigrations()
