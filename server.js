const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myu_bd'
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

/* ==================== RUTAS PARA FALDAS ==================== */

// Obtener todos los productos de la categoría "Faldas"
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

// Obtener un producto específico por ID en la categoría "Faldas"
app.get('/api/faldas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 3';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Faldas"
app.post('/api/faldas', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Faldas"
app.put('/api/faldas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 3
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Faldas"
app.delete('/api/faldas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 3';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

/* ==================== RUTAS PARA VESTIDOS ==================== */

// Obtener todos los productos de la categoría "Vestidos"
app.get('/api/vestidos', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 4';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Vestidos"
app.get('/api/vestidos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 4';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Vestidos"
app.post('/api/vestidos', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Vestidos"
app.put('/api/vestidos/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 4
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Vestidos"
app.delete('/api/vestidos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 4';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

app.get('/api/poleras_y_casacas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 2';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Poleras y Casacas"
app.get('/api/poleras_y_casacas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 2';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Poleras y Casacas"
app.post('/api/poleras_y_casacas', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Poleras y Casacas"
app.put('/api/poleras_y_casacas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 2
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Poleras y Casacas"
app.delete('/api/poleras_y_casacas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 2';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Pantalones y Shorts"
app.get('/api/pantalones_y_shorts', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 5';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Pantalones y Shorts"
app.get('/api/pantalones_y_shorts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 5';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Pantalones y Shorts"
app.post('/api/pantalones_y_shorts', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Pantalones y Shorts"
app.put('/api/pantalones_y_shorts/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 5
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Pantalones y Shorts"
app.delete('/api/pantalones_y_shorts/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 5';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Medias y Pantys"
app.get('/api/medias_y_pantys', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 8';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Medias y Pantys"
app.get('/api/medias_y_pantys/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 8';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Medias y Pantys"
app.post('/api/medias_y_pantys', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (8, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Medias y Pantys"
app.put('/api/medias_y_pantys/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 8
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Medias y Pantys"
app.delete('/api/medias_y_pantys/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 8';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Polos y Tops"
app.get('/api/polos_y_tops', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Polos y Tops"
app.get('/api/polos_y_tops/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 1';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Polos y Tops"
app.post('/api/polos_y_tops', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Polos y Tops"
app.put('/api/polos_y_tops/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 1
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Polos y Tops"
app.delete('/api/polos_y_tops/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 1';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Carteras y Mochilas"
app.get('/api/carteras_y_mochilas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 7';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Carteras y Mochilas"
app.get('/api/carteras_y_mochilas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 7';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Carteras y Mochilas"
app.post('/api/carteras_y_mochilas', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (7, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Carteras y Mochilas"
app.put('/api/carteras_y_mochilas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 7
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Carteras y Mochilas"
app.delete('/api/carteras_y_mochilas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 7';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Zapatos y Zapatillas"
app.get('/api/zapatos_y_zapatillas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_categoria = 6';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Zapatos y Zapatillas"
app.get('/api/zapatos_y_zapatillas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_categoria = 6';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el producto:', err);
            res.status(500).json({ error: 'Error al obtener el producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);
    });
});

// Agregar un nuevo producto en la categoría "Zapatos y Zapatillas"
app.post('/api/zapatos_y_zapatillas', (req, res) => {
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (6, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
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

// Actualizar un producto en la categoría "Zapatos y Zapatillas"
app.put('/api/zapatos_y_zapatillas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, des_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, des_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 6
    `;

    db.query(query, [nombre_producto, des_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Zapatos y Zapatillas"
app.delete('/api/zapatos_y_zapatillas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_categoria = 6';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
