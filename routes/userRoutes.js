const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const upload = require('../middlewares/upload');
const db = require('../config/db');

// Atualizar avatar do usuário autenticado
router.put('/me/avatar', auth, upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nenhuma imagem enviada.' });
  const avatarPath = `/uploads/${req.file.filename}`;
  db.query('UPDATE users SET avatar = ? WHERE id = ?', [avatarPath, req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao atualizar avatar.' });
    res.json({ message: 'Avatar atualizado com sucesso.', avatar: avatarPath });
  });
});

// Buscar dados do usuário autenticado
router.get('/me', auth, (req, res) => {
  db.query('SELECT id, username, email, avatar FROM users WHERE id = ?', [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar usuário.' });
    if (!results.length) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(results[0]);
  });
});

router.delete('/me/avatar', auth, (req, res) => {
  db.query('UPDATE users SET avatar = NULL WHERE id = ?', [req.user.id], (err) => {
    if (err) return res.status(500).json({ error: 'Erro ao remover avatar.' });
    res.json({ message: 'Avatar removido com sucesso.' });
  });
});

module.exports = router;