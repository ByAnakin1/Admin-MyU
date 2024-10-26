const productTable = document.getElementById('productTable');
const productForm = document.getElementById('productForm');

// Cargar productos al inicio
document.addEventListener('DOMContentLoaded', fetchProducts);

// Obtener productos desde el servidor
async function fetchProducts() {
    try {
        const res = await fetch('http://localhost:3000/api/faldas');
        const products = await res.json();
        renderProducts(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Mostrar productos en la tabla
function renderProducts(products) {
    productTable.innerHTML = '';
    products.forEach(product => {
        productTable.innerHTML += `
            <tr>
                <td>${product.id_producto}</td>
                <td>${product.nombre_producto}</td>
                <td>${product.des_producto}</td>
                <td>${product.precio}</td>
                <td>
                    <img src="/images/${product.img1}" width="50">
                    ${product.img2 ? `<img src="/images/${product.img2}" width="50">` : ''}
                    ${product.img3 ? `<img src="/images/${product.img3}" width="50">` : ''}
                    ${product.img4 ? `<img src="/images/${product.img4}" width="50">` : ''}
                </td>
                <td>${product.stock}</td>
                <td>${product.talla}</td>
                <td>${product.colores}</td>
                <td>${product.descuento}</td>
                <td>
                    <button class="btn btn-warning btn-sm">Editar</button>
                    <button class="btn btn-danger btn-sm">Eliminar</button>
                </td>
            </tr>`;
    });
}

// Manejar la creación de productos
productForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const productData = {
        nombre_producto: document.getElementById('nombreProducto').value,
        des_producto: document.getElementById('desProducto').value,
        precio: document.getElementById('precio').value,
        stock: document.getElementById('stock').value,
        talla: document.getElementById('talla').value,
        colores: document.getElementById('colores').value,
        descuento: document.getElementById('descuento').value,
        img1: document.getElementById('img1').value,
        img2: document.getElementById('img2').value,
        img3: document.getElementById('img3').value,
        img4: document.getElementById('img4').value
    };

    try {
        const res = await fetch('http://localhost:3000/api/faldas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });

        if (!res.ok) throw new Error('Error al agregar el producto');

        // Refresca la lista de productos después de agregar uno nuevo
        fetchProducts();

        // Limpia el formulario y cierra el modal
        productForm.reset();
        const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
        modal.hide();
    } catch (error) {
        console.error('Error al agregar el producto:', error);
    }
});