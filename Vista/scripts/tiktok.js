let tiktoks = [];
let editando = false;
let editandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadTiktoks(); // Cargar tiktoks al cargar la página
    document.getElementById('searchInput').addEventListener('input', handleSearch); // Escuchar el input del buscador
});

function handleSearch() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    loadTiktoks(searchQuery); // Filtrar tiktoks por link o videoID
}

function loadTiktoks(searchQuery = '') {
    fetch(`http://localhost:3000/tiktoks?search=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
            tiktoks = data;
            renderTiktokCards(tiktoks); // Mostrar los tiktoks
        })
        .catch(error => console.error('Error al cargar tiktoks:', error));
}

function renderTiktokCards(tiktoks) {
    const container = document.getElementById('tiktokContainer');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar los tiktoks
    if (tiktoks.length === 0) {
        container.innerHTML = '<p>No se encontraron Tiktoks.</p>';
        return;
    }
    tiktoks.forEach(tiktok => {
        const tiktokHtml = `
            <div class="tiktok-card">
                <div>
                    <strong>ID:</strong> ${tiktok.videoID}<br>
                    <a href="${tiktok.link}" target="_blank">Ver Tiktok</a>
                </div>
                <div class="tiktok-actions">
                    <button class="btn-edit btn btn-warning" onclick="editTiktok(${tiktok.id})">Editar</button>
                    <button class="btn-delete btn btn-danger" onclick="deleteTiktok(${tiktok.id})">Eliminar</button>
                </div>
            </div>
        `;
        container.innerHTML += tiktokHtml;
    });
}

function editTiktok(id) {
    const tiktok = tiktoks.find(t => t.id === id);
    if (!tiktok) return alert('Tiktok no encontrado');

    // Llenamos el formulario de edición con los datos del tiktok
    document.getElementById('link').value = tiktok.link;
    document.getElementById('videoID').value = tiktok.videoID;

    document.querySelector('#tiktokForm button[type="submit"]').textContent = 'Guardar cambios';
    document.getElementById('tiktokModalLabel').textContent = 'Editar Tiktok';
    const myModal = new bootstrap.Modal(document.getElementById('tiktokModal'));
    myModal.show();
    editando = true;
    editandoId = id;
}

function deleteTiktok(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este Tiktok?')) return;
    fetch(`http://localhost:3000/tiktoks/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Tiktok eliminado exitosamente');
                loadTiktoks(); // Recargamos los Tiktoks
            }
        })
        .catch(error => console.error('Error al eliminar Tiktok:', error));
}

document.getElementById('tiktokForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const newTiktok = {
        link: document.getElementById('link').value,
        videoID: document.getElementById('videoID').value
    };

    const url = editando ? `http://localhost:3000/tiktoks/${editandoId}` : 'http://localhost:3000/tiktoks';
    const method = editando ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTiktok),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(editando ? 'Tiktok actualizado exitosamente' : 'Tiktok agregado exitosamente');
                resetForm();
                loadTiktoks();
            }
        })
        .catch(error => alert('Error en el servidor: ' + error));
});

function resetForm() {
    document.getElementById('tiktokForm').reset();
    document.querySelector('#tiktokForm button[type="submit"]').textContent = 'Guardar Tiktok';
    document.getElementById('tiktokModalLabel').textContent = 'Agregar Tiktok';
    const myModal = bootstrap.Modal.getInstance(document.getElementById('tiktokModal'));
    myModal.hide();
    editando = false;
    editandoId = null;
}
