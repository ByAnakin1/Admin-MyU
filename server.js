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

// Ruta para obtener únicamente órdenes con estado "confirmada"
app.get('/orders/confirmed', (req, res) => {
    const query = `
        SELECT 
            o.id_orden, 
            c.nombre_cliente, 
            o.total, 
            o.fecha_orden, 
            o.estado, 
            GROUP_CONCAT(p.nombre_producto SEPARATOR ', ') AS productos
        FROM ordenes o
        JOIN clientes c ON o.id_cliente = c.id_cliente
        JOIN detalles_orden d ON o.id_orden = d.id_orden
        JOIN productos p ON d.id_producto = p.id_producto
        WHERE o.estado = 'confirmada'
        GROUP BY o.id_orden;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener órdenes confirmadas:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener órdenes confirmadas' });
        }

        res.json(results); // Devuelve las órdenes confirmadas
    });
});

// Ruta para obtener únicamente órdenes con estado "rechazado"
app.get('/orders/rejected', (req, res) => {
    const query = `
        SELECT 
            o.id_orden, 
            c.nombre_cliente, 
            o.total, 
            o.fecha_orden, 
            o.estado, 
            GROUP_CONCAT(p.nombre_producto SEPARATOR ', ') AS productos
        FROM ordenes o
        JOIN clientes c ON o.id_cliente = c.id_cliente
        JOIN detalles_orden d ON o.id_orden = d.id_orden
        JOIN productos p ON d.id_producto = p.id_producto
        WHERE o.estado = 'Rechazado'
        GROUP BY o.id_orden;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener órdenes rechazadas:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener órdenes rechazadas' });
        }

        res.json(results); // Devuelve las órdenes rechazadas
    });
});

// Ruta para obtener todas las órdenes con productos
app.get('/orders', (req, res) => {
    const query = `
        SELECT 
            o.id_orden, 
            c.nombre_cliente, 
            o.total, 
            o.fecha_orden, 
            o.estado, 
            GROUP_CONCAT(p.nombre_producto SEPARATOR ', ') AS productos
        FROM ordenes o
        JOIN clientes c ON o.id_cliente = c.id_cliente
        JOIN detalles_orden d ON o.id_orden = d.id_orden
        JOIN productos p ON d.id_producto = p.id_producto
        GROUP BY o.id_orden;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener órdenes:', error.message);
            return res.status(500).json({ success: false, message: 'Error al obtener órdenes' });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'No se encontraron órdenes' });
        }

        res.json(results); // Devuelve los datos como JSON
    });
});

// Ruta para cambiar el estado de una orden
app.put('/orders/:id/status', (req, res) => {
    const orderId = req.params.id;
    const { estado } = req.body;

    const query = `
        UPDATE ordenes 
        SET estado = ? 
        WHERE id_orden = ?;
    `;

    db.query(query, [estado, orderId], (error, results) => {
        if (error) {
            console.error('Error al actualizar el estado:', error.message);
            return res.status(500).json({ success: false, message: 'Error al actualizar el estado' });
        }
        res.json({ success: true, message: `Estado de la orden cambiado a ${estado}` });
    });
});

// Ruta para eliminar una orden
app.delete('/orders/:id', (req, res) => {
    const orderId = req.params.id;
    const query = 'DELETE FROM ordenes WHERE id_orden = ?';

    db.query(query, [orderId], (error, results) => {
        if (error) {
            console.error('Error al eliminar orden:', error.message);
            return res.status(500).json({ success: false, message: 'Error al eliminar orden' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Orden no encontrada' });
        }
        res.json({ success: true, message: 'Orden eliminada con éxito' });
    });
});


app.get('/tiktoks', (req, res) => {
    const searchQuery = req.query.search || ''; // Obtener el término de búsqueda (si existe)
    const query = `SELECT * FROM tiktok WHERE link LIKE ? OR videoID LIKE ?`;

    db.query(query, [`%${searchQuery}%`, `%${searchQuery}%`], (error, results) => {
        if (error) {
            console.error('Error al obtener Tiktoks:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener tiktoks' });
        }
        res.json(results);
    });
});

app.post('/tiktoks', (req, res) => {
    const { link, videoID } = req.body;

    const query = `INSERT INTO tiktok (link, videoID) VALUES (?, ?)`;

    db.query(query, [link, videoID], (error, results) => {
        if (error) {
            console.error('Error al agregar Tiktok:', error);
            return res.status(500).json({ success: false, message: 'Error al agregar tiktok' });
        }
        res.json({ success: true, message: 'Tiktok agregado exitosamente' });
    });
});

app.put('/tiktoks/:id', (req, res) => {
    const id = req.params.id;
    const { link, videoID } = req.body;

    const query = `UPDATE tiktok SET link = ?, videoID = ? WHERE id = ?`;

    db.query(query, [link, videoID, id], (error, results) => {
        if (error) {
            console.error('Error al actualizar Tiktok:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar tiktok' });
        }
        res.json({ success: true, message: 'Tiktok actualizado exitosamente' });
    });
});

app.delete('/tiktoks/:id', (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM tiktok WHERE id = ?';

    db.query(query, [id], (error, results) => {
        if (error) {
            console.error('Error al eliminar Tiktok:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar tiktok' });
        }
        res.json({ success: true, message: 'Tiktok eliminado exitosamente' });
    });
});

// Ruta para obtener todos los banners o buscar por tipo
app.get('/banners', (req, res) => {
    const searchQuery = req.query.search || ''; // Obtener el término de búsqueda (si existe)
    const query = `
        SELECT * FROM banners 
        WHERE tipo LIKE ?`; // Buscar en el campo "tipo"
    
    db.query(query, [`%${searchQuery}%`], (error, results) => {
        if (error) {
            console.error('Error al obtener banners:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener banners' });
        }
        res.json(results); // Enviar los banners encontrados
    });
});

// Ruta para agregar un nuevo banner
app.post('/banners', (req, res) => {
    const { tipo, img1, img2, img3, img1cell, img2cell, img3cell } = req.body;

    const query = `
        INSERT INTO banners (tipo, img1, img2, img3, img1cell, img2cell, img3cell)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [tipo, img1, img2, img3, img1cell, img2cell, img3cell], (error, results) => {
        if (error) {
            console.error('Error al agregar banner:', error);
            return res.status(500).json({ success: false, message: 'Error al agregar banner' });
        }
        res.json({ success: true, message: 'Banner agregado exitosamente' });
    });
});

// Ruta para actualizar un banner
app.put('/banners/:id', (req, res) => {
    const id_banner = req.params.id;
    const { tipo, img1, img2, img3, img1cell, img2cell, img3cell } = req.body;

    const query = `
        UPDATE banners 
        SET tipo = ?, img1 = ?, img2 = ?, img3 = ?, img1cell = ?, img2cell = ?, img3cell = ?
        WHERE id_banner = ?
    `;

    db.query(query, [tipo, img1, img2, img3, img1cell, img2cell, img3cell, id_banner], (error, results) => {
        if (error) {
            console.error('Error al actualizar banner:', error);
            return res.status(500).json({ success: false, message: 'Error al actualizar el banner' });
        }
        res.json({ success: true, message: 'Banner actualizado exitosamente' });
    });
});
// Ruta para eliminar un banner
app.delete('/banners/:id', (req, res) => {
    const id_banner = req.params.id;

    const query = 'DELETE FROM banners WHERE id_banner = ?';
    
    db.query(query, [id_banner], (error, results) => {
        if (error) {
            console.error('Error al eliminar banner:', error);
            return res.status(500).json({ success: false, message: 'Error al eliminar banner' });
        }
        res.json({ success: true, message: 'Banner eliminado exitosamente' });
    });
});


// Ruta para obtener todos los productos de "Vinchas"
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

// Ruta para obtener un producto específico de "Vinchas"
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

// Ruta para agregar un nuevo producto de "Vinchas"
app.post('/api/vinchas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (16, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Ruta para actualizar un producto de "Vinchas"
app.put('/api/vinchas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, estado_1, estado_2, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
        stock = ?, talla = ?, colores = ?, descuento = ?, estado_1 = ?, estado_2 = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 16
    `;

    db.query(query, [
        nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, 
        stock, talla, colores, descuento, estado_1, estado_2, fecha_registro, id
    ], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Ruta para eliminar un producto de "Vinchas"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (7, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 7
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (19, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 19
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos en la categoría "Pines"
app.get('/api/pines/buscar', (req, res) => {
    const { nombre } = req.query; // Obtenemos el parámetro de búsqueda (nombre)
    
    if (!nombre) {
        return res.status(400).json({ error: 'Debe proporcionar un nombre para la búsqueda' });
    }

    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 19 AND nombre_producto LIKE ?';
    db.query(query, [`%${nombre}%`], (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            res.status(500).json({ error: 'Error al realizar la búsqueda' });
            return;
        }
        res.json(results);
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

// Buscar productos en la categoría "Muñequeras" por id
app.get('/api/munequeras/search', (req, res) => {
    const searchQuery = req.query.query;  // Obtenemos el parámetro de búsqueda (id_producto)

    if (!searchQuery) {
        return res.status(400).json({ error: 'Se debe proporcionar un término de búsqueda (id_producto).' });
    }

    const query = `
        SELECT * FROM productos 
        WHERE id_cat_accesorio = 21 
        AND id_producto = ?
    `;

    db.query(query, [searchQuery], (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            return res.status(500).json({ error: 'Error al buscar productos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos con ese ID' });
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (21, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 21
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos en la categoría "Malla de Manos" por id
app.get('/api/malla_de_manos/search', (req, res) => {
    const searchQuery = req.query.query;  // Obtenemos el parámetro de búsqueda (id_producto)

    if (!searchQuery) {
        return res.status(400).json({ error: 'Se debe proporcionar un término de búsqueda (id_producto).' });
    }

    const query = `
        SELECT * FROM productos 
        WHERE id_cat_accesorio = 20 
        AND id_producto = ?
    `;

    db.query(query, [searchQuery], (err, results) => {
        if (err) {
            console.error('Error al buscar productos:', err);
            return res.status(500).json({ error: 'Error al buscar productos' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos con ese ID' });
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (20, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 20
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos por ID en la categoría "Lentes"
app.get('/api/lentes/search', (req, res) => {
    const { query } = req.query;  // Obtener el parámetro de búsqueda
    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un ID para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 3';
    db.query(searchQuery, [query], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            res.status(500).json({ error: 'Error al buscar producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto en la categoría "Lentes"
app.post('/api/lentes', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 3
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos por ID en la categoría "Lazos"
app.get('/api/lazos/search', (req, res) => {
    const { query } = req.query;  // Obtener el parámetro de búsqueda
    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un ID para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 18';
    db.query(searchQuery, [query], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            res.status(500).json({ error: 'Error al buscar producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto en la categoría "Lazos"
app.post('/api/lazos', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (18, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 18
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos por ID en la categoría "Gorras"
app.get('/api/gorras/search', (req, res) => {
    const { query } = req.query;  // Obtener el parámetro de búsqueda
    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un ID para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 2';
    db.query(searchQuery, [query], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            res.status(500).json({ error: 'Error al buscar producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto en la categoría "Gorras"
app.post('/api/gorras', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 2
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar producto por ID en la categoría "Gargantillas"
app.get('/api/gargantillas/:id', (req, res) => {
    const { id } = req.params;  // Obtener el ID del producto desde los parámetros de la URL

    // Verificar que el ID proporcionado sea válido
    if (!id) {
        return res.status(400).json({ error: 'Debe proporcionar un ID válido para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 9';
    db.query(searchQuery, [id], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            return res.status(500).json({ error: 'Error al buscar producto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results[0]);  // Devolver solo el primer producto encontrado (debería haber uno solo)
    });
});

// Agregar un nuevo producto en la categoría "Gargantillas"
app.post('/api/gargantillas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (9, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 9
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (17, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 17
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos por ID en la categoría "Correas"
app.get('/api/correas/search', (req, res) => {
    const { query } = req.query;  // Obtener el parámetro de búsqueda
    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un ID para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 4';
    db.query(searchQuery, [query], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            res.status(500).json({ error: 'Error al buscar producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto en la categoría "Correas"
app.post('/api/correas', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 4
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos por ID en la categoría "Collares"
app.get('/api/collares/search', (req, res) => {
    const { query } = req.query;  // Obtener el parámetro de búsqueda
    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un ID para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 10';
    db.query(searchQuery, [query], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            res.status(500).json({ error: 'Error al buscar producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto en la categoría "Collares"
app.post('/api/collares', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (10, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 10
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Buscar productos por ID en la categoría "Cinturones"
app.get('/api/cinturones/search', (req, res) => {
    const { query } = req.query;  // Obtener el parámetro de búsqueda
    if (!query) {
        return res.status(400).json({ error: 'Debe proporcionar un ID para la búsqueda.' });
    }

    const searchQuery = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 5';
    db.query(searchQuery, [query], (err, results) => {
        if (err) {
            console.error('Error al buscar producto:', err);
            res.status(500).json({ error: 'Error al buscar producto' });
            return;
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Agregar un nuevo producto en la categoría "Cinturones"
app.post('/api/cinturones', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 5
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener un producto específico de la categoría "Chokers"
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

// Agregar un nuevo producto a la categoría "Chokers"
app.post('/api/chokers', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (8, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 8
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto de la categoría "Chokers"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (6, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 6
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 1
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener todos los productos de la categoría "Arnes"
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

// Obtener un producto específico por ID en la categoría "Arnes"
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

// Agregar un nuevo producto en la categoría "Arnes"
app.post('/api/arnes', (req, res) => {
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (14, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
        if (err) {
            console.error('Error al insertar producto:', err);
            res.status(500).json({ error: 'Error al insertar producto' });
            return;
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});

// Actualizar un producto en la categoría "Arnes"
app.put('/api/arnes/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 14
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
        if (err) {
            console.error('Error al actualizar producto:', err);
            res.status(500).json({ error: 'Error al actualizar producto' });
            return;
        }
        res.status(200).json({ message: 'Producto actualizado con éxito' });
    });
});

// Eliminar un producto en la categoría "Arnes"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (13, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 13
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 12';
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
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 12';
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (12, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 12
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
    const query = 'SELECT * FROM productos WHERE id_cat_accesorio = 11';
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
    const query = 'SELECT * FROM productos WHERE id_producto = ? AND id_cat_accesorio = 11';
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (11, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 11
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_cat_accesorio, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (22, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_cat_accesorio = 22
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Ruta para obtener todos los productos con los nombres de categorías y accesorios
app.get('/productos', (req, res) => {
    const query = `
        SELECT 
            p.id_producto, 
            p.nombre_producto, 
            p.descripcion_producto, 
            p.precio, 
            p.img1, 
            p.img2, 
            p.img3, 
            p.img4, 
            p.talla, 
            p.colores, 
            p.descuento, 
            p.stock, 
            p.fecha_registro, 
            p.estado_1, 
            p.estado_2, 
            c.nombre_categoria AS categoria, 
            a.nombre_accesorio AS accesorio
        FROM 
            productos p
        LEFT JOIN 
            categorias c ON p.id_categoria = c.id_categoria
        LEFT JOIN 
            accesorios a ON p.id_cat_accesorio = a.id_cat_accesorio
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error('Error al obtener productos:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener productos' });
        }
        res.json(results);
    });
});

// Ruta para buscar productos por nombre
app.get('/productos/buscar', (req, res) => {
    const { nombre } = req.query;
    const query = 'SELECT * FROM productos WHERE nombre_producto LIKE ?';
    db.query(query, ['%${nombre}%'], (error, results) => {
        if (error) {
            console.error('Error al buscar productos:', error);
            return res.status(500).json({ success: false, message: 'Error al buscar productos' });
        }
        res.json(results);
    });
});

// Ruta para obtener un producto por su ID
app.get('/productos/:id', (req, res) => {
    const id_producto = req.params.id;
    const query = 'SELECT * FROM productos WHERE id_producto = ?';
    db.query(query, [id_producto], (error, results) => {
        if (error) {
            console.error('Error al obtener producto:', error);
            return res.status(500).json({ success: false, message: 'Error al obtener producto' });
        }
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Producto no encontrado' });
        }
        res.json(results);
    });
});

// Ruta para agregar un nuevo producto
app.post('/productos', (req, res) => {
    const { id_categoria, id_cat_accesorio = null, nombre_producto, descripcion_producto, precio,
            img1 = null, img2 = null, img3 = null, img4 = null, talla = null, colores = null,
            descuento = 0, stock = 0, fecha_registro = new Date(), estado_1 = 1, estado_2 = 1 } = req.body;

    const query = `INSERT INTO productos (id_categoria, id_cat_accesorio, nombre_producto, descripcion_producto, precio,
                                          img1, img2, img3, img4, talla, colores, descuento, stock, fecha_registro, estado_1, estado_2)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(query, [ id_categoria, id_cat_accesorio, nombre_producto, descripcion_producto, precio, img1, img2, img3, img4, talla, colores,
                      descuento, stock, fecha_registro, estado_1, estado_2 ], (error, results) => {
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
        id_categoria, nombre_producto, descripcion_producto, precio, descuento, img1, img2, img3, img4, talla, colores, stock, fecha_registro, estado_1, estado_2
    } = req.body;

    const query = `
        UPDATE productos 
        SET id_categoria = ?, nombre_producto = ?, descripcion_producto = ?, precio = ?, 
            descuento = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, talla = ?, colores = ?, stock = ?, fecha_registro = ?, estado_1 = ?, estado_2 = ? 
        WHERE id_producto = ?
    `;

    db.query(query, [
        id_categoria, nombre_producto, descripcion_producto, precio, descuento, img1, img2, img3, img4, talla, colores, stock, fecha_registro, estado_1, estado_2, id_producto
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (3, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 3
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (4, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 4
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener todos los productos de la categoría "Poleras y Casacas"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (2, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 2
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener un producto específico por ID en "Pantalones y Shorts"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (5, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 5
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener un producto específico por ID en "Medias y Pantys"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (8, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 8
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener todos los productos de la categoría "Polos y Tops" (id_categoria = 1)
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
        nombre_producto, id_cat_accesorio, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    // Comprobamos si todos los campos están presentes y en el formato correcto
    if (
        !nombre_producto || !descripcion_producto || !estado_1 || !estado_2 || precio === undefined ||
        !img1 || !img2 || !img3 || !img4 || stock === undefined || !talla || !colores
    ) {
        console.error('Campos faltantes o inválidos:', req.body);
        return res.status(400).json({ error: 'Faltan campos requeridos o hay campos con formato incorrecto' });
    }

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, id_cat_accesorio, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [
        nombre_producto, id_cat_accesorio || null, descripcion_producto, estado_1, estado_2, parseFloat(precio), img1, img2, img3, img4,
        parseInt(stock), talla, colores, descuento ? parseFloat(descuento) : null
    ], (err) => {
        if (err) {
            console.error('Error al insertar producto en la base de datos:', err);
            return res.status(500).json({ error: 'Hubo un error al guardar el producto. Por favor, intenta de nuevo.' });
        }
        res.status(201).json({ message: 'Producto agregado con éxito' });
    });
});



// Actualizar un producto en la categoría "Polos y Tops"
app.put('/api/polos_y_tops/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 1
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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

// Obtener un producto específico por ID en "Carteras y Mochilas"
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (7, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, 
            stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 7
    `;

    db.query(query, [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro, id], (err) => {
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
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento
    } = req.body;

    const query = `
        INSERT INTO productos (id_categoria, nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento, fecha_registro) 
        VALUES (6, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;

    db.query(
        query,
        [nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4, stock, talla, colores, descuento],
        (err) => {
            if (err) {
                console.error('Error al insertar producto:', err);
                res.status(500).json({ error: 'Error al insertar producto' });
                return;
            }
            res.status(201).json({ message: 'Producto agregado con éxito' });
        }
    );
});

// Actualizar un producto en la categoría "Zapatos y Zapatillas"
app.put('/api/zapatos_y_zapatillas/:id', (req, res) => {
    const { id } = req.params;
    const {
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2,
        img3, img4, stock, talla, colores, descuento, fecha_registro
    } = req.body;

    const query = `
        UPDATE productos 
        SET nombre_producto = ?, descripcion_producto = ?, estado_1 = ?, estado_2 = ?, precio = ?, img1 = ?, 
        img2 = ?, img3 = ?, img4 = ?, stock = ?, talla = ?, colores = ?, descuento = ?, fecha_registro = ?
        WHERE id_producto = ? AND id_categoria = 6;
    `;

    db.query(query, [
        nombre_producto, descripcion_producto, estado_1, estado_2, precio, img1, img2, img3, img4,
        stock, talla, colores, descuento, fecha_registro, id
    ], (err) => {
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