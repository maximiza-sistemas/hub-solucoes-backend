import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' })
        }
        req.user = user
        next()
    })
}

export function requireAdmin(req, res, next) {
    if (req.user?.perfil !== 'admin') {
        return res.status(403).json({ error: 'Acesso restrito a administradores' })
    }
    next()
}

export function requireGestorOrAdmin(req, res, next) {
    if (!['admin', 'gestor'].includes(req.user?.perfil)) {
        return res.status(403).json({ error: 'Acesso restrito a gestores e administradores' })
    }
    next()
}
