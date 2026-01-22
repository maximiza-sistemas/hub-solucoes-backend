import express from 'express'
import { query } from '../db/index.js'

const router = express.Router()

// List solutions (optionally filter by municipio)
router.get('/', async (req, res) => {
    try {
        const { municipioId } = req.query
        let sql = 'SELECT * FROM solucoes'
        const params = []

        if (municipioId) {
            sql += ' WHERE municipio_id = $1'
            params.push(municipioId)
        }

        sql += ' ORDER BY nome'

        const result = await query(sql, params)

        const solucoes = result.rows.map(s => ({
            id: s.id,
            nome: s.nome,
            descricao: s.descricao,
            categoria: s.categoria,
            url: s.url,
            icone: s.icone,
            municipioId: s.municipio_id,
            status: s.status,
            createdAt: s.created_at,
            updatedAt: s.updated_at
        }))

        res.json(solucoes)
    } catch (error) {
        console.error('Error fetching solucoes:', error)
        res.status(500).json({ error: 'Erro ao buscar soluções' })
    }
})

// Get single solution
router.get('/:id', async (req, res) => {
    try {
        const result = await query('SELECT * FROM solucoes WHERE id = $1', [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solução não encontrada' })
        }

        const s = result.rows[0]
        res.json({
            id: s.id,
            nome: s.nome,
            descricao: s.descricao,
            categoria: s.categoria,
            url: s.url,
            icone: s.icone,
            municipioId: s.municipio_id,
            status: s.status,
            createdAt: s.created_at,
            updatedAt: s.updated_at
        })
    } catch (error) {
        console.error('Error fetching solucao:', error)
        res.status(500).json({ error: 'Erro ao buscar solução' })
    }
})

// Create solution
router.post('/', async (req, res) => {
    try {
        const { nome, descricao, categoria, url, icone, municipioId, status = 'ativo' } = req.body

        if (!nome) {
            return res.status(400).json({ error: 'Nome é obrigatório' })
        }

        const result = await query(`
            INSERT INTO solucoes (nome, descricao, categoria, url, icone, municipio_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
        `, [nome, descricao, categoria, url, icone, municipioId, status])

        const s = result.rows[0]
        res.status(201).json({
            id: s.id,
            nome: s.nome,
            descricao: s.descricao,
            categoria: s.categoria,
            url: s.url,
            icone: s.icone,
            municipioId: s.municipio_id,
            status: s.status,
            createdAt: s.created_at,
            updatedAt: s.updated_at
        })
    } catch (error) {
        console.error('Error creating solucao:', error)
        res.status(500).json({ error: 'Erro ao criar solução' })
    }
})

// Update solution
router.put('/:id', async (req, res) => {
    try {
        const { nome, descricao, categoria, url, icone, municipioId, status } = req.body

        const result = await query(`
            UPDATE solucoes SET 
                nome = COALESCE($1, nome),
                descricao = COALESCE($2, descricao),
                categoria = COALESCE($3, categoria),
                url = COALESCE($4, url),
                icone = COALESCE($5, icone),
                municipio_id = COALESCE($6, municipio_id),
                status = COALESCE($7, status)
            WHERE id = $8
            RETURNING *
        `, [nome, descricao, categoria, url, icone, municipioId, status, req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solução não encontrada' })
        }

        const s = result.rows[0]
        res.json({
            id: s.id,
            nome: s.nome,
            descricao: s.descricao,
            categoria: s.categoria,
            url: s.url,
            icone: s.icone,
            municipioId: s.municipio_id,
            status: s.status,
            createdAt: s.created_at,
            updatedAt: s.updated_at
        })
    } catch (error) {
        console.error('Error updating solucao:', error)
        res.status(500).json({ error: 'Erro ao atualizar solução' })
    }
})

// Delete solution
router.delete('/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM solucoes WHERE id = $1 RETURNING id', [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Solução não encontrada' })
        }

        res.json({ message: 'Solução excluída com sucesso' })
    } catch (error) {
        console.error('Error deleting solucao:', error)
        res.status(500).json({ error: 'Erro ao excluir solução' })
    }
})

export default router
