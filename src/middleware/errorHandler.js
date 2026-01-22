export function errorHandler(err, req, res, next) {
    console.error('Error:', err)

    if (err.type === 'validation') {
        return res.status(400).json({
            error: 'Erro de validação',
            details: err.errors,
        })
    }

    if (err.type === 'not_found') {
        return res.status(404).json({
            error: err.message || 'Recurso não encontrado',
        })
    }

    if (err.type === 'unauthorized') {
        return res.status(401).json({
            error: err.message || 'Não autorizado',
        })
    }

    if (err.type === 'forbidden') {
        return res.status(403).json({
            error: err.message || 'Acesso negado',
        })
    }

    res.status(500).json({
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
}
