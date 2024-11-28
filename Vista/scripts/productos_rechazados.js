document.addEventListener('DOMContentLoaded', () => {
    const ordersTable = document.getElementById('rejectedOrders');

    // Función para obtener los datos de órdenes rechazadas
    async function fetchRejectedOrders() {
        try {
            const response = await fetch('http://localhost:3000/orders/rejected');
            if (!response.ok) {
                throw new Error('Error al obtener las órdenes rechazadas');
            }

            const orders = await response.json();

            // Limpiar la tabla antes de llenarla
            ordersTable.innerHTML = '';

            // Llenar la tabla con los datos
            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.id_orden}</td>
                    <td>${order.nombre_cliente}</td>
                    <td>${order.total}</td>
                    <td>${order.productos}</td>
                    <td>${order.fecha_orden}</td>
                    <td>${order.estado}</td>
                `;
                ordersTable.appendChild(row);
            });
        } catch (error) {
            console.error(error);
            ordersTable.innerHTML = '<tr><td colspan="6">Error al cargar las órdenes rechazadas</td></tr>';
        }
    }

    // Llamar a la función para cargar las órdenes
    fetchRejectedOrders();
});