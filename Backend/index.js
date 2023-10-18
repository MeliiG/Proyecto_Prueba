const db = require('./db');
const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
  res.send('Prueba');
});

// Resto de tu configuración de Express.js y rutas aquí...


app.listen(port, () => {
  console.log(`La app funcionando en el puerto ${port}`);
});

// Cierra la conexión a la base de datos al finalizar la aplicación
process.on('SIGINT', () => {
    db.end();
    process.exit();
  });