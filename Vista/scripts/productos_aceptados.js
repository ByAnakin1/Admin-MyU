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