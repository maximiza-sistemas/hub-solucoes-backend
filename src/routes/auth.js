import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db/index.js'

const router = express.Router()

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body

        if (!email || !senha) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' })
        }

        // Find user by email
        const result = await query(
            `SELECT u.*, m.nome as municipio_nome 
             FROM usuarios u 
             LEFT JOIN municipios m ON u.municipio_id = m.id 
             WHERE u.email = $1 AND u.status = 'ativo'`,
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        const user = result.rows[0]

        // Verify password
        const isValidPassword = await bcrypt.compare(senha, user.senha_hash)
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credenciais inválidas' })
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, perfil: user.perfil },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        )

        // Return user data (without password)
        res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                cpf: user.cpf,
                telefone: user.telefone,
                perfil: user.perfil,
                municipioId: user.municipio_id,
                municipioNome: user.municipio_nome,
                status: user.status,
                avatar: user.avatar,
                createdAt: user.created_at,
                updatedAt: user.updated_at
            }
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

// Get current user
router.get('/me', async (req, res) => {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' })
        }

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const result = await query(
            `SELECT u.*, m.nome as municipio_nome 
             FROM usuarios u 
             LEFT JOIN municipios m ON u.municipio_id = m.id 
             WHERE u.id = $1`,
            [decoded.id]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        const user = result.rows[0]
        res.json({
            id: user.id,
            nome: user.nome,
            email: user.email,
            cpf: user.cpf,
            telefone: user.telefone,
            perfil: user.perfil,
            municipioId: user.municipio_id,
            municipioNome: user.municipio_nome,
            status: user.status,
            avatar: user.avatar,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        })
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' })
        }
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
})

export default router
