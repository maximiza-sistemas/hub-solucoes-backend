import pg from 'pg'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const { Client } = pg

async function updatePasswords() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    })

    try {
        console.log('🔌 Connecting to database...')
        await client.connect()

        // Generate hash for 'admin123'
        const hash = await bcrypt.hash('admin123', 10)
        console.log('🔐 Hash generated:', hash.substring(0, 20) + '...')

        // Update all users with this password
        const result = await client.query(
            'UPDATE usuarios SET senha_hash = $1',
            [hash]
        )

        console.log(`✅ ${result.rowCount} user(s) updated with password 'admin123'`)

        // List users for reference
        const users = await client.query('SELECT email, perfil FROM usuarios')
        console.log('\n📋 Users available:')
        users.rows.forEach(u => {
            console.log(`  - ${u.email} (${u.perfil})`)
        })

    } catch (error) {
        console.error('❌ Error:', error.message)
    } finally {
        await client.end()
    }
}

updatePasswords()
