let productos = [];
let editando = false;
let editandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadAccessoryCategories();
    loadProductos();  // Cargar productos al cargar la página
    document.getElementById('searchInput').addEventListener('input', handleSearch); // Agregar el event listener para el buscador
});

function handleSearch() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    loadProductos(searchQuery);  // Filtrar productos en base al término de búsqueda
}

function loadCategories() {
    const select = document.getElementById('id_categoria');
    select.innerHTML = '<option value="" selected>Ninguno</option>'; // Opción "Ninguno"
    const categories = [
        { id: 1, name: 'Polos y Tops' },
        { id: 2, name: 'Poleras y Casacas' },
        { id: 3, name: 'Faldas' },
        { id: 4, name: 'Vestidos' },
        { id: 5, name: 'Pantalones y Shorts' },
        { id: 6, name: 'Zapatos y Zapatillas' },
        { id: 7, name: 'Carteras y Mochilas' },
        { id: 8, name: 'Medias y Pantys' }
    ];

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function loadAccessoryCategories() {
    const select = document.getElementById('id_cat_accesorio');
    select.innerHTML = '<option value="" selected>Ninguno</option>';
    const accessoryCategories = [
        { id: 1, name: 'Bucket hat' },
        { id: 2, name: 'Gorras' },
        { id: 3, name: 'Lentes' },
        { id: 4, name: 'Correa' },
        { id: 5, name: 'Cinturones' },
        { id: 6, name: 'Cadenas' },
        { id: 7, name: 'Tirantes' },
        { id: 8, name: 'Chokers' },
        { id: 9, name: 'Gargantillas' },
        { id: 10, name: 'Collares' },
        { id: 11, name: 'Aretes anime' },
        { id: 12, name: 'Aretes cute' },
        { id: 13, name: 'Aretes' },
        { id: 14, name: 'Arnes' },
        { id: 15, name: 'Ligeros' },
        { id: 16, name: 'Vinchas' },
        { id: 17, name: 'Ganchos' },
        { id: 18, name: 'Lazos' },
        { id: 19, name: 'Pines' },
        { id: 20, name: 'Malla de manos' },
        { id: 21, name: 'Muñequeras' },
        { id: 22, name: 'Anillos' }
    ];

    accessoryCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function loadProductos(searchQuery = '') {
    // Realizamos la búsqueda si hay un término de búsqueda
    fetch(`http://localhost:3000/productos?search=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
        productos = data; // Guardamos los productos filtrados
        renderProductosCards(productos); // Renderizamos los productos
    })
    .catch(error => console.error('Error al cargar productos:', error));
}

function renderProductosCards(productos) {
    const container = document.getElementById('productContainer');
    container.innerHTML = '';  // Limpiar el contenedor antes de agregar productos
    if (productos.length === 0) {
        container.innerHTML = '<p>No se encontraron productos.</p>';
        return;
    }
    productos.forEach(producto => {
        const productHtml = `
            <div class="product-card">
                <img src="${producto.img1}" alt="${producto.nombre_producto}" class="product-img">
                <div class="product-info">
                    <h2>${producto.nombre_producto}</h2>
                    <p>${producto.descripcion_producto}</p>
                    <span>Precio: $${producto.precio} | Categoría: ${producto.id_categoria || 'Ninguno'}</span>
                    <span>Accesorio: ${producto.id_cat_accesorio || 'Ninguno'}</span>
                </div>
                <div class="product-actions">
                    <button class="btn-edit btn btn-warning" onclick="editProducto(${producto.id_producto})">Editar</button>
                    <button class="btn-delete btn btn-danger" onclick="deleteProducto(${producto.id_producto})">Eliminar</button>
                </div>
            </div>
        `;
        container.innerHTML += productHtml;
    });
}

function editProducto(id_producto) {
    const producto = productos.find(p => p.id_producto === id_producto);
    if (!producto) return alert('Producto no encontrado');

    // Llenamos el formulario de edición con los datos del producto
    document.getElementById('id_categoria').value = producto.id_categoria || '';
    document.getElementById('id_cat_accesorio').value = producto.id_cat_accesorio || '';
    document.getElementById('nombre_producto').value = producto.nombre_producto;
    document.getElementById('des_producto').value = producto.descripcion_producto;
    document.getElementById('precio').value = producto.precio;
    document.getElementById('descuento').value = producto.descuento;
    document.getElementById('img1').value = producto.img1;
    document.getElementById('img2').value = producto.img2;
    document.getElementById('img3').value = producto.img3;
    document.getElementById('img4').value = producto.img4;
    document.getElementById('talla').value = producto.talla;
    document.getElementById('colores').value = producto.colores;
    document.getElementById('stock').value = producto.stock;
    document.getElementById('fecha_registro').value = producto.fecha_registro;

    // Mostrar el formulario de edición
    document.querySelector('#productForm button[type="submit"]').textContent = 'Guardar cambios';
    document.getElementById('productModalLabel').textContent = 'Editar Producto';
    const myModal = new bootstrap.Modal(document.getElementById('productModal'));
    myModal.show();
    editando = true;
    editandoId = id_producto;
}

function deleteProducto(id_producto) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;
    fetch(`http://localhost:3000/productos/${id_producto}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Producto eliminado exitosamente');
            loadProductos(); // Recargamos los productos
        }
    })
    .catch(error => console.error('Error al eliminar producto:', error));
}

document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const id_categoria = document.getElementById('id_categoria').value || null;
    const id_cat_accesorio = document.getElementById('id_cat_accesorio').value || null;

    const newProducto = {
        id_categoria: id_categoria === "" ? null : id_categoria,
        id_cat_accesorio: id_cat_accesorio === "" ? null : id_cat_accesorio,
        nombre_producto: document.getElementById('nombre_producto').value,
        descripcion_producto: document.getElementById('des_producto').value,
        precio: document.getElementById('precio').value,
        descuento: document.getElementById('descuento').value,
        img1: document.getElementById('img1').value,
        img2: document.getElementById('img2').value,
        img3: document.getElementById('img3').value,
        img4: document.getElementById('img4').value,
        talla: document.getElementById('talla').value,
        colores: document.getElementById('colores').value,
        stock: document.getElementById('stock').value,
        fecha_registro: document.getElementById('fecha_registro').value
    };

    const url = editando ? `http://localhost:3000/productos/${editandoId}` : 'http://localhost:3000/productos';
    const method = editando ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProducto),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(editando ? 'Producto actualizado exitosamente' : 'Producto agregado exitosamente');
            resetForm();
            loadProductos();
        }
    })
    .catch(error => alert('Error en el servidor: ' + error));
});

function resetForm() {
    document.getElementById('productForm').reset();
    document.querySelector('#productForm button[type="submit"]').textContent = 'Guardar Producto';
    document.getElementById('productModalLabel').textContent = 'Agregar Producto';
    const myModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    myModal.hide();
    editando = false;
    editandoId = null;
}
