const express = require('express');
const cors = require('cors');
require('dotenv').config();
db = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');

// Serve os arquivos estáticos do frontend (depois do build)
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Rota fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/projetos', projectRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT;
if (!PORT) {
    console.error('A variável de ambiente PORT não está definida.');
    process.exit(1);
}

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso.');
        app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
    }
});