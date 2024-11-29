async function fetchOrders() {
    try {
        const response = await fetch('http://localhost:3000/orders');
        const orders = await response.json();

        if (!orders || orders.length === 0) {
            alert('No se encontraron órdenes.');
            return;
        }

        const orderTableBody = document.getElementById('orderTable');
        orderTableBody.innerHTML = '';

        orders.forEach(order => {
            const row = `
                <tr data-order-id="${order.id_orden}">
                    <td>${order.id_orden}</td>
                    <td>${order.nombre_cliente}</td>
                    <td>${order.total}</td>
                    <td>${order.productos}</td>
                    <td>${new Date(order.fecha_orden).toLocaleDateString()}</td>
                    <td class="order-status">${order.estado}</td>
                    <td>
                        <button class="btn btn-primary btn-sm" onclick="updateOrderStatus(${order.id_orden}, 'confirm')">Confirmar</button>
                        <button class="btn btn-danger btn-sm" onclick="updateOrderStatus(${order.id_orden}, 'reject')">Rechazar</button>
                    </td>
                </tr>
            `;
            orderTableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error al obtener las órdenes:', error);
        alert('Hubo un problema al cargar las órdenes.');
    }
}

async function updateOrderStatus(orderId, action) {
    try {
        const status = action === 'confirm' ? 'Confirmada' : 'Rechazado';

        // Enviar la solicitud PUT para actualizar el estado de la orden
        const response = await fetch(`http://localhost:3000/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: status }),  // Enviar el nuevo estado
        });

        if (!response.ok) {
            alert('Error al actualizar el estado de la orden.');
            return;
        }

        // Actualizar la tabla con el nuevo estado
        const orderRow = document.querySelector(`[data-order-id="${orderId}"]`);
        const statusCell = orderRow.querySelector('.order-status');
        statusCell.textContent = status;

        alert(`Orden ${status}`);
    } catch (error) {
        console.error('Error al actualizar el estado de la orden:', error);
        alert('Hubo un problema al actualizar el estado de la orden.');
    }
}

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

    
// Cargar las órdenes cuando la página termine de cargar
window.onload = fetchOrders;