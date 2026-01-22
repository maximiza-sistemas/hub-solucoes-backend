-- =====================================================
-- MAXIMIZA - Hub de Soluções Educacionais
-- Seed Data - Migration 002
-- =====================================================

-- =====================================================
-- Insert default Municipality
-- =====================================================
INSERT INTO municipios (id, nome, estado, codigo_ibge, status)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'São Luís', 'MA', '2111300', 'ativo'),
    ('22222222-2222-2222-2222-222222222222', 'Imperatriz', 'MA', '2105302', 'ativo')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Admin User (senha: admin123)
-- Hash gerado com bcrypt - 10 rounds
-- =====================================================
INSERT INTO usuarios (id, nome, email, cpf, perfil, status, senha_hash)
VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'Administrador MAXIMIZA',
    'admin@maximiza.com',
    '000.000.000-00',
    'admin',
    'ativo',
    '$2a$10$rOVdT.G8n3H6xnR0UbLyAuoQYqPvmT1ZJwZvI1CKUqN6nkGX4ZXVK'
)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- Insert Gestor User for São Luís (senha: gestor123)
-- =====================================================
INSERT INTO usuarios (id, nome, email, cpf, perfil, municipio_id, status, senha_hash)
VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'Maria Silva',
    'gestor@saoluis.ma.gov.br',
    '111.111.111-11',
    'gestor',
    '11111111-1111-1111-1111-111111111111',
    'ativo',
    '$2a$10$rOVdT.G8n3H6xnR0UbLyAuoQYqPvmT1ZJwZvI1CKUqN6nkGX4ZXVK'
)
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- Insert Sample Solutions for São Luís
-- =====================================================
INSERT INTO solucoes (nome, descricao, categoria, municipio_id, status)
VALUES 
    ('SALF', 'Sistema de Avaliação de Leitura e Fluência', 'educacao', '11111111-1111-1111-1111-111111111111', 'ativo'),
    ('SAG', 'Sistema de Apoio à Gestão Educacional', 'educacao', '11111111-1111-1111-1111-111111111111', 'ativo'),
    ('Pensamento Computacional', 'Programa de Educação Digital', 'educacao', '11111111-1111-1111-1111-111111111111', 'ativo')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Sample Schools for São Luís
-- =====================================================
INSERT INTO escolas (nome, codigo, endereco, tipo_ensino, turno, municipio_id, status)
VALUES 
    ('Escola Municipal São João', 'ESC001', 'Rua das Flores, 123 - Centro', 'fundamental', 'matutino', '11111111-1111-1111-1111-111111111111', 'ativo'),
    ('Escola Municipal Rui Barbosa', 'ESC002', 'Av. Brasil, 456 - Cohab', 'fundamental', 'vespertino', '11111111-1111-1111-1111-111111111111', 'ativo'),
    ('CEMEI Criança Feliz', 'ESC003', 'Rua da Paz, 789 - Vinhais', 'infantil', 'integral', '11111111-1111-1111-1111-111111111111', 'ativo')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Insert Sample Students
-- =====================================================
INSERT INTO alunos (nome, matricula, serie, turma, responsavel_nome, responsavel_contato, municipio_id, status)
VALUES 
    ('João Pedro Silva', 'MAT2024001', '5º Ano', 'A', 'Ana Silva', '(98) 99999-1111', '11111111-1111-1111-1111-111111111111', 'ativo'),
    ('Maria Clara Santos', 'MAT2024002', '4º Ano', 'B', 'Carlos Santos', '(98) 99999-2222', '11111111-1111-1111-1111-111111111111', 'ativo'),
    ('Pedro Henrique Costa', 'MAT2024003', '3º Ano', 'A', 'Fernanda Costa', '(98) 99999-3333', '11111111-1111-1111-1111-111111111111', 'ativo')
ON CONFLICT DO NOTHING;

-- =====================================================
-- Success message
-- =====================================================
SELECT 'Seed data inserted successfully!' AS status;
