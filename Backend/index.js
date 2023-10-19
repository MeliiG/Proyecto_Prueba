const express = require('express');
const app = express();
const port = 3000;
const db = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de sal para el cifrado

// const cors = require('cors');
// app.use(cors());

const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:3001', // Reemplaza esto con la URL de tu frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));


app.use(express.json());

app.post('/registro', async (req, res) => {
  const { correo, password } = req.body;

  try {
    // Cifra la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const sql = 'INSERT INTO usuarios (correo, password) VALUES (?, ?)';
    db.query(sql, [correo, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error al insertar datos en la base de datos: ' + err.message);
        res.status(500).send('Error interno del servidor');
        return;
      }
      console.log('Datos insertados correctamente en la base de datos.');
      res.status(200).send('Registro exitoso');
    });
  } catch (error) {
    console.error('Error al cifrar la contraseña: ' + error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta de inicio de sesión
app.post('/login', (req, res) => {
  const { correo, password } = req.body;
  console.log('Datos recibidos del frontend:', req.body); // Agrega este registro de console.log

  console.log('Correo electrónico recibido del frontend:', correo);
  const sql = 'SELECT * FROM usuarios WHERE correo = ?';
  db.query(sql, [correo], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario en la base de datos: ' + err.message);
      res.status(500).send('Error interno del servidor');
      return;
    }

    console.log('Datos obtenidos de la base de datos:', results);

    // Verificar si el usuario existe en la base de datos
    if (results.length === 0) {
      res.status(401).send('Correo electrónico o contraseña incorrectos');
      return;
    }

    const user = results[0];

    // Comparar la contraseña proporcionada con la contraseña almacenada en la base de datos
    try {
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(password);
      console.log(user.password);
      console.log('Password Match:', passwordMatch); // Agrega este registro de console.log
      if (passwordMatch) {
        // Contraseña coincidente, el inicio de sesión es exitoso
        res.status(200).send('Inicio de sesión exitoso');
      } else {
        // Contraseña incorrecta
        res.status(401).send('Correo electrónico o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al comparar contraseñas:', error);
      res.status(500).send('Error interno del servidor');
    }
  });
});

// Ruta para obtener datos de la tabla clientes
app.get('/clientes', (req, res) => {
  // Consulta SQL para obtener datos de la tabla clientes
  const sql = 'SELECT * FROM clientes';

  // Ejecutar la consulta en la base de datos (usar `db` en lugar de `connection`)
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error al ejecutar la consulta SQL: ' + error.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(results); // Enviar los resultados como respuesta JSON
  });
});

// Ruta para obtener datos de la tabla ciudades
app.get('/ciudades', (req, res) => {
  const sql = 'SELECT * FROM ciudades';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de ciudades:', error.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(results);
  });
});

// Ruta para obtener datos de la tabla agentes
app.get('/agentes', (req, res) => {
  const sql = 'SELECT * FROM agentes';
  db.query(sql, (error, results) => {
    if (error) {
      console.error('Error al obtener datos de agentes:', error.message);
      res.status(500).send('Error interno del servidor');
      return;
    }
    res.json(results);
  });
});


app.post('/insertar-datos', async (req, res) => {
  const {
    nombres,
    cedula,
    celular,
    direccion,
    ciudad,
    departamento,
    nroAgente,
    nombreAgente
  } = req.body;

  try {
    // Primero, inserta datos en la tabla de ciudades
    const queryCiudades = `INSERT INTO ciudades (nombre, departamento) VALUES (?, ?)`;
    db.query(queryCiudades, [ciudad, departamento], (err, result) => {
      if (err) {
        console.error('Error al insertar datos de ciudad: ' + err.message);
        throw err;
      }

      // Luego, inserta datos en la tabla de agentes
      const queryAgentes = `INSERT INTO agentes (cedula_agente, nombre) VALUES (?, ?)`;
      db.query(queryAgentes, [nroAgente, nombreAgente], (err, result) => {
        if (err) {
          console.error('Error al insertar datos de agente: ' + err.message);
          throw err;
        }

        // Finalmente, inserta datos en la tabla de clientes
        const queryClientes = `INSERT INTO clientes (nombres, cedula, celular, direccion, ciudad_id, cedula_agente) VALUES (?, ?, ?, ?, (SELECT id FROM ciudades WHERE nombre = ?), ?)`;
        db.query(queryClientes, [nombres, cedula, celular, direccion, ciudad, nroAgente], (err, result) => {
          if (err) {
            console.error('Error al insertar datos de cliente: ' + err.message);
            throw err;
          }

          console.log('Datos de ciudad, agente y cliente insertados correctamente');
          res.status(200).send('Datos insertados correctamente');
        });
      });
    });
  } catch (error) {
    console.error('Error en la inserción de datos: ' + error.message);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para consulta un cliente específico
app.get('/clientes/:id', (req, res) => {
  const clienteId = parseInt(req.params.id);

  // Realiza una consulta a la base de datos para obtener los detalles del cliente por su ID
  const sql = `
    SELECT 
      clientes.nombres,
      clientes.cedula,
      clientes.celular,
      clientes.direccion,
      ciudades.nombre AS ciudad,
      ciudades.departamento,
      agentes.cedula_agente AS nroAgente,
      agentes.nombre AS nombreAgente
    FROM 
      clientes
    INNER JOIN ciudades ON clientes.ciudad_id = ciudades.id
    INNER JOIN agentes ON clientes.cedula_agente = agentes.cedula_agente
    WHERE 
      clientes.id = ?;
  `;

  db.query(sql, [clienteId], (error, result) => {
    if (error) {
      console.error('Error al obtener datos del cliente:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (result.length === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    const cliente = result[0];
    res.json(cliente); // Enviar los detalles del cliente como respuesta JSON
  });
});

// Ruta para edital/actualizar un cliente específico por su ID
app.put('/clientes/:id', (req, res) => {
  const clienteId = parseInt(req.params.id);
  const {
    nombres,
    cedula,
    celular,
    direccion,
    ciudad,
    departamento,
    nroAgente,
    nombreAgente
  } = req.body;

  // Realiza una consulta para actualizar los datos del cliente en la base de datos
  const sqlUpdate = `
    UPDATE clientes
    SET nombres = ?,
        cedula = ?,
        celular = ?,
        direccion = ?,
        ciudad_id = (SELECT id FROM ciudades WHERE nombre = ?),
        cedula_agente = ?
    WHERE id = ?;
  `;

  db.query(
    sqlUpdate,
    [nombres, cedula, celular, direccion, ciudad, nroAgente, clienteId],
    (error, result) => {
      if (error) {
        console.error('Error al actualizar datos del cliente:', error);
        res.status(500).send('Error interno del servidor');
        return;
      }

      // Verificar si se actualizó algún registro en la base de datos
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Cliente no encontrado' });
        return;
      }

      // Si la actualización fue exitosa, responder con un mensaje de éxito
      res.status(200).json({ message: 'Datos del cliente actualizados correctamente' });
    }
  );
});


// Ruta para eliminar un cliente específico por su ID
app.delete('/clientes/:id', (req, res) => {
  const clienteId = parseInt(req.params.id);
  console.log('Solicitud DELETE recibida para el cliente con ID:', clienteId);

  // Realiza una consulta a la base de datos para eliminar el cliente por su ID
  const sql = 'DELETE FROM clientes WHERE id = ?';
  db.query(sql, [clienteId], (error, result) => {
    if (error) {
      console.error('Error al eliminar el cliente:', error);
      res.status(500).send('Error interno del servidor');
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Cliente no encontrado' });
      return;
    }

    console.log('Cliente eliminado correctamente');
    res.status(200).send('Cliente eliminado correctamente');
  });
});




app.listen(port, () => {
  console.log(`La app funcionando en el puerto ${port}`);
});

process.on('SIGINT', () => {
  db.end();
  process.exit();
});
