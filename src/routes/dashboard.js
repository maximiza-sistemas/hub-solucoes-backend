import express from 'express'
import { query } from '../db/index.js'

const router = express.Router()

// Get dashboard stats (global or by municipio)
router.get('/stats', async (req, res) => {
    try {
        const { municipioId } = req.query
        let stats

        if (municipioId) {
            // Stats for specific municipality
            const result = await query(`
                SELECT 
                    (SELECT COUNT(*) FROM usuarios WHERE municipio_id = $1) as total_usuarios,
                    (SELECT COUNT(*) FROM alunos WHERE municipio_id = $1) as total_alunos,
                    (SELECT COUNT(*) FROM solucoes WHERE municipio_id = $1) as total_solucoes,
                    (SELECT COUNT(*) FROM escolas WHERE municipio_id = $1) as total_escolas
            `, [municipioId])

            stats = {
                totalUsuarios: parseInt(result.rows[0].total_usuarios),
                totalAlunos: parseInt(result.rows[0].total_alunos),
                totalSolucoes: parseInt(result.rows[0].total_solucoes),
                totalEscolas: parseInt(result.rows[0].total_escolas),
                crescimentoUsuarios: 12,
                crescimentoAlunos: 8
            }
        } else {
            // Global stats (admin)
            const result = await query(`
                SELECT 
                    (SELECT COUNT(*) FROM municipios) as total_municipios,
                    (SELECT COUNT(*) FROM usuarios) as total_usuarios,
                    (SELECT COUNT(*) FROM alunos) as total_alunos,
                    (SELECT COUNT(*) FROM solucoes) as total_solucoes,
                    (SELECT COUNT(*) FROM escolas) as total_escolas
            `)

            stats = {
                totalMunicipios: parseInt(result.rows[0].total_municipios),
                totalUsuarios: parseInt(result.rows[0].total_usuarios),
                totalAlunos: parseInt(result.rows[0].total_alunos),
                totalSolucoes: parseInt(result.rows[0].total_solucoes),
                totalEscolas: parseInt(result.rows[0].total_escolas),
                crescimentoUsuarios: 15,
                crescimentoAlunos: 10
            }
        }

        res.json(stats)
    } catch (error) {
        console.error('Error fetching dashboard stats:', error)
        res.status(500).json({ error: 'Erro ao buscar estatísticas' })
    }
})

// Get chart data
router.get('/charts', async (req, res) => {
    try {
        const { municipioId } = req.query

        // Get distribution by school type
        let tipoEnsinoQuery = 'SELECT tipo_ensino as name, COUNT(*) as value FROM escolas'
        const params = []

        if (municipioId) {
            tipoEnsinoQuery += ' WHERE municipio_id = $1'
            params.push(municipioId)
        }

        tipoEnsinoQuery += ' GROUP BY tipo_ensino'

        const tipoEnsinoResult = await query(tipoEnsinoQuery, params)

        // Get distribution by status
        let statusQuery = 'SELECT status as name, COUNT(*) as value FROM alunos'

        if (municipioId) {
            statusQuery += ' WHERE municipio_id = $1'
        }

        statusQuery += ' GROUP BY status'

        const statusResult = await query(statusQuery, params)

        res.json({
            tipoEnsino: tipoEnsinoResult.rows.map(r => ({
                name: r.name,
                value: parseInt(r.value)
            })),
            statusAlunos: statusResult.rows.map(r => ({
                name: r.name === 'ativo' ? 'Ativos' : 'Inativos',
                value: parseInt(r.value)
            }))
        })
    } catch (error) {
        console.error('Error fetching chart data:', error)
        res.status(500).json({ error: 'Erro ao buscar dados dos gráficos' })
    }
})

export default router
