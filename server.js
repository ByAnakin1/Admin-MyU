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
    database: 'myu_basedatos'
});

// Verificar conexión a la base de datos
db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Obtener todos los productos de la categoría "Vinchas"
app.get('/api/vinchas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 16';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Vinchas"
app.get('/api/vinchas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 16';
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

// Agregar un nuevo producto en la categoría "Vinchas"
app.post('/api/vinchas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (16, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Vinchas"
app.put('/api/vinchas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
                SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 16
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Vinchas"
app.delete('/api/vinchas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 16';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Tirantes"
app.get('/api/tirantes', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 7';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Tirantes"
app.get('/api/tirantes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 7';
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

// Agregar un nuevo producto en la categoría "Tirantes"
app.post('/api/tirantes', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (7, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Tirantes"
app.put('/api/tirantes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 7
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Tirantes"
app.delete('/api/tirantes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 7';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Pines"
app.get('/api/pines', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 19';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Pines"
app.get('/api/pines/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 19';
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

// Agregar un nuevo producto en la categoría "Pines"
app.post('/api/pines', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (19, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Pines"
app.put('/api/pines/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 19
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Pines"
app.delete('/api/pines/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 19';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Muñequeras"
app.get('/api/munequeras', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 21';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Muñequeras"
app.get('/api/munequeras/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 21';
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

// Agregar un nuevo producto en la categoría "Muñequeras"
app.post('/api/munequeras', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (21, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Muñequeras"
app.put('/api/munequeras/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 21
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Muñequeras"
app.delete('/api/munequeras/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 21';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Malla de Manos"
app.get('/api/malla_de_manos', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 20';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Malla de Manos"
app.get('/api/malla_de_manos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 20';
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

// Agregar un nuevo producto en la categoría "Malla de Manos"
app.post('/api/malla_de_manos', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (20, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Malla de Manos"
app.put('/api/malla_de_manos/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 20
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Malla de Manos"
app.delete('/api/malla_de_manos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 20';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});


// Obtener todos los productos de la categoría "Ligeros"
app.get('/api/ligeros', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 15';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Ligeros"
app.get('/api/ligeros/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 15';
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

// Agregar un nuevo producto en la categoría "Ligeros"
app.post('/api/ligeros', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (15, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Ligeros"
app.put('/api/ligeros/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 15
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Ligeros"
app.delete('/api/ligeros/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 15';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});


// Obtener todos los productos de la categoría "Lentes"
app.get('/api/lentes', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 3';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Lentes"
app.get('/api/lentes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 3';
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

// Agregar un nuevo producto en la categoría "Lentes"
app.post('/api/lentes', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Lentes"
app.put('/api/lentes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 3
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Lentes"
app.delete('/api/lentes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 3';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Lazos"
app.get('/api/lazos', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 18';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Lazos"
app.get('/api/lazos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 18';
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

// Agregar un nuevo producto en la categoría "Lazos"
app.post('/api/lazos', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (18, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Lazos"
app.put('/api/lazos/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 18
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Lazos"
app.delete('/api/lazos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 18';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Gorras"
app.get('/api/gorras', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 2';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Gorras"
app.get('/api/gorras/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 2';
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

// Agregar un nuevo producto en la categoría "Gorras"
app.post('/api/gorras', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Gorras"
app.put('/api/gorras/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 2
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Gorras"
app.delete('/api/gorras/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 2';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Gargantillas"
app.get('/api/gargantillas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 9';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Gargantillas"
app.get('/api/gargantillas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 9';
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

// Agregar un nuevo producto en la categoría "Gargantillas"
app.post('/api/gargantillas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (9, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Gargantillas"
app.put('/api/gargantillas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 9
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Gargantillas"
app.delete('/api/gargantillas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 9';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Ganchos"
app.get('/api/ganchos', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 17';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Ganchos"
app.get('/api/ganchos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 17';
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

// Agregar un nuevo producto en la categoría "Ganchos"
app.post('/api/ganchos', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (17, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Ganchos"
app.put('/api/ganchos/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 17
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Ganchos"
app.delete('/api/ganchos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 17';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Correas"
app.get('/api/correas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 4';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Correas"
app.get('/api/correas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 4';
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

// Agregar un nuevo producto en la categoría "Correas"
app.post('/api/correas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Correas"
app.put('/api/correas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 4
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Correas"
app.delete('/api/correas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 4';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Collares"
app.get('/api/collares', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 10';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Collares"
app.get('/api/collares/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 10';
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

// Agregar un nuevo producto en la categoría "Collares"
app.post('/api/collares', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (10, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Collares"
app.put('/api/collares/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 10
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Collares"
app.delete('/api/collares/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 10';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Cinturones"
app.get('/api/cinturones', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 5';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Cinturones"
app.get('/api/cinturones/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 5';
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

// Agregar un nuevo producto en la categoría "Cinturones"
app.post('/api/cinturones', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Cinturones"
app.put('/api/cinturones/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 5
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Cinturones"
app.delete('/api/cinturones/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 5';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Chokers"
app.get('/api/chokers', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 8';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Chokers"
app.get('/api/chokers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 8';
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

// Agregar un nuevo producto en la categoría "Chokers"
app.post('/api/chokers', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (8, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Chokers"
app.put('/api/chokers/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 8
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Chokers"
app.delete('/api/chokers/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 8';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Cadenas"
app.get('/api/cadenas', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 6';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Cadenas"
app.get('/api/cadenas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 6';
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

// Agregar un nuevo producto en la categoría "Cadenas"
app.post('/api/cadenas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (6, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Cadenas"
app.put('/api/cadenas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 6
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Cadenas"
app.delete('/api/cadenas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 6';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Bucket Hat"
app.get('/api/bucket_hat', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 1';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Bucket Hat"
app.get('/api/bucket_hat/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 1';
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

// Agregar un nuevo producto en la categoría "Bucket Hat"
app.post('/api/bucket_hat', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Bucket Hat"
app.put('/api/bucket_hat/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 1
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Bucket Hat"
app.delete('/api/bucket_hat/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 1';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Arnés"
app.get('/api/arnes', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 14';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Arnés"
app.get('/api/arnes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 14';
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

// Agregar un nuevo producto en la categoría "Arnés"
app.post('/api/arnes', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (14, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Arnés"
app.put('/api/arnes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 14
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Arnés"
app.delete('/api/arnes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 14';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Aretes"
app.get('/api/aretes', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 13';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Aretes"
app.get('/api/aretes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 13';
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

// Agregar un nuevo producto en la categoría "Aretes"
app.post('/api/aretes', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (13, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Aretes"
app.put('/api/aretes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 13
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Aretes"
app.delete('/api/aretes/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 13';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Obtener todos los productos de la categoría "Aretes Cute"
app.get('/api/aretes_cute', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 12'; // ID para Aretes Cute
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Aretes Cute"
app.get('/api/aretes_cute/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 12'; // ID para Aretes Cute
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

// Agregar un nuevo producto en la categoría "Aretes Cute"
app.post('/api/aretes_cute', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (12, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Aretes Cute"
app.put('/api/aretes_cute/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 12
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Aretes Cute"
app.delete('/api/aretes_cute/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 12';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});
// Obtener todos los productos de la categoría "Aretes Anime"
app.get('/api/aretes_anime', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 11'; // ID para Aretes Anime
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Aretes Anime"
app.get('/api/aretes_anime/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 11'; // ID para Aretes Anime
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

// Agregar un nuevo producto en la categoría "Aretes Anime"
app.post('/api/aretes_anime', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (11, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Aretes Anime"
app.put('/api/aretes_anime/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 11
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2 || null, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Aretes Anime"
app.delete('/api/aretes_anime/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 11';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});
// Obtener todos los productos de la categoría "Anillos"
app.get('/api/anillos', (req, res) => {
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 22';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).json({ error: 'Error al obtener productos' });
            return;
        }
        res.json(results);
    });
});

// Obtener un producto específico por ID en la categoría "Anillos"
app.get('/api/anillos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 22';
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

// Agregar un nuevo producto en la categoría "Anillos"
app.post('/api/anillos', (req, res) => {
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (22, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Anillos"
app.put('/api/anillos/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 22
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3 || null, img4 || null, stock, talla || null, colores || null, descuento || null, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Anillos"
app.delete('/api/anillos/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM productos WHERE id_producto = ? AND id_cat_accesorio = 22';

    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error al eliminar producto:', err);
            res.status(500).json({ error: 'Error al eliminar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto eliminado con éxito' });
    });
});

// Ruta para obtener la cantidad de productos por categoría y accesorio
app.get('/reportes/todos', (req, res) => {
    const queryCategorias = `
      SELECT c.nombre_categoria AS nombre, COUNT(p.id_producto) AS cantidad
      FROM categorias c
      LEFT JOIN productos p ON c.id_categoria = p.id_categoria
      GROUP BY c.nombre_categoria
    `;
  
    const queryAccesorios = `
      SELECT ca.nombre_cat_accesorio AS nombre, COUNT(p.id_producto) AS cantidad
      FROM cat_accesorios ca
      LEFT JOIN productos p ON ca.id_cat_accesorio = p.id_cat_accesorio
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
  
// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
    const query = 'SELECT * FROM productos';
    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener productos' });
        }
        res.json(results);
    });
});

// Ruta para agregar un nuevo producto
app.post('/productos', (req, res) => {
    const { 
        id_categoria, id_cat_accesorio, nombre_producto, descripcion_producto, precio,
        img1, img2, img3, img4, talla, colores, descuento, stock, fecha_registro 
    } = req.body;

    const query = `
        INSERT INTO productos (
            id_categoria, id_cat_accesorio, nombre_producto, descripcion_producto, precio,
            img1, img2, img3, img4, talla, colores, descuento, stock, fecha_registro
        ) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        id_categoria, id_cat_accesorio, nombre_producto, descripcion_producto, precio,
        img1, img2, img3, img4, talla, colores, descuento, stock, fecha_registro
    ], (error, results) => {
        if (error) {
            console.error('Error al insertar producto:', error.message);
            return res.status(500).json({ success: false, message: 'Error al guardar el producto', error: error.message });
        }
        res.json({ success: true, message: 'Producto agregado exitosamente' });
    });
});

// Ruta para actualizar un producto
app.put('/productos/:id', (req, res) => {
    const id_producto = req.params.id;
    const { 
        id_categoria, nombre_producto, descripcion_producto, precio, descuento, img1, img2, img3, img4, talla, colores, stock, fecha_registro 
    } = req.body;

    const query = `
        UPDATE productos 
        SET id_categoria = ?, nombre_producto = ?, descripcion_producto = ?, precio = ?, 
        descuento = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, talla = ?, colores = ?, stock = ?, fecha_registro = ? 
        WHERE id_producto = ?
    `;

    db.query(query, [
        id_categoria, nombre_producto, descripcion_producto, precio, descuento, img1, img2, img3, img4, talla, colores, stock, fecha_registro, id_producto
    ], (error, results) => {
        if (error) {
            console.error('Error al actualizar producto:', error);
            return res.status(500).send({ success: false, message: 'Error al actualizar el producto' });
        }
        res.json({ success: true, message: 'Producto actualizado' });
    });
});

// Ruta para eliminar un producto
app.delete('/productos/:id', (req, res) => {
    const id_producto = req.params.id;
    const query = 'DELETE FROM productos WHERE id_producto = ?';
    db.query(query, [id_producto], (error, results) => {
        if (error) {
            console.error('Error al eliminar producto:', error);
            return res.status(500).send({ success: false, message: 'Error al eliminar el producto' });
        }
        res.json({ success: true, message: 'Producto eliminado exitosamente' });
    });
});

// Ruta para buscar productos por nombre
app.get('/productos/buscar', (req, res) => {
    const { nombre } = req.query;
    const query = 'SELECT * FROM productos WHERE nombre_producto LIKE ?';
    db.query(query, [`%${nombre}%`], (error, results) => {
        if (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ success: false, message: 'Error al buscar productos' });
        }
        res.json(results);
    });
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 3
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 4
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 2
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 5
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (8, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 8
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 1
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (7, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 7
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (6, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 6
    `;

    db.query(query, [nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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