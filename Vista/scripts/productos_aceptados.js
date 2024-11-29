fetch('http://localhost:3000/orders/confirmed')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById('orders-table-body');
            
            // Limpiar la tabla antes de agregar nuevos datos
            tableBody.innerHTML = '';

            // Agregar filas de órdenes confirmadas
            data.forEach(order => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${order.id_orden}</td>
                    <td>${order.nombre_cliente}</td>
                    <td>${order.total}</td>
                    <td>${order.estado}</td> <!-- Mostrar el estado de la orden -->
                    <td>${order.fecha_orden}</td>
                    <td>${order.productos}</td>
                `;
                
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error al obtener las órdenes:', error);
        });

// Función de búsqueda de productos
function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('productTable').getElementsByTagName('tr');
    
    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let match = false;
        
        // Recorremos todas las celdas de cada fila
        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(searchQuery)) {
                match = true;
                break;
            }
        }
        
        // Mostrar u ocultar la fila según si se encuentra o no el texto
        row.style.display = match ? '' : 'none';
    }
}

// Agregar el evento de búsqueda al campo de entrada
document.getElementById('searchInput').addEventListener('input', searchProducts);
