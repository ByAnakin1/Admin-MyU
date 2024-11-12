// scripts/reportes.js

// Variables para almacenar los gráficos
let productosChart = null;
let productosPizza = null;

// Función para obtener los datos de productos por categoría y accesorio
function obtenerDatos() {
    fetch('http://localhost:3000/reportes/todos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos del servidor');
            }
            return response.json();
        })
        .then(data => {
            const categorias = data.categorias.map(item => item.nombre);
            const cantidadesCategorias = data.categorias.map(item => item.cantidad);

            const accesorios = data.accesorios.map(item => item.nombre);
            const cantidadesAccesorios = data.accesorios.map(item => item.cantidad);

            // Calcular totales de productos
            const totalProductosCategorias = cantidadesCategorias.reduce((acc, curr) => acc + curr, 0);
            const totalProductosAccesorios = cantidadesAccesorios.reduce((acc, curr) => acc + curr, 0);

            // Actualizar las tablas
            actualizarTabla('tablaCategorias', data.categorias);
            actualizarTabla('tablaAccesorios', data.accesorios);

            // Actualizar los gráficos
            actualizarGraficoBarras(categorias, cantidadesCategorias);
            actualizarGraficoPizza(accesorios, cantidadesAccesorios);

            // Actualizar cuadro de resumen con totales
            actualizarResumen(data.categorias.length, data.accesorios.length, totalProductosCategorias, totalProductosAccesorios);
            actualizarUltimaActualizacion();
        })
        .catch(error => {
            console.error('Error al obtener datos:', error);
        });
}

function actualizarTabla(idTabla, datos) {
    const tbody = document.getElementById(idTabla).getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    datos.forEach((item, index) => {
        const fila = `<tr class="${index % 2 === 0 ? 'table-light' : ''}"><td>${item.nombre}</td><td>${item.cantidad}</td></tr>`;
        tbody.innerHTML += fila;
    });
}

function actualizarGraficoBarras(categorias, cantidades) {
    const ctx = document.getElementById('productosChartCategorias').getContext('2d');

    if (productosChart) {
        productosChart.destroy();
    }

    productosChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categorias,
            datasets: [{
                label: 'Cantidad de productos por Categoría',
                data: cantidades,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    ticks: {
                        maxRotation: 45,
                        minRotation: 45
                    }
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function actualizarGraficoPizza(accesorios, cantidades) {
    const ctx = document.getElementById('productosPizza').getContext('2d');

    if (productosPizza) {
        productosPizza.destroy();
    }

    productosPizza = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: accesorios,
            datasets: [{
                label: 'Cantidad de productos por Accesorio',
                data: cantidades,
                backgroundColor: [
                    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
                    '#00FFFF', '#800000', '#008000', '#000080', '#808000', 
                    '#800080', '#008080', '#FF5733', '#33FF57', '#5733FF', 
                    '#FFD700', '#FF4500', '#32CD32', '#1E90FF', '#FF1493'
                ],
                borderColor: '#ffffff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Actualizar cuadro de resumen
function actualizarResumen(totalCategorias, totalAccesorios, totalProductosCategorias, totalProductosAccesorios) {
    document.getElementById('totalCategorias').textContent = totalCategorias;
    document.getElementById('totalAccesorios').textContent = totalAccesorios;
    document.getElementById('totalProductosCategorias').textContent = totalProductosCategorias;
    document.getElementById('totalProductosAccesorios').textContent = totalProductosAccesorios;
}

function actualizarUltimaActualizacion() {
    const fecha = new Date();
    document.getElementById('lastUpdate').textContent = fecha.toLocaleString();
}

// Llamar a la función para obtener los datos al cargar la página
obtenerDatos();
setInterval(obtenerDatos, 30000);
