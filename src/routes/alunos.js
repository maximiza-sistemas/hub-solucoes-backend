import express from 'express'
import { query } from '../db/index.js'

const router = express.Router()

// List students (optionally filter by municipio)
router.get('/', async (req, res) => {
    try {
        const { municipioId } = req.query
        let sql = `
            SELECT a.*, e.nome as escola_nome 
            FROM alunos a 
            LEFT JOIN escolas e ON a.escola_id = e.id
        `
        const params = []

        if (municipioId) {
            sql += ' WHERE a.municipio_id = $1'
            params.push(municipioId)
        }

        sql += ' ORDER BY a.nome'

        const result = await query(sql, params)

        const alunos = result.rows.map(a => ({
            id: a.id,
            nome: a.nome,
            dataNascimento: a.data_nascimento,
            cpf: a.cpf,
            matricula: a.matricula,
            escolaId: a.escola_id,
            escola: a.escola_nome,
            serie: a.serie,
            turma: a.turma,
            responsavelNome: a.responsavel_nome,
            responsavelContato: a.responsavel_contato,
            municipioId: a.municipio_id,
            status: a.status,
            createdAt: a.created_at,
            updatedAt: a.updated_at
        }))

        res.json(alunos)
    } catch (error) {
        console.error('Error fetching alunos:', error)
        res.status(500).json({ error: 'Erro ao buscar alunos' })
    }
})

// Get single student
router.get('/:id', async (req, res) => {
    try {
        const result = await query(`
            SELECT a.*, e.nome as escola_nome 
            FROM alunos a 
            LEFT JOIN escolas e ON a.escola_id = e.id
            WHERE a.id = $1
        `, [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' })
        }

        const a = result.rows[0]
        res.json({
            id: a.id,
            nome: a.nome,
            dataNascimento: a.data_nascimento,
            cpf: a.cpf,
            matricula: a.matricula,
            escolaId: a.escola_id,
            escola: a.escola_nome,
            serie: a.serie,
            turma: a.turma,
            responsavelNome: a.responsavel_nome,
            responsavelContato: a.responsavel_contato,
            municipioId: a.municipio_id,
            status: a.status,
            createdAt: a.created_at,
            updatedAt: a.updated_at
        })
    } catch (error) {
        console.error('Error fetching aluno:', error)
        res.status(500).json({ error: 'Erro ao buscar aluno' })
    }
})

// Create student
router.post('/', async (req, res) => {
    try {
        const { nome, dataNascimento, cpf, matricula, escolaId, serie, turma, responsavelNome, responsavelContato, municipioId, status = 'ativo' } = req.body

        if (!nome || !matricula || !municipioId) {
            return res.status(400).json({ error: 'Nome, matrícula e município são obrigatórios' })
        }

        const result = await query(`
            INSERT INTO alunos (nome, data_nascimento, cpf, matricula, escola_id, serie, turma, responsavel_nome, responsavel_contato, municipio_id, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
        `, [nome, dataNascimento, cpf, matricula, escolaId, serie, turma, responsavelNome, responsavelContato, municipioId, status])

        const a = result.rows[0]
        res.status(201).json({
            id: a.id,
            nome: a.nome,
            dataNascimento: a.data_nascimento,
            cpf: a.cpf,
            matricula: a.matricula,
            escolaId: a.escola_id,
            serie: a.serie,
            turma: a.turma,
            responsavelNome: a.responsavel_nome,
            responsavelContato: a.responsavel_contato,
            municipioId: a.municipio_id,
            status: a.status,
            createdAt: a.created_at,
            updatedAt: a.updated_at
        })
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'Matrícula já cadastrada' })
        }
        console.error('Error creating aluno:', error)
        res.status(500).json({ error: 'Erro ao criar aluno' })
    }
})

// Update student
router.put('/:id', async (req, res) => {
    try {
        const { nome, dataNascimento, cpf, matricula, escolaId, serie, turma, responsavelNome, responsavelContato, municipioId, status } = req.body

        const result = await query(`
            UPDATE alunos SET 
                nome = COALESCE($1, nome),
                data_nascimento = COALESCE($2, data_nascimento),
                cpf = COALESCE($3, cpf),
                matricula = COALESCE($4, matricula),
                escola_id = COALESCE($5, escola_id),
                serie = COALESCE($6, serie),
                turma = COALESCE($7, turma),
                responsavel_nome = COALESCE($8, responsavel_nome),
                responsavel_contato = COALESCE($9, responsavel_contato),
                municipio_id = COALESCE($10, municipio_id),
                status = COALESCE($11, status)
            WHERE id = $12
            RETURNING *
        `, [nome, dataNascimento, cpf, matricula, escolaId, serie, turma, responsavelNome, responsavelContato, municipioId, status, req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' })
        }

        const a = result.rows[0]
        res.json({
            id: a.id,
            nome: a.nome,
            dataNascimento: a.data_nascimento,
            cpf: a.cpf,
            matricula: a.matricula,
            escolaId: a.escola_id,
            serie: a.serie,
            turma: a.turma,
            responsavelNome: a.responsavel_nome,
            responsavelContato: a.responsavel_contato,
            municipioId: a.municipio_id,
            status: a.status,
            createdAt: a.created_at,
            updatedAt: a.updated_at
        })
    } catch (error) {
        console.error('Error updating aluno:', error)
        res.status(500).json({ error: 'Erro ao atualizar aluno' })
    }
})

// Delete student
router.delete('/:id', async (req, res) => {
    try {
        const result = await query('DELETE FROM alunos WHERE id = $1 RETURNING id', [req.params.id])

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Aluno não encontrado' })
        }

        res.json({ message: 'Aluno excluído com sucesso' })
    } catch (error) {
        console.error('Error deleting aluno:', error)
        res.status(500).json({ error: 'Erro ao excluir aluno' })
    }
})

export default router
