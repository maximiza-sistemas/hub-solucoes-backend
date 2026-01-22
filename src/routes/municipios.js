import express from 'express'
import { query } from '../db/index.js'

const router = express.Router()

// List all municipalities
router.get('/', async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                m.*,
                (SELECT COUNT(*) FROM usuarios WHERE municipio_id = m.id) as total_usuarios,
                (SELECT COUNT(*) FROM alunos WHERE municipio_id = m.id) as total_alunos,
                (SELECT COUNT(*) FROM solucoes WHERE municipio_id = m.id) as total_solucoes
            FROM municipios m
            ORDER BY m.nome
        `)

        const municipios = result.rows.map(m => ({
            id: m.id,
            nome: m.nome,
            estado: m.estado,
            codigoIBGE: m.codigo_ibge,
            logo: m.logo,
            status: m.status,
            totalUsuarios: parseInt(m.total_usuarios),
            totalAlunos: parseInt(m.total_alunos),
            totalSolucoes: parseInt(m.total_solucoes),
            createdAt: m.created_at,
            updatedAt: m.updated_at
        }))

        res.json(municipios)
    } catch (error) {
        console.error('Error fetching municipios:', error)
        res.status(500).json({ error: 'Erro ao buscar municípios' })
    }
})

// Get single municipality
router.get('/:id', async (req, res) => {
    try {
        const result = await query(`
            SELECT 
                m.*,
                (SELECT COUNT(*) FROM usuarios WHERE municipio_id = m.id) as total_usuarios,
                (SELECT COUNT(*) FROM alunos WHERE municipio_id = m.id) as total_alunos,
                (SELECT COUNT(*) FROM solucoes WHERE municipio_id = m.id) as total_solucoes
            FROM municipios m
            WHERE m.id = $1
        `, [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Município não encontrado' })
        }

        const m = result.rows[0]
        res.json({
            id: m.id,
            nome: m.nome,
            estado: m.estado,
            codigoIBGE: m.codigo_ibge,
            logo: m.logo,
            status: m.status,
            totalUsuarios: parseInt(m.total_usuarios),
            totalAlunos: parseInt(m.total_alunos),
            totalSolucoes: parseInt(m.total_solucoes),
            createdAt: m.created_at,
            updatedAt: m.updated_at
        })
    } catch (error) {
        console.error('Error fetching municipio:', error)
        res.status(500).json({ error: 'Erro ao buscar município' })
    }
})

// Create municipality
router.post('/', async (req, res) => {
    try {
        const { nome, estado, codigoIBGE, logo, status = 'ativo' } = req.body

        if (!nome || !estado) {
            return res.status(400).json({ error: 'Nome e estado são obrigatórios' })
        }

        const result = await query(`
            INSERT INTO municipios (nome, estado, codigo_ibge, logo, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [nome, estado, codigoIBGE, logo, status])

        const m = result.rows[0]
        res.status(201).json({
            id: m.id,
            nome: m.nome,
            estado: m.estado,
            codigoIBGE: m.codigo_ibge,
            logo: m.logo,
            status: m.status,
            totalUsuarios: 0,
            totalAlunos: 0,
            totalSolucoes: 0,
            createdAt: m.created_at,
            updatedAt: m.updated_at
        })
    } catch (error) {
        console.error('Error creating municipio:', error)
        res.status(500).json({ error: 'Erro ao criar município' })
    }
})

// Update municipality
router.put('/:id', async (req, res) => {
    try {
        const { nome, estado, codigoIBGE, logo, status } = req.body

        const result = await query(`
            UPDATE municipios 
            SET nome = COALESCE($1, nome),
                estado = COALESCE($2, estado),
                codigo_ibge = COALESCE($3, codigo_ibge),
                logo = COALESCE($4, logo),
                status = COALESCE($5, status)
            WHERE id = $6
            RETURNING *
        `, [nome, estado, codigoIBGE, logo, status, req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Município não encontrado' })
        }

        const m = result.rows[0]
        res.json({
            id: m.id,
            nome: m.nome,
            estado: m.estado,
            codigoIBGE: m.codigo_ibge,
            logo: m.logo,
            status: m.status,
            createdAt: m.created_at,
            updatedAt: m.updated_at
        })
    } catch (error) {
        console.error('Error updating municipio:', error)
        res.status(500).json({ error: 'Erro ao atualizar município' })
    }
})

// Delete municipality
router.delete('/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM municipios WHERE id = $1 RETURNING id', [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Município não encontrado' })
        }

        res.json({ message: 'Município excluído com sucesso' })
    } catch (error) {
        console.error('Error deleting municipio:', error)
        res.status(500).json({ error: 'Erro ao excluir município' })
    }
})

export default router
