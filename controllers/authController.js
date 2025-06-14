const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, results) =>
        {
            // Verifica se o usuário já existe
            if (err && err.code === 'ER_DUP_ENTRY') { 
                return res.status(409).json({ error: 'Usuário já existe.' });
            }
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Erro ao registrar usuário.' });
                }
            res.status(201).json({ message: 'Usuário registrado com sucesso.' });
        }
    );
}


exports.login = (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erro ao buscar usuário.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        const user = results[0];
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'password incorreta.' });
        }
        const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login bem-sucedido.', token , user});
    });
}