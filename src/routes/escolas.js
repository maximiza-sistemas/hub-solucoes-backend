import express from 'express'
import { query } from '../db/index.js'

const router = express.Router()

// List schools (optionally filter by municipio)
router.get('/', async (req, res) => {
    try {
        const { municipioId } = req.query
        let sql = `
            SELECT e.*, 
                   (SELECT COUNT(*) FROM alunos WHERE escola_id = e.id) as total_alunos
            FROM escolas e
        `
        const params = []

        if (municipioId) {
            sql += ' WHERE e.municipio_id = $1'
            params.push(municipioId)
        }

        sql += ' ORDER BY e.nome'

        const result = await query(sql, params)

        const escolas = result.rows.map(e => ({
            id: e.id,
            nome: e.nome,
            codigo: e.codigo,
            endereco: e.endereco,
            telefone: e.telefone,
            email: e.email,
            diretor: e.diretor,
            tipoEnsino: e.tipo_ensino,
            turno: e.turno,
            totalAlunos: parseInt(e.total_alunos),
            municipioId: e.municipio_id,
            status: e.status,
            createdAt: e.created_at,
            updatedAt: e.updated_at
        }))

        res.json(escolas)
    } catch (error) {
        console.error('Error fetching escolas:', error)
        res.status(500).json({ error: 'Erro ao buscar escolas' })
    }
})

// Get single school
router.get('/:id', async (req, res) => {
    try {
        const result = await query(`
            SELECT e.*, 
                   (SELECT COUNT(*) FROM alunos WHERE escola_id = e.id) as total_alunos
            FROM escolas e
            WHERE e.id = $1
        `, [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Escola não encontrada' })
        }

        const e = result.rows[0]
        res.json({
            id: e.id,
            nome: e.nome,
            codigo: e.codigo,
            endereco: e.endereco,
            telefone: e.telefone,
            email: e.email,
            diretor: e.diretor,
            tipoEnsino: e.tipo_ensino,
            turno: e.turno,
            totalAlunos: parseInt(e.total_alunos),
            municipioId: e.municipio_id,
            status: e.status,
            createdAt: e.created_at,
            updatedAt: e.updated_at
        })
    } catch (error) {
        console.error('Error fetching escola:', error)
        res.status(500).json({ error: 'Erro ao buscar escola' })
    }
})

// Create school
router.post('/', async (req, res) => {
    try {
        const { nome, codigo, endereco, telefone, email, diretor, tipoEnsino, turno, municipioId, status = 'ativo' } = req.body

        if (!nome || !codigo || !municipioId || !tipoEnsino || !turno) {
            return res.status(400).json({ error: 'Nome, código, município, tipo de ensino e turno são obrigatórios' })
        }

        const result = await query(`
            INSERT INTO escolas (nome, codigo, endereco, telefone, email, diretor, tipo_ensino, turno, municipio_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *
        `, [nome, codigo, endereco, telefone, email, diretor, tipoEnsino, turno, municipioId, status])

        const e = result.rows[0]
        res.status(201).json({
            id: e.id,
            nome: e.nome,
            codigo: e.codigo,
            endereco: e.endereco,
            telefone: e.telefone,
            email: e.email,
            diretor: e.diretor,
            tipoEnsino: e.tipo_ensino,
            turno: e.turno,
            totalAlunos: 0,
            municipioId: e.municipio_id,
            status: e.status,
            createdAt: e.created_at,
            updatedAt: e.updated_at
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Código de escola já cadastrado' })
        }
        console.error('Error creating escola:', error)
        res.status(500).json({ error: 'Erro ao criar escola' })
    }
})

// Update school
router.put('/:id', async (req, res) => {
    try {
        const { nome, codigo, endereco, telefone, email, diretor, tipoEnsino, turno, municipioId, status } = req.body

        const result = await query(`
            UPDATE escolas SET 
                nome = COALESCE($1, nome),
                codigo = COALESCE($2, codigo),
                endereco = COALESCE($3, endereco),
                telefone = COALESCE($4, telefone),
                email = COALESCE($5, email),
                diretor = COALESCE($6, diretor),
                tipo_ensino = COALESCE($7, tipo_ensino),
                turno = COALESCE($8, turno),
                municipio_id = COALESCE($9, municipio_id),
                status = COALESCE($10, status)
            WHERE id = $11
            RETURNING *
        `, [nome, codigo, endereco, telefone, email, diretor, tipoEnsino, turno, municipioId, status, req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Escola não encontrada' })
        }

        const e = result.rows[0]
        res.json({
            id: e.id,
            nome: e.nome,
            codigo: e.codigo,
            endereco: e.endereco,
            telefone: e.telefone,
            email: e.email,
            diretor: e.diretor,
            tipoEnsino: e.tipo_ensino,
            turno: e.turno,
            municipioId: e.municipio_id,
            status: e.status,
            createdAt: e.created_at,
            updatedAt: e.updated_at
        })
    } catch (error) {
        console.error('Error updating escola:', error)
        res.status(500).json({ error: 'Erro ao atualizar escola' })
    }
})

// Delete school
router.delete('/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM escolas WHERE id = $1 RETURNING id', [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Escola não encontrada' })
        }

        res.json({ message: 'Escola excluída com sucesso' })
    } catch (error) {
        console.error('Error deleting escola:', error)
        res.status(500).json({ error: 'Erro ao excluir escola' })
    }
})

export default router
