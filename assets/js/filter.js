// Función para normalizar el texto
function normalizeText(text) {
    return text
        .toLowerCase() // Convertir a minúsculas
        .normalize('NFD') // Descomponer caracteres acentuados
        .replace(/[\u0300-\u036f]/g, '') // Eliminar marcas de acentuación
        .replace(/[.,;:]/g, '') // Eliminar signos de puntuación
        .replace(/\s+/g, ' '); // Reemplazar múltiples espacios por uno solo
}

function searchCards() {
    const keyword = normalizeText(document.getElementById('keywordInput').value);
    const cards = Array.from(document.querySelectorAll('.card'));
    let matchedCards = [];

    cards.forEach(card => {
        // Obtén los datos relevantes de la tarjeta
        const description = normalizeText(card.dataset.description);
        const department = card.dataset.department ? normalizeText(card.dataset.department) : '';
        const property = JSON.parse(card.dataset.property);

        // Propiedades de la tarjeta
        const nombre = property.nombre ? normalizeText(property.nombre) : '';
        const medida = property.medida ? normalizeText(property.medida) : '';
        const direccion = property.direccion ? normalizeText(property.direccion) : '';
        const clima = property.clima ? normalizeText(property.clima) : '';
        const municipio = property.municipio ? normalizeText(property.municipio) : '';

        // Verifica si alguna propiedad coincide con la palabra clave
        const matchesKeyword =
            description.includes(keyword) ||
            department.includes(keyword) ||
            nombre.includes(keyword) ||
            medida.includes(keyword) ||
            direccion.includes(keyword) ||
            clima.includes(keyword) ||
            municipio.includes(keyword);

        if (matchesKeyword) {
            matchedCards.push(card);
        } else {
            card.style.display = 'none';
        }
    });

    if (matchedCards.length > 0) {
        // Reordena las tarjetas coincidentes en la primera posición
        matchedCards.forEach(card => {
            card.style.display = 'block';
            document.getElementById('contGame').appendChild(card); // Mueve las tarjetas coincidentes al final del contenedor
        });

        // Oculta las tarjetas que no coinciden
        cards.forEach(card => {
            if (!matchedCards.includes(card)) {
                card.style.display = 'none';
            }
        });

        document.getElementById('noResultsMessage').style.display = 'none';
    } else {
        document.getElementById('noResultsMessage').style.display = 'block';
    }
}

// Event Listeners
document.getElementById('searchButton').addEventListener('click', searchCards);
document.getElementById('keywordInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') searchCards();
});
