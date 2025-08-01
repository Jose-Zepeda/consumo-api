

async function GetDatos()
{
  const res = await fetch('https://anapioficeandfire.com/api/books');
    const datos = await res.json();
    dibujarCartas(datos);
    console.log(datos);
}

function dibujarCartas(datos) {
    const galleria = document.querySelector('.gallery');
    let htmlDatos = '';

    datos.forEach((dato) => {

        const bookId = dato.url.split('/').pop();

        htmlDatos += `
            <div class="card">
                <h2>${dato.name}</h2>
                <p><strong>Editor:</strong> ${dato.publisher}</p>
                <p><strong>No. paginas:</strong> ${dato.numberOfPages}</p>
                

                <button class="btn btn-light mt-auto" 
                        onclick="viewMore(${bookId})" 
                        data-bs-toggle="modal" 
                        data-bs-target="#bookDetailModal">
                    Ver más
                </button>
            </div>
        `;
    });

    galleria.innerHTML = htmlDatos;
}


async function viewMore(bookId) {
    console.log("Cargando detalles para el libro ID:", bookId);


    const modalTitle = document.getElementById('modalBookTitle');
    const modalBody = document.getElementById('modalBookBody');


    modalTitle.innerText = 'Cargando...';
    modalBody.innerHTML = '<p>Obteniendo detalles del libro...</p>';

    try {

        const res = await fetch(`https://anapioficeandfire.com/api/books/${bookId}`);
        if (!res.ok) {
            throw new Error(`Error en la API: ${res.status}`);
        }
        const detalles = await res.json();


        const fechaLanzamiento = new Date(detalles.released).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

 
        modalTitle.innerText = detalles.name;
        modalBody.innerHTML = `
            <p><strong>ISBN:</strong> ${detalles.isbn}</p>
            <p><strong>Autores:</strong> ${detalles.authors.join(', ')}</p>
            <p><strong>País:</strong> ${detalles.country}</p>
            <p><strong>Tipo de medio:</strong> ${detalles.mediaType}</p>
            <p><strong>Fecha de lanzamiento:</strong> ${fechaLanzamiento}</p>
            <p><strong>Total de personajes que aparecen:</strong> ${detalles.characters.length}</p>
        `;

    } catch (error) {
        console.error(`Error al cargar los detalles del libro ${bookId}:`, error);
        modalTitle.innerText = 'Error';
        modalBody.innerHTML = '<p>No se pudieron cargar los detalles. Por favor, inténtalo de nuevo más tarde.</p>';
    }
}
GetDatos();