const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

const secretKey = 'tuclave123#*'; // Reemplaza con una clave secreta segura
const users = []; // Almacena los usuarios registrados (por simplicidad, usa un array en memoria)

// Ruta para registrar usuarios
router.post('/register', async (req, res) => {
  // Lógica para registrar usuarios (mismo código que en tu ejemplo)
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); // Hashea la contraseña antes de almacenarla
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'Usuario registrado correctamente' });
});


// Ruta para autenticar usuarios
router.post('/login', async (req, res) => {
  // Lógica para autenticar usuarios (mismo código que en tu ejemplo)
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ username }, secretKey);
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
});
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.sendStatus(401); // No se proporcionó un token
  
  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user;
    next(); // El token es válido, permite el acceso a la ruta protegida
  });
}

router.get('/ruta-protegida', authenticateToken, (req, res) => {
  // Acceso permitido solo para usuarios autenticados
  res.json({ message: 'Ruta protegida alcanzada' });
});

module.exports = router;
