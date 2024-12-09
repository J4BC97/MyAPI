const apiUrl = "https://api.jikan.moe/v4/anime";

function loadDefaultAnimes() {
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => displayAnimeResults(data.data || []))
        .catch((error) => console.error("Error al cargar los animes por defecto:", error));
}


function searchAnime() {
    const query = document.getElementById("searchBar").value.trim();

    fetch(`${apiUrl}?q=${query}`)
        .then((response) => response.json())
        .then((data) => displayAnimeResults(data.data || []))
        .catch((error) => console.error("Error al realizar la búsqueda:", error));
}


function displayAnimeResults(animeList) {
    document.getElementById("dataAlbum").innerHTML = animeList
        .map(
            ({ title, episodes, url, images }) => `
            <div class="col">
                <div class="card h-100">
                    <img src="${images?.jpg?.image_url}" class="card-img-top" alt="${title}">
                    <div class="card-body" style="color: black;">
                        <h5 class="card-title">${title}</h5>
                        <p class="card-text">Episodios: ${episodes || "N/A"}</p>
                        <a href="${url}" class="btn btn-primary" target="_blank">Más información</a>
                    </div>
                </div>
            </div>`
        )
        .join("");
}

document.getElementById("searchBar").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchAnime(); 
    }
});

loadDefaultAnimes();