
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose'); // ✅ Importa mongoose
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/projetos', projectRoutes);
app.use('/api/user', userRoutes);

// // Servir frontend (se necessário)
// const path = require('path');
// app.use(express.static(path.join(__dirname, '../frontend/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('A variável MONGODB_URI não está definida no .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado ao MongoDB Atlas');
    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erro ao conectar ao MongoDB:', err);
  });

// db.connect((err) => {
//   if (err) {
//     console.error('Erro ao conectar ao banco de dados:', err);
//     return;
//   }
//   console.log('Conexão com o banco de dados estabelecida com sucesso.');
//   app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
// });
