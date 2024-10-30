// Importar las dependencias necesarias
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Crear la aplicación Express
const app = express();

// Usar CORS para permitir solicitudes de otros dominios
app.use(cors());

// Configurar Express para manejar JSON
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',       // Servidor donde está corriendo la base de datos
  user: 'root',            // Usuario de la base de datos
  password: '',            // Contraseña del usuario, por defecto en XAMPP está vacía
  database: 'myu_bd',      // Nombre de la base de datos que creaste
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos MySQL');
  }
});

// Ruta para obtener la cantidad de productos por categoría y accesorio
app.get('/reportes/todos', (req, res) => {
  const queryCategorias = `
    SELECT c.nombre_categoria AS nombre, COUNT(p.id_producto) AS cantidad
    FROM categoria c
    LEFT JOIN productos p ON c.id_categoria = p.id_categoria
    GROUP BY c.nombre_categoria
  `;

  const queryAccesorios = `
    SELECT ca.nombre_cat_accesorio AS nombre, COUNT(p.id_producto) AS cantidad
    FROM cat_accesorios ca
    LEFT JOIN productos p ON ca.id_cat_accesorios = p.id_cat_accesorios
    GROUP BY ca.nombre_cat_accesorio
  `;

  db.query(queryCategorias, (err, categoriasResults) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.query(queryAccesorios, (err, accesoriosResults) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ categorias: categoriasResults, accesorios: accesoriosResults });
    });
  });
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
