import { v4 as uuidv4 } from 'uuid'

// In-memory database (replace with real DB in production)
const db = {
    municipios: [
        {
            id: '1',
            nome: 'São Paulo',
            estado: 'SP',
            codigoIBGE: '3550308',
            status: 'ativo',
            createdAt: '2024-01-15T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
        },
        {
            id: '2',
            nome: 'Rio de Janeiro',
            estado: 'RJ',
            codigoIBGE: '3304557',
            status: 'ativo',
            createdAt: '2024-01-20T00:00:00.000Z',
            updatedAt: '2024-01-20T00:00:00.000Z',
        },
        {
            id: '3',
            nome: 'Belo Horizonte',
            estado: 'MG',
            codigoIBGE: '3106200',
            status: 'ativo',
            createdAt: '2024-02-01T00:00:00.000Z',
            updatedAt: '2024-02-01T00:00:00.000Z',
        },
        {
            id: '4',
            nome: 'Salvador',
            estado: 'BA',
            codigoIBGE: '2927408',
            status: 'inativo',
            createdAt: '2024-02-10T00:00:00.000Z',
            updatedAt: '2024-02-10T00:00:00.000Z',
        },
    ],

    solucoes: [
        {
            id: '1',
            nome: 'Portal Educacional',
            descricao: 'Sistema de gestão escolar completo',
            categoria: 'educacao',
            url: 'https://portal.edu.gov.br',
            status: 'ativo',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
            id: '2',
            nome: 'Saúde Digital',
            descricao: 'Prontuário eletrônico e agendamento',
            categoria: 'saude',
            url: 'https://saude.gov.br',
            status: 'ativo',
            createdAt: '2024-01-05T00:00:00.000Z',
            updatedAt: '2024-01-05T00:00:00.000Z',
        },
        {
            id: '3',
            nome: 'Gestão Financeira',
            descricao: 'Controle orçamentário municipal',
            categoria: 'financeiro',
            url: 'https://financas.gov.br',
            status: 'ativo',
            createdAt: '2024-01-10T00:00:00.000Z',
            updatedAt: '2024-01-10T00:00:00.000Z',
        },
        {
            id: '4',
            nome: 'Assistência Social',
            descricao: 'Cadastro e acompanhamento de beneficiários',
            categoria: 'social',
            url: 'https://social.gov.br',
            status: 'ativo',
            createdAt: '2024-01-15T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
        },
    ],

    usuarios: [
        {
            id: '1',
            nome: 'Administrador Sistema',
            email: 'admin@hubmunicipal.gov.br',
            senha: '$2a$10$6gZ0.LvP0N1Q5x5Q5x5Q5u', // 123456
            cpf: '111.222.333-44',
            perfil: 'admin',
            status: 'ativo',
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z',
        },
        {
            id: '2',
            nome: 'Maria Silva',
            email: 'gestor@sp.gov.br',
            senha: '$2a$10$6gZ0.LvP0N1Q5x5Q5x5Q5u',
            cpf: '222.333.444-55',
            telefone: '(11) 99999-8888',
            perfil: 'gestor',
            municipioId: '1',
            status: 'ativo',
            createdAt: '2024-01-15T00:00:00.000Z',
            updatedAt: '2024-01-15T00:00:00.000Z',
        },
        {
            id: '3',
            nome: 'João Santos',
            email: 'usuario@sp.gov.br',
            senha: '$2a$10$6gZ0.LvP0N1Q5x5Q5x5Q5u',
            cpf: '333.444.555-66',
            telefone: '(21) 98888-7777',
            perfil: 'usuario',
            municipioId: '1',
            status: 'ativo',
            createdAt: '2024-01-20T00:00:00.000Z',
            updatedAt: '2024-01-20T00:00:00.000Z',
        },
    ],

    alunos: [
        {
            id: '1',
            nome: 'Pedro Oliveira',
            dataNascimento: '2010-05-15',
            matricula: 'SP2024001',
            escola: 'EMEF Maria Montessori',
            serie: '5º Ano',
            turma: 'A',
            responsavelNome: 'Ana Oliveira',
            responsavelContato: '(11) 98765-4321',
            municipioId: '1',
            status: 'ativo',
            createdAt: '2024-02-01T00:00:00.000Z',
            updatedAt: '2024-02-01T00:00:00.000Z',
        },
        {
            id: '2',
            nome: 'Julia Costa',
            dataNascimento: '2011-08-22',
            matricula: 'SP2024002',
            escola: 'EMEF Paulo Freire',
            serie: '4º Ano',
            turma: 'B',
            responsavelNome: 'Carlos Costa',
            responsavelContato: '(11) 91234-5678',
            municipioId: '1',
            status: 'ativo',
            createdAt: '2024-02-01T00:00:00.000Z',
            updatedAt: '2024-02-01T00:00:00.000Z',
        },
    ],

    municipioSolucoes: [
        { id: '1', municipioId: '1', solucaoId: '1', dataVinculo: '2024-01-15T00:00:00.000Z' },
        { id: '2', municipioId: '1', solucaoId: '2', dataVinculo: '2024-01-15T00:00:00.000Z' },
        { id: '3', municipioId: '1', solucaoId: '3', dataVinculo: '2024-01-15T00:00:00.000Z' },
        { id: '4', municipioId: '2', solucaoId: '1', dataVinculo: '2024-01-20T00:00:00.000Z' },
        { id: '5', municipioId: '2', solucaoId: '4', dataVinculo: '2024-01-20T00:00:00.000Z' },
    ],
}

// Helper functions
export function generateId() {
    return uuidv4()
}

export function now() {
    return new Date().toISOString()
}

// Municipios
export function getAllMunicipios() {
    return db.municipios.map(m => ({
        ...m,
        totalUsuarios: db.usuarios.filter(u => u.municipioId === m.id).length,
        totalAlunos: db.alunos.filter(a => a.municipioId === m.id).length,
        totalSolucoes: db.municipioSolucoes.filter(ms => ms.municipioId === m.id).length,
    }))
}

export function getMunicipioById(id) {
    const municipio = db.municipios.find(m => m.id === id)
    if (!municipio) return null

    return {
        ...municipio,
        totalUsuarios: db.usuarios.filter(u => u.municipioId === id).length,
        totalAlunos: db.alunos.filter(a => a.municipioId === id).length,
        totalSolucoes: db.municipioSolucoes.filter(ms => ms.municipioId === id).length,
    }
}

export function createMunicipio(data) {
    const municipio = {
        id: generateId(),
        ...data,
        createdAt: now(),
        updatedAt: now(),
    }
    db.municipios.push(municipio)
    return municipio
}

export function updateMunicipio(id, data) {
    const index = db.municipios.findIndex(m => m.id === id)
    if (index === -1) return null

    db.municipios[index] = {
        ...db.municipios[index],
        ...data,
        updatedAt: now(),
    }
    return db.municipios[index]
}

export function deleteMunicipio(id) {
    const index = db.municipios.findIndex(m => m.id === id)
    if (index === -1) return false

    db.municipios.splice(index, 1)
    return true
}

// Soluções
export function getAllSolucoes() {
    return db.solucoes
}

export function getSolucaoById(id) {
    return db.solucoes.find(s => s.id === id)
}

export function createSolucao(data) {
    const solucao = {
        id: generateId(),
        ...data,
        createdAt: now(),
        updatedAt: now(),
    }
    db.solucoes.push(solucao)
    return solucao
}

export function updateSolucao(id, data) {
    const index = db.solucoes.findIndex(s => s.id === id)
    if (index === -1) return null

    db.solucoes[index] = {
        ...db.solucoes[index],
        ...data,
        updatedAt: now(),
    }
    return db.solucoes[index]
}

export function deleteSolucao(id) {
    const index = db.solucoes.findIndex(s => s.id === id)
    if (index === -1) return false

    db.solucoes.splice(index, 1)
    return true
}

export function getSolucoesByMunicipio(municipioId) {
    const vinculoIds = db.municipioSolucoes
        .filter(ms => ms.municipioId === municipioId)
        .map(ms => ms.solucaoId)
    return db.solucoes.filter(s => vinculoIds.includes(s.id))
}

export function vincularSolucao(municipioId, solucaoId) {
    const exists = db.municipioSolucoes.find(
        ms => ms.municipioId === municipioId && ms.solucaoId === solucaoId
    )
    if (exists) return null

    const vinculo = {
        id: generateId(),
        municipioId,
        solucaoId,
        dataVinculo: now(),
    }
    db.municipioSolucoes.push(vinculo)
    return vinculo
}

export function desvincularSolucao(municipioId, solucaoId) {
    const index = db.municipioSolucoes.findIndex(
        ms => ms.municipioId === municipioId && ms.solucaoId === solucaoId
    )
    if (index === -1) return false

    db.municipioSolucoes.splice(index, 1)
    return true
}

// Usuários
export function getAllUsuarios() {
    return db.usuarios.map(({ senha, ...user }) => user)
}

export function getUsuarioById(id) {
    const user = db.usuarios.find(u => u.id === id)
    if (!user) return null
    const { senha, ...userWithoutPassword } = user
    return userWithoutPassword
}

export function getUsuarioByEmail(email) {
    return db.usuarios.find(u => u.email === email)
}

export function createUsuario(data) {
    const usuario = {
        id: generateId(),
        ...data,
        createdAt: now(),
        updatedAt: now(),
    }
    db.usuarios.push(usuario)
    const { senha, ...userWithoutPassword } = usuario
    return userWithoutPassword
}

export function updateUsuario(id, data) {
    const index = db.usuarios.findIndex(u => u.id === id)
    if (index === -1) return null

    db.usuarios[index] = {
        ...db.usuarios[index],
        ...data,
        updatedAt: now(),
    }
    const { senha, ...userWithoutPassword } = db.usuarios[index]
    return userWithoutPassword
}

export function deleteUsuario(id) {
    const index = db.usuarios.findIndex(u => u.id === id)
    if (index === -1) return false

    db.usuarios.splice(index, 1)
    return true
}

// Alunos
export function getAllAlunos(municipioId = null) {
    if (municipioId) {
        return db.alunos.filter(a => a.municipioId === municipioId)
    }
    return db.alunos
}

export function getAlunoById(id) {
    return db.alunos.find(a => a.id === id)
}

export function createAluno(data) {
    const aluno = {
        id: generateId(),
        ...data,
        createdAt: now(),
        updatedAt: now(),
    }
    db.alunos.push(aluno)
    return aluno
}

export function updateAluno(id, data) {
    const index = db.alunos.findIndex(a => a.id === id)
    if (index === -1) return null

    db.alunos[index] = {
        ...db.alunos[index],
        ...data,
        updatedAt: now(),
    }
    return db.alunos[index]
}

export function deleteAluno(id) {
    const index = db.alunos.findIndex(a => a.id === id)
    if (index === -1) return false

    db.alunos.splice(index, 1)
    return true
}

export function importAlunos(alunosData, municipioId) {
    const now_ = now()
    const imported = alunosData.map(data => ({
        id: generateId(),
        ...data,
        municipioId,
        status: 'ativo',
        createdAt: now_,
        updatedAt: now_,
    }))
    db.alunos.push(...imported)
    return imported
}

// Dashboard stats
export function getAdminStats() {
    return {
        totalMunicipios: db.municipios.filter(m => m.status === 'ativo').length,
        totalUsuarios: db.usuarios.filter(u => u.status === 'ativo').length,
        totalSolucoes: db.solucoes.filter(s => s.status === 'ativo').length,
        totalAlunos: db.alunos.filter(a => a.status === 'ativo').length,
    }
}

export function getMunicipioStats(municipioId) {
    return {
        totalUsuarios: db.usuarios.filter(u => u.municipioId === municipioId && u.status === 'ativo').length,
        totalAlunos: db.alunos.filter(a => a.municipioId === municipioId && a.status === 'ativo').length,
        totalSolucoes: db.municipioSolucoes.filter(ms => ms.municipioId === municipioId).length,
    }
}
