let banners = [];
let editando = false;
let editandoId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadBanners(); // Cargar banners al cargar la página
    document.getElementById('searchInput').addEventListener('input', handleSearch); // Escuchar el input del buscador
});

function handleSearch() {
    const searchQuery = document.getElementById('searchInput').value.trim();
    loadBanners(searchQuery);  // Filtrar banners por tipo
}

function loadBanners(searchQuery = '') {
    fetch(`http://localhost:3000/banners?search=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
        banners = data;
        renderBannerCards(banners); // Mostrar los banners
    })
    .catch(error => console.error('Error al cargar banners:', error));
}

function renderBannerCards(banners) {
    const container = document.getElementById('bannerContainer');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar los banners
    if (banners.length === 0) {
        container.innerHTML = '<p>No se encontraron banners.</p>';
        return;
    }
    banners.forEach(banner => {
        const bannerHtml = `
            <div class="banner-card">
                <img src="${banner.img1}" alt="${banner.tipo}" class="banner-img">
                <div class="banner-info">
                    <h2>${banner.tipo}</h2>
                </div>
                <div class="banner-actions">
                    <button class="btn-edit btn btn-warning" onclick="editBanner(${banner.id_banner})">Editar</button>
                    <button class="btn-delete btn btn-danger" onclick="deleteBanner(${banner.id_banner})">Eliminar</button>
                </div>
            </div>
        `;
        container.innerHTML += bannerHtml;
    });
}

function editBanner(id_banner) {
    const banner = banners.find(b => b.id_banner === id_banner);
    if (!banner) return alert('Banner no encontrado');

    // Llenamos el formulario de edición con los datos del banner
    document.getElementById('tipo').value = banner.tipo;  // Aquí asignamos el tipo, puede ser "inicio", "novedades" o "ninguno"
    document.getElementById('img1').value = banner.img1;
    document.getElementById('img2').value = banner.img2;
    document.getElementById('img3').value = banner.img3;
    document.getElementById('img1cell').value = banner.img1cell;
    document.getElementById('img2cell').value = banner.img2cell;
    document.getElementById('img3cell').value = banner.img3cell;

    document.querySelector('#bannerForm button[type="submit"]').textContent = 'Guardar cambios';
    document.getElementById('bannerModalLabel').textContent = 'Editar Banner';
    const myModal = new bootstrap.Modal(document.getElementById('bannerModal'));
    myModal.show();
    editando = true;
    editandoId = id_banner;
}


function deleteBanner(id_banner) {
    if (!confirm('¿Estás seguro de que deseas eliminar este banner?')) return;
    fetch(`http://localhost:3000/banners/${id_banner}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Banner eliminado exitosamente');
            loadBanners(); // Recargamos los banners
        }
    })
    .catch(error => console.error('Error al eliminar banner:', error));
}

document.getElementById('bannerForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const newBanner = {
        tipo: document.getElementById('tipo').value,
        img1: document.getElementById('img1').value,
        img2: document.getElementById('img2').value,
        img3: document.getElementById('img3').value,
        img1cell: document.getElementById('img1cell').value,
        img2cell: document.getElementById('img2cell').value,
        img3cell: document.getElementById('img3cell').value
    };

    const url = editando ? `http://localhost:3000/banners/${editandoId}` : 'http://localhost:3000/banners';
    const method = editando ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBanner),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(editando ? 'Banner actualizado exitosamente' : 'Banner agregado exitosamente');
            resetForm();
            loadBanners();
        }
    })
    .catch(error => alert('Error en el servidor: ' + error));
});

function resetForm() {
    document.getElementById('bannerForm').reset();
    document.querySelector('#bannerForm button[type="submit"]').textContent = 'Guardar Banner';
    document.getElementById('bannerModalLabel').textContent = 'Agregar Banner';
    const myModal = bootstrap.Modal.getInstance(document.getElementById('bannerModal'));
    myModal.hide();
    editando = false;
    editandoId = null;
}
