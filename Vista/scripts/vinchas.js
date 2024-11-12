const productTable = document.getElementById('productTable');
const productForm = document.getElementById('productForm');
let editingProductId = null;

document.addEventListener('DOMContentLoaded', fetchProducts);

async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/vinchas'); // Ruta para la categoría "Vinchas"
        if (!res.ok) throw new Error('Error al obtener productos');
        const products = await res.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

function renderProducts(products) {
    productTable.innerHTML = '';
    products.forEach(product => {
        const formattedDate = new Date(product.fecha_registro).toLocaleString();
        productTable.innerHTML += `
            <tr>
                <td>${product.id_producto}</td>
                <td>${product.nombre_producto}</td>
                <td>${product.descripcion_producto}</td>
                <td>${product.precio}</td>
                <td>
                    <img src="${product.img1}" width="50">
                    ${product.img2 ? `<img src="${product.img2}" width="50">` : ''}
                    ${product.img3 ? `<img src="${product.img3}" width="50">` : ''}
                    ${product.img4 ? `<img src="${product.img4}" width="50">` : ''}
                </td>
                <td>${product.stock}</td>
                <td>${product.talla || ''}</td>
                <td>${product.colores || ''}</td>
                <td>${product.descuento || ''}</td>
                <td>${formattedDate}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${product.id_producto})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id_producto})">Eliminar</button>
                </td>
            </tr>`;
    });
}

async function editProduct(id) {
    try {
        const res = await fetch(`http://localhost:3000/api/vinchas/${id}`);
        if (!res.ok) throw new Error('Error al obtener datos del producto');
        
        const product = await res.json();

        document.getElementById('nombreProducto').value = product.nombre_producto;
        document.getElementById('desProducto').value = product.descripcion_producto;
        document.getElementById('precio').value = product.precio;
        document.getElementById('stock').value = product.stock;
        document.getElementById('talla').value = product.talla || '';
        document.getElementById('colores').value = product.colores || '';
        document.getElementById('descuento').value = product.descuento || '';
        document.getElementById('img1').value = product.img1;
        document.getElementById('img2').value = product.img2 || '';
        document.getElementById('img3').value = product.img3 || '';
        document.getElementById('img4').value = product.img4 || '';
        document.getElementById('fechaRegistro').value = product.fecha_registro ? product.fecha_registro.split('T')[0] : '';

        editingProductId = id;

        const modalElement = document.getElementById('productModal');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    } catch (error) {
        console.error('Error al cargar los datos del producto para editar:', error);
    }
}

productForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const productData = {
        nombre_producto: document.getElementById('nombreProducto').value,
        descripcion_producto: document.getElementById('desProducto').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        talla: document.getElementById('talla').value || null,
        colores: document.getElementById('colores').value || null,
        descuento: parseFloat(document.getElementById('descuento').value) || null,
        img1: document.getElementById('img1').value,
        img2: document.getElementById('img2').value || null,
        img3: document.getElementById('img3').value || null,
        img4: document.getElementById('img4').value || null,
        fecha_registro: document.getElementById('fechaRegistro').value
    };

    try {
        let res;
        if (editingProductId) {
            res = await fetch(`http://localhost:3000/api/vinchas/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            res = await fetch('http://localhost:3000/api/vinchas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (!res.ok) throw new Error(editingProductId ? 'Error al actualizar el producto' : 'Error al agregar el producto');

        fetchProducts();
        productForm.reset();
        const modalElement = document.getElementById('productModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        modalInstance.hide();
        editingProductId = null;
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
});

async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            const res = await fetch(`http://localhost:3000/api/vinchas/${id}`, {
                method: 'DELETE'
            });

            if (!res.ok) throw new Error('Error al eliminar el producto');

            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
}
