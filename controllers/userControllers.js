const User = require('../models/User');

// Pegar dados do usuário autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // esconde senha
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar perfil.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { username, email } = req.body;

    // Verifica se o e-mail já está em uso por outro usuário
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user.id) {
      return res.status(400).json({ error: 'Email já está em uso por outro usuário.' });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true }
    ).select('-password');

    if (!updated) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json({ message: 'Perfil atualizado.', user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar perfil.' });
  }
};


// Atualizar avatar
exports.updateAvatar = async (req, res) => {
  try {
    const avatarPath = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarPath },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json({ message: 'Avatar atualizado.', user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar avatar.' });
  }
};
