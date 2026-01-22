# Hub Soluções - Backend

API REST para o Hub de Gestão de Soluções Municipais.

## 🚀 Tecnologias

- Node.js
- Express
- PostgreSQL
- JWT (autenticação)
- bcryptjs (hash de senhas)

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env` baseado no `.env.example`:

```env
PORT=3001
DATABASE_URL=postgresql://usuario:senha@localhost:5432/hub_solucoes
JWT_SECRET=sua_chave_secreta
```

## ▶️ Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📁 Estrutura

```
src/
├── db/           # Conexão e migrações do banco
├── middleware/   # Middlewares (auth, error handler)
├── routes/       # Rotas da API
└── server.js     # Entrada da aplicação
```

## 🔗 Endpoints Principais

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | /api/auth/login | Login |
| GET | /api/municipios | Listar municípios |
| GET | /api/usuarios | Listar usuários |
| GET | /api/solucoes | Listar soluções |
| GET | /api/alunos | Listar alunos |
| GET | /api/escolas | Listar escolas |
| GET | /api/dashboard/stats | Estatísticas |
