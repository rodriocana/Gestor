const express = require('express');
const mariadb = require('mariadb');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de la base de datos
const pool = mariadb.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'tareas',
  port: 3306,
  connectionLimit: 5,
  acquireTimeout: 5000
});

// Ruta para obtener todas las tareas
app.get('/tareas', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conectado a la base de datos');

    const query = 'SELECT * FROM tareass';
    const rows = await conn.query(query);

    res.json(rows);
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  } finally {
    if (conn) conn.end();
  }
});


// Ruta para obtener todas las tareas
app.get('/completadas', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    console.log('Conectado a la base de datos');

    const query = 'SELECT * FROM completadas';
    const rows = await conn.query(query);

    res.json(rows);
  } catch (err) {
    console.error('Error en la consulta:', err);
    res.status(500).json({ error: 'Error al obtener las tareas' });
  } finally {
    if (conn) conn.end();
  }
});

// Ruta para eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  let conn;
  try {
    const id = req.params.id;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    conn = await pool.getConnection();
    console.log('Conectado a la base de datos para eliminar tarea');

    const query = 'DELETE FROM tareass WHERE id = ?';
    const result = await conn.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar la tarea:', err);
    res.status(500).json({ error: 'Error al eliminar la tarea' });
  } finally {
    if (conn) conn.end();
  }
});

// Nueva ruta para completar una tarea
app.post('/tareas/completar/:id', async (req, res) => {
  let conn;
  try {
    const id = req.params.id;

    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    conn = await pool.getConnection();
    console.log('Conectado a la base de datos para completar tarea');

    await conn.beginTransaction();

    // 1. Obtener la tarea de tareass
    const selectQuery = 'SELECT id, categoria, descripcion, tiempo FROM tareass WHERE id = ?';
    const tarea = await conn.query(selectQuery, [id]);

    if (!tarea.length) {
      await conn.rollback();
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const tareaData = tarea[0];

    // 2. Insertar en completadas
    const insertQuery = 'INSERT INTO completadas (id, categoria, descripcion, tiempo) VALUES (?, ?, ?, ?)';
    await conn.query(insertQuery, [tareaData.id, tareaData.categoria, tareaData.descripcion, tareaData.tiempo]);

    // 3. Eliminar de tareass
    const deleteQuery = 'DELETE FROM tareass WHERE id = ?';
    const result = await conn.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ error: 'Error al eliminar la tarea original' });
    }

    await conn.commit();

    res.status(200).json({ message: 'Tarea completada y movida a completadas' });
  } catch (err) {
    if (conn) await conn.rollback();
    console.error('Error al completar la tarea:', err);
    res.status(500).json({ error: 'Error al completar la tarea' });
  } finally {
    if (conn) conn.end();
  }
});

// Iniciar el servidor
const PORT = 3000;
const HOST = '192.168.210.176';

app.listen(PORT, HOST, () => {
  console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
