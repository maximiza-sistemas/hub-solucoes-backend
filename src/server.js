import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Database
import { testConnection } from './db/index.js'

// Routes
import authRoutes from './routes/auth.js'
import municipiosRoutes from './routes/municipios.js'
import solucoesRoutes from './routes/solucoes.js'
import usuariosRoutes from './routes/usuarios.js'
import alunosRoutes from './routes/alunos.js'
import escolasRoutes from './routes/escolas.js'
import dashboardRoutes from './routes/dashboard.js'

// Middleware
import { errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/municipios', municipiosRoutes)
app.use('/api/solucoes', solucoesRoutes)
app.use('/api/usuarios', usuariosRoutes)
app.use('/api/alunos', alunosRoutes)
app.use('/api/escolas', escolasRoutes)
app.use('/api/dashboard', dashboardRoutes)

// Health check
app.get('/api/health', async (req, res) => {
    const dbOk = await testConnection()
    res.json({
        status: 'ok',
        database: dbOk ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    })
})

// Error handling
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint não encontrado' })
})

app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`📚 API docs: http://localhost:${PORT}/api/health`)
    await testConnection()
})
