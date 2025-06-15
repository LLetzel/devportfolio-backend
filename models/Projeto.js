const mongoose = require('mongoose');

const projetoSchema = new mongoose.Schema({
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  titulo: { type: String, required: true },
  description: { type: String },
  imagem: { type: String },
  link: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Projeto', projetoSchema);
