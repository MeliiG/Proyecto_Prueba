// routes.js
const express = require('express');
const router = express.Router();
const db = require('./db');
const jwt = require('jsonwebtoken');

const jwtSecret = 'prueba123#*';

// Ruta para registrar un cliente
app.post('/clientes', (req, res) => {
    //Logica para registrar un cliente en la base de datos
    const { nombres, cedula, celular, direccion, ciudad_id } = req.body;
    const sql = 'INSERT INTO clientes (nombres, cedula, celular, direccion, ciudad_id) VALUES (?, ?, ?, ?, ?)';
    const values = [nombres, cedula, celular, direccion, ciudad_id];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al registrar el cliente.' });
      }
      return res.status(201).json({ message: 'Cliente registrado correctamente.' });
    });
  });
  

// Ruta para obtener la lista de clientes
router.get('/clientes', (req, res) => {
  // Lógica para obtener la lista de clientes desde la base de datos
  app.get('/clientes', (req, res) => {
    const sql = 'SELECT * FROM clientes';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al obtener la lista de clientes.' });
      }
      return res.status(200).json(results);
    });
  });
});

// Ruta para asignar un agente a un cliente
router.put('/clientes/:id/agente', (req, res) => {
  // Lógica para asignar un agente a un cliente en la base de datos
  app.put('/clientes/:id/agente', (req, res) => {
    const clienteId = req.params.id;
    const { agente_cedula } = req.body;
  
    const sql = 'UPDATE clientes SET agente_cedula = ? WHERE id = ?';
    const values = [agente_cedula, clienteId];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al asignar el agente al cliente.' });
      }
      return res.status(200).json({ message: 'Agente asignado correctamente.' });
    });
  });
});

// Ruta para autenticar un usuario y generar un token JWT
app.post('/login', (req, res) => {
    const { nombreUsuario, contraseña } = req.body;
    
    // Lógica para verificar las credenciales en la base de datos
    // ...
  
    // Después de verificar, genera un token JWT y lo envía al cliente
    const usuario = { id: 1, nombre: 'Usuario' }; // Obtén el usuario desde la base de datos
    const token = jwt.sign(usuario, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  });
  
  // Middleware para verificar el token en rutas protegidas
  function verificarToken(req, res, next) {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado.' });
  
    jwt.verify(token, jwtSecret, (err, usuario) => {
      if (err) return res.status(403).json({ error: 'Token inválido.' });
      req.usuario = usuario;
      next();
    });
  }
  
  // Ruta protegida con JWT
  app.get('/ruta-protegida', verificarToken, (req, res) => {
    res.json({ mensaje: 'Esta es una ruta protegida con JWT.' });
  });

module.exports = router;
