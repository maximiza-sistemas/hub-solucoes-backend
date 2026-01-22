import express from 'express'
import bcrypt from 'bcryptjs'
import { query } from '../db/index.js'

const router = express.Router()

// List all users (optionally filter by municipio)
router.get('/', async (req, res) => {
    try {
        const { municipioId } = req.query
        let sql = `
            SELECT u.*, m.nome as municipio_nome 
            FROM usuarios u 
            LEFT JOIN municipios m ON u.municipio_id = m.id
        `
        const params = []

        if (municipioId) {
            sql += ' WHERE u.municipio_id = $1'
            params.push(municipioId)
        }

        sql += ' ORDER BY u.nome'

        const result = await query(sql, params)

        const usuarios = result.rows.map(u => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            cpf: u.cpf,
            telefone: u.telefone,
            perfil: u.perfil,
            municipioId: u.municipio_id,
            municipioNome: u.municipio_nome,
            status: u.status,
            avatar: u.avatar,
            createdAt: u.created_at,
            updatedAt: u.updated_at
        }))

        res.json(usuarios)
    } catch (error) {
        console.error('Error fetching usuarios:', error)
        res.status(500).json({ error: 'Erro ao buscar usuários' })
    }
})

// Get single user
router.get('/:id', async (req, res) => {
    try {
        const result = await query(`
            SELECT u.*, m.nome as municipio_nome 
            FROM usuarios u 
            LEFT JOIN municipios m ON u.municipio_id = m.id
            WHERE u.id = $1
        `, [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        const u = result.rows[0]
        res.json({
            id: u.id,
            nome: u.nome,
            email: u.email,
            cpf: u.cpf,
            telefone: u.telefone,
            perfil: u.perfil,
            municipioId: u.municipio_id,
            municipioNome: u.municipio_nome,
            status: u.status,
            avatar: u.avatar,
            createdAt: u.created_at,
            updatedAt: u.updated_at
        })
    } catch (error) {
        console.error('Error fetching usuario:', error)
        res.status(500).json({ error: 'Erro ao buscar usuário' })
    }
})

// Create user
router.post('/', async (req, res) => {
    try {
        const { nome, email, cpf, telefone, perfil, municipioId, status = 'ativo', senha } = req.body

        if (!nome || !email) {
            return res.status(400).json({ error: 'Nome e email são obrigatórios' })
        }

        // Hash password (default: 123456)
        const senha_hash = await bcrypt.hash(senha || '123456', 10)

        const result = await query(`
            INSERT INTO usuarios (nome, email, cpf, telefone, perfil, municipio_id, status, senha_hash)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [nome, email, cpf, telefone, perfil || 'usuario', municipioId, status, senha_hash])

        const u = result.rows[0]
        res.status(201).json({
            id: u.id,
            nome: u.nome,
            email: u.email,
            cpf: u.cpf,
            telefone: u.telefone,
            perfil: u.perfil,
            municipioId: u.municipio_id,
            status: u.status,
            createdAt: u.created_at,
            updatedAt: u.updated_at
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email ou CPF já cadastrado' })
        }
        console.error('Error creating usuario:', error)
        res.status(500).json({ error: 'Erro ao criar usuário' })
    }
})

// Update user
router.put('/:id', async (req, res) => {
    try {
        const { nome, email, cpf, telefone, perfil, municipioId, status, senha } = req.body

        let sql = `
            UPDATE usuarios SET 
                nome = COALESCE($1, nome),
                email = COALESCE($2, email),
                cpf = COALESCE($3, cpf),
                telefone = COALESCE($4, telefone),
                perfil = COALESCE($5, perfil),
                municipio_id = COALESCE($6, municipio_id),
                status = COALESCE($7, status)
        `
        const params = [nome, email, cpf, telefone, perfil, municipioId, status]

        // If password is provided, update it
        if (senha) {
            const senha_hash = await bcrypt.hash(senha, 10)
            sql += `, senha_hash = $8`
            params.push(senha_hash)
        }

        sql += ` WHERE id = $${params.length + 1} RETURNING *`
        params.push(req.params.id)

        const result = await query(sql, params)

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        const u = result.rows[0]
        res.json({
            id: u.id,
            nome: u.nome,
            email: u.email,
            cpf: u.cpf,
            telefone: u.telefone,
            perfil: u.perfil,
            municipioId: u.municipio_id,
            status: u.status,
            createdAt: u.created_at,
            updatedAt: u.updated_at
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Email ou CPF já cadastrado' })
        }
        console.error('Error updating usuario:', error)
        res.status(500).json({ error: 'Erro ao atualizar usuário' })
    }
})

// Delete user
router.delete('/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' })
        }

        res.json({ message: 'Usuário excluído com sucesso' })
    } catch (error) {
        console.error('Error deleting usuario:', error)
        res.status(500).json({ error: 'Erro ao excluir usuário' })
    }
})

export default router
