const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors());  // Permite solicitudes desde el frontend
app.use(express.json());  // Para parsear JSON

// Conexión a MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0993643838Jc',
    database: process.env.DB_NAME || 'tickets_db',
    port: process.env.DB_PORT || 3306
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ error: 'No se proporcionó token' });

    // Si el token viene como "Bearer <token>", extraerlo
    const tokenString = token.startsWith('Bearer ') ? token.slice(7) : token;

    jwt.verify(tokenString, process.env.JWT_SECRET || 'secret', (err, decoded) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });
        req.adminId = decoded.id;
        next();
    });
};

// Crear ticket (público)
app.post('/api/tickets', (req, res) => {
    const { code, name, last, address, position, email, phone, requestType, otherRequest, description, fileName, observations } = req.body;
    db.query(
        'INSERT INTO tickets (code, name, last, address, position, email, phone, requestType, otherRequest, description, fileName, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [code, name, last, address, position, email, phone, requestType, otherRequest, description, fileName, observations],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: result.insertId });
        }
    );
});

// Obtener tickets (público para pruebas)
app.get('/api/tickets', (req, res) => {
    db.query('SELECT * FROM tickets ORDER BY createdAt DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Eliminar ticket (protegido)
app.delete('/api/tickets/:code', verifyToken, (req, res) => {
    const { code } = req.params;
    db.query('DELETE FROM tickets WHERE code = ?', [code], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Ticket eliminado' });
    });
});

// Borrar todos los tickets (protegido)
app.delete('/api/tickets', verifyToken, (req, res) => {
    db.query('DELETE FROM tickets', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Todos los tickets eliminados' });
    });
});

app.listen(3000, () => console.log('Servidor corriendo en http://localhost:3000'));