-- =====================================================
-- MAXIMIZA - Hub de Soluções Educacionais
-- Schema PostgreSQL - Migration 001
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Table: municipios
-- =====================================================
CREATE TABLE IF NOT EXISTS municipios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    estado VARCHAR(2) NOT NULL,
    codigo_ibge VARCHAR(10),
    logo TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    cpf VARCHAR(14) UNIQUE,
    telefone VARCHAR(20),
    perfil VARCHAR(20) NOT NULL DEFAULT 'usuario' CHECK (perfil IN ('admin', 'gestor', 'usuario')),
    municipio_id UUID REFERENCES municipios(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    senha_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: solucoes
-- =====================================================
CREATE TABLE IF NOT EXISTS solucoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    categoria VARCHAR(50) CHECK (categoria IN ('educacao', 'saude', 'financeiro', 'administrativo', 'social', 'outros')),
    url TEXT,
    icone VARCHAR(100),
    municipio_id UUID REFERENCES municipios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- Table: escolas
-- =====================================================
CREATE TABLE IF NOT EXISTS escolas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    endereco TEXT,
    telefone VARCHAR(20),
    email VARCHAR(255),
    diretor VARCHAR(255),
    tipo_ensino VARCHAR(30) NOT NULL CHECK (tipo_ensino IN ('infantil', 'fundamental', 'medio', 'integral')),
    turno VARCHAR(20) NOT NULL CHECK (turno IN ('matutino', 'vespertino', 'noturno', 'integral')),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(codigo, municipio_id)
);

-- =====================================================
-- Table: alunos
-- =====================================================
CREATE TABLE IF NOT EXISTS alunos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    data_nascimento DATE,
    cpf VARCHAR(14),
    matricula VARCHAR(50) NOT NULL,
    escola_id UUID REFERENCES escolas(id) ON DELETE SET NULL,
    serie VARCHAR(50),
    turma VARCHAR(50),
    responsavel_nome VARCHAR(255),
    responsavel_contato VARCHAR(100),
    municipio_id UUID NOT NULL REFERENCES municipios(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(matricula, municipio_id)
);

-- =====================================================
-- Indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_usuarios_municipio ON usuarios(municipio_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_solucoes_municipio ON solucoes(municipio_id);
CREATE INDEX IF NOT EXISTS idx_escolas_municipio ON escolas(municipio_id);
CREATE INDEX IF NOT EXISTS idx_alunos_municipio ON alunos(municipio_id);
CREATE INDEX IF NOT EXISTS idx_alunos_escola ON alunos(escola_id);

-- =====================================================
-- Function to update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- =====================================================
-- Triggers for updated_at
-- =====================================================
DROP TRIGGER IF EXISTS update_municipios_updated_at ON municipios;
CREATE TRIGGER update_municipios_updated_at
    BEFORE UPDATE ON municipios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_usuarios_updated_at ON usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON usuarios
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_solucoes_updated_at ON solucoes;
CREATE TRIGGER update_solucoes_updated_at
    BEFORE UPDATE ON solucoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_escolas_updated_at ON escolas;
CREATE TRIGGER update_escolas_updated_at
    BEFORE UPDATE ON escolas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_alunos_updated_at ON alunos;
CREATE TRIGGER update_alunos_updated_at
    BEFORE UPDATE ON alunos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- Success message
-- =====================================================
SELECT 'Schema created successfully!' AS status;
