// const express = require('express');
// const db = require('../config/db');

// exports.createProject = (req, res) => {
//     const { usuario_id, titulo, description, link } = req.body;
//     const imagem = req.file ? `/uploads/${req.file.filename}` : null; // Caminho relativo
//     const query = 'INSERT INTO projetos (usuario_id, titulo, description, link, imagem) VALUES (?, ?, ?, ?, ?)';
//     db.query(query, [usuario_id, titulo, description, link, imagem], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Erro ao criar projeto.', err });
//         }
//         res.status(201).json({ message: 'Projeto criado com sucesso.', projectId: results.insertId });
//     });
// }


// exports.getMyProjects = (req, res) => {
//     const usuario_id = req.user.id; // Obtém o ID do usuário autenticado
//     const query = 'SELECT * FROM projetos WHERE usuario_id = ?';
//     db.query(query, [usuario_id], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Erro ao buscar projetos.' });
//         }
//         res.json(results);
//     });
// }

// exports.getProjectById = (req, res) => {
//     const projectId = req.params.id;
//     const query = 'SELECT * FROM projetos WHERE id = ?';
//     db.query(query, [projectId], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Erro ao buscar projeto.' });
//         }
//         if (results.length === 0) {
//             return res.status(404).json({ error: 'Projeto não encontrado.' });
//         }
//         res.json(results[0]);
//     });
// }

// exports.updateProject = (req, res) => {
//     const projectId = req.params.id;
//     const { titulo, description, link } = req.body;
//     const imagem = req.file ? `/uploads/${req.file.filename}` : null; // Caminho relativo
//     const query = 'UPDATE projetos SET titulo = ?, description = ?, link = ?, imagem = ? WHERE id = ?';
//     db.query(query, [titulo, description, link, imagem, projectId], (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Erro ao atualizar projeto.' });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Projeto não encontrado.' });
//         }
//         res.json({ message: 'Projeto atualizado com sucesso.' });
//     });
// }

// exports.deleteProject = (req, res) => {
//     const projectId = req.params.id;
//     const query = 'DELETE FROM projetos WHERE id = ?';
//     db.query(query, [projectId], (err, results) =>      
//     {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Erro ao deletar projeto.' });
//         }
//         if (results.affectedRows === 0) {
//             return res.status(404).json({ error: 'Projeto não encontrado.' });
//         }
//         res.json({ message: 'Projeto deletado com sucesso.' });
//     }   
// );
// }

// exports.getAllProjects = (req, res) => {
//     const query = 'SELECT * FROM projetos';
//     db.query(query, (err, results) => {
//         if (err) {
//             console.error(err);
//             return res.status(500).json({ error: 'Erro ao buscar projetos.' });
//         }
//         res.json(results);
//     });
// }

const Project = require('../models/Projeto');

exports.createProject = async (req, res) => {
  try {
    const { titulo, description, link } = req.body;
    const imagem = req.file ? `/uploads/${req.file.filename}` : null;

    const newProject = new Project({
      usuario_id: req.user.id,
      titulo,
      description,
      link,
      imagem
    });

    await newProject.save();
    res.status(201).json({ message: 'Projeto criado com sucesso.', projectId: newProject._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar projeto.' });
  }
};

exports.getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ usuario_id: req.user.id });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Projeto não encontrado.' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar projeto.' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { titulo, description, link } = req.body;
    const updateData = { titulo, description, link };
    if (req.file) updateData.imagem = `/uploads/${req.file.filename}`;

    const updated = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ error: 'Projeto não encontrado.' });

    res.json({ message: 'Projeto atualizado com sucesso.', project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar projeto.' });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Projeto não encontrado.' });
    res.json({ message: 'Projeto deletado com sucesso.' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar projeto.' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar projetos.' });
  }
};
