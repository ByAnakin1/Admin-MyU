const express = require('express');
const mysql = require('mysql2');
const cors = require('cors'); // Asegúrate de habilitar CORS para permitir las solicitudes desde el frontend
const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Cambia 'root' si tu usuario de MySQL es diferente
    password: '',      // Cambia la contraseña si es necesario
    database: 'myu_bd' // Asegúrate de que este sea el nombre correcto de tu base de datos
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Endpoint para obtener productos de la categoría "Faldas" (id_categoria = 3)
app.get('/api/faldas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 3';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Endpoint para agregar un nuevo producto en la categoría "Faldas"
app.post('/api/faldas', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento) 
        VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
