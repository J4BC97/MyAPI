const pokeApi = "https://pokeapi.co/api/v2/pokemon?limit=60&offset=0";

function getPokemon(api) {
    fetch(api) // Usa el argumento api en lugar de pokeApi
        .then((response) => response.json())
        .then((json) => {
            pokeData(json.results); // Obtiene los datos de los Pokémon
            pagination(json); // Maneja la paginación
        })
        .catch((error) => {
            console.log(error, "Error consumiendo la API");
        });
}

function pokeData(results) {
    let cards = ""; // Reinicia la variable cards para evitar acumulación de datos
    let promises = []; // Lista de promesas para esperar a que todas las peticiones de fetch se resuelvan

    results.forEach((pokemon) => {
        let pokemonDetails = fetch(pokemon.url) // Hacemos una petición para obtener los detalles del Pokémon
            .then((response) => response.json())
            .then((data) => {
                const sprite = data.sprites.front_default;
                const stats = data.stats
                    .map((stat) => `${stat.stat.name}: ${stat.base_stat}`)
                    .join(", ");
                const species = data.species.name;

                // Agregamos la carta del Pokémon a la variable cards
                cards += `
                <div class="col">
                    <div class="card h-100" style="width: 12rem;">
                        <img src="${sprite}" class="card-img-top" alt="${pokemon.name}">
                        <h2 class="card-title">${pokemon.name}</h2>
                        <div class="card-body">
                            <h5 class="card-title">Stats: ${stats}</h5>
                            <h5 class="card-title">Species: ${species}</h5>
                        </div>
                    </div>
                </div>
                `;
            })
            .catch((error) => console.log(error, "Error obteniendo datos del Pokémon"));

        promises.push(pokemonDetails); // Guardamos la promesa para esperar a que todas se resuelvan
    });

    // Usamos Promise.all para esperar a que todas las peticiones se resuelvan
    Promise.all(promises).then(() => {
        document.getElementById("dataAlbum").innerHTML = cards; // Después de obtener todos los datos, actualizamos el DOM
    });
}

function pagination(json) {
    let prevDisabled = "";
    let nextDisabled = "";

    if (!json.previous) {
        prevDisabled = "disabled";
    }

    if (!json.next) {
        nextDisabled = "disabled";
    }

    let html = `
      <li class="page-item ${prevDisabled}">
        <a class="page-link" href="#" onclick="getPokemon('${json.previous}')">Prev</a>
      </li>
      <li class="page-item ${nextDisabled}">
        <a class="page-link" href="#" onclick="getPokemon('${json.next}')">Next</a>
      </li>
    `;

    document.getElementById("pagination").innerHTML = html;
}

// Llamamos a la función inicial con la URL base
getPokemon(pokeApi);