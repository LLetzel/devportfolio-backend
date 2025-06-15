const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Rotas da API (vem antes do frontend)
app.use('/api/auth', authRoutes);
app.use('/api/projetos', projectRoutes);
app.use('/api/user', userRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Fallback SPA (depois das rotas da API)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT;
if (!PORT) {
  console.error('A variável de ambiente PORT não está definida.');
  process.exit(1);
}

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso.');
  app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
});
