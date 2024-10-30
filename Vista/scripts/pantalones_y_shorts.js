const productTable = document.getElementById('productTable');
const productForm = document.getElementById('productForm');
let editingProductId = null; // Almacena el ID del producto en edición

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', fetchProducts);

// Obtener productos desde el servidor y mostrarlos en la tabla
async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/pantalones_y_shorts'); // Cambiado a la ruta correcta de pantalones y shorts
        if (!res.ok) throw new Error('Error al obtener productos');
        const products = await res.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Mostrar productos en la tabla con botones de editar y eliminar
function renderProducts(products) {
    productTable.innerHTML = '';
    products.forEach(product => {
        const formattedDate = new Date(product.fecha_registro).toLocaleString();
        productTable.innerHTML += `
            <tr>
                <td>${product.id_producto}</td>
                <td>${product.nombre_producto}</td>
                <td>${product.des_producto}</td>
                <td>${product.precio}</td>
                <td>
                    <img src="${product.img1}" width="50">
                    ${product.img2 ? `<img src="${product.img2}" width="50">` : ''}
                    ${product.img3 ? `<img src="${product.img3}" width="50">` : ''}
                    ${product.img4 ? `<img src="${product.img4}" width="50">` : ''}
                </td>
                <td>${product.stock}</td>
                <td>${product.talla}</td>
                <td>${product.colores}</td>
                <td>${product.descuento}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id_producto})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id_producto})">Eliminar</button>
                </td>
            </tr>`;
    });
}

// Función para cargar los datos del producto en el formulario y abrir el modal para edición
async function editProduct(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/pantalones_y_shorts/${id}`); // Cambiado a la ruta correcta de pantalones y shorts
        if (!res.ok) throw new Error('Error al obtener datos del producto');
        
        const product = await res.json();

        // Llenar los campos del formulario con los datos del producto
        document.getElementById('nombreProducto').value = product.nombre_producto;
        document.getElementById('desProducto').value = product.des_producto;
        document.getElementById('precio').value = product.precio;
        document.getElementById('stock').value = product.stock;
        document.getElementById('talla').value = product.talla;
        document.getElementById('colores').value = product.colores;
        document.getElementById('descuento').value = product.descuento;
        document.getElementById('img1').value = product.img1;
        document.getElementById('img2').value = product.img2;
        document.getElementById('img3').value = product.img3;
        document.getElementById('img4').value = product.img4;
        document.getElementById('fechaRegistro').value = product.fecha_registro ? product.fecha_registro.split('T')[0] : '';

        editingProductId = id;

        const modalElement = document.getElementById('productModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    } catch (error) {
        console.error('Error al cargar los datos del producto para editar:', error);
        alert('Hubo un problema al cargar los datos del producto. Por favor, intenta de nuevo.');
    }
}

// Manejar la creación o edición de productos cuando se envía el formulario
productForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Crear el objeto con los datos del producto del formulario
    const productData = {
        nombre_producto: document.getElementById('nombreProducto').value,
        des_producto: document.getElementById('desProducto').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        talla: document.getElementById('talla').value,
        colores: document.getElementById('colores').value,
        descuento: parseFloat(document.getElementById('descuento').value),
        img1: document.getElementById('img1').value,
        img2: document.getElementById('img2').value,
        img3: document.getElementById('img3').value,
        img4: document.getElementById('img4').value,
        fecha_registro: document.getElementById('fechaRegistro').value
    };

    try {
        let res;
        if (editingProductId) {
            // Si estamos editando un producto, envía una solicitud PUT para actualizar
            res = await fetch(`http://localhost:3000/api/pantalones_y_shorts/${editingProductId}`, { // Cambiado a la ruta correcta de pantalones y shorts
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Si estamos agregando un nuevo producto, envía una solicitud POST
            res = await fetch('http://localhost:3000/api/pantalones_y_shorts', { // Cambiado a la ruta correcta de pantalones y shorts
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (!res.ok) throw new Error(editingProductId ? 'Error al actualizar el producto' : 'Error al agregar el producto');

        // Recargar la lista de productos después de agregar o editar
        fetchProducts();

        // Limpiar el formulario, cerrar el modal y restablecer el estado de edición
        productForm.reset();
        const modalElement = document.getElementById('productModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
        editingProductId = null;
    } catch (error) {
        console.error('Error al guardar el producto:', error);
        alert('Hubo un error al guardar el producto. Por favor, intenta de nuevo.');
    }
});

// Función para eliminar un producto
async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            const res = await fetch(`http://localhost:3000/api/pantalones_y_shorts/${id}`, { // Cambiado a la ruta correcta de pantalones y shorts
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Error al eliminar el producto');

            // Recargar la lista de productos después de eliminar uno
            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            alert('Hubo un error al eliminar el producto. Por favor, intenta de nuevo.');
        }
    }
}
