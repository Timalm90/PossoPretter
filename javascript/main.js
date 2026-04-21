const API_KEY = "222b074ef12e930e8324992aa11d38da";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/original";

const img1 = document.querySelector(".img-base");
const img2 = document.querySelector(".img-mirror");

const randomButton = document.getElementById("randomButton");
const modeSelect = document.getElementById("mode");
const searchInput = document.getElementById("search");
const suggestionsDropdown = document.getElementById("suggestions");
const posterSelect = document.getElementById("posterSelect");

let suggestionTimeout;
let currentMovieId = null;

function randInt(max){
    return Math.floor(Math.random() * max);
}

function setPoster(path){
    if(!path) return;
    img1.src = IMG + path;
    img2.src = IMG + path;
}

async function getRandomMovie(){
    while(true){
        const id = randInt(1200000) + 1;
        const res = await fetch(`${BASE}/movie/${id}?api_key=${API_KEY}&language=en-US`);
        const movie = await res.json();

        if(movie.status_code) continue; 
        if(movie.adult) continue;      
        if(!movie.poster_path) continue;
        if (movie.original_language !== "en" && movie.original_language !== "sv") continue;
        if(movie.vote_average <= 7) continue;

        return movie;
    }
}
    
    async function getMovieFromList(type){
    const res = await fetch(`${BASE}/movie/${type}?api_key=${API_KEY}&language=en-US`);
    const data = await res.json();

    const list = data.results;

    return list[randInt(list.length)];
}

async function searchMovie(title){
  const url =
    `${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=` +
    encodeURIComponent(title);

    const res = await fetch(url);
    const data = await res.json();

    if(!data.results.length){
        alert("No movie found!");
        return null;
    }

    return data.results[0]; 
}

async function getSuggestions(query) {
  if (!query.trim()) {
    suggestionsDropdown.innerHTML = "";
    return;
  }

  try {
    const url = `${BASE}/search/movie?api_key=${API_KEY}&language=en-US&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    const data = await res.json();

    suggestionsDropdown.innerHTML = "";

    if (!data.results.length) {
      return;
    }

    const suggestions = data.results.slice(0, 8);

    suggestions.forEach((movie) => {
      const li = document.createElement("li");
      li.className = "suggestion-item";
      li.innerHTML = `
        <span class="suggestion-title">${movie.title}</span>
        <span class="suggestion-year">${movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}</span>
      `;
      
      li.addEventListener("click", () => {
        searchInput.value = movie.title;
        suggestionsDropdown.innerHTML = "";
        loadMovieFromSuggestion(movie);
      });

      suggestionsDropdown.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
  }
}

async function loadMovieFromSuggestion(movie) {
  if (movie.poster_path) {
    currentMovieId = movie.id;
    setPoster(movie.poster_path);
    searchInput.value = "";
    await loadPosterOptions(movie.id);
  } else {
    alert("This movie doesn't have a poster available!");
  }
}

async function loadPosterOptions(movieId) {
  try {
    const url = `${BASE}/movie/${movieId}/images?api_key=${API_KEY}`;
    const res = await fetch(url);
    const data = await res.json();

    // Clear previous posters
    posterSelect.innerHTML = '<option value="">Select a poster...</option>';

    if (!data.posters || data.posters.length === 0) {
      posterSelect.style.display = "none";
      return;
    }

    // Filter for English posters only
    const englishPosters = data.posters.filter(poster => poster.iso_639_1 === "en");

    if (englishPosters.length === 0) {
      posterSelect.style.display = "none";
      return;
    }

    posterSelect.style.display = "block";
    
    const posters = englishPosters.slice(0, 10);

    posters.forEach((poster, index) => {
      const option = document.createElement("option");
      option.value = poster.file_path;
      option.textContent = `Poster ${index + 1}`;
      posterSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching poster options:", error);
    posterSelect.style.display = "none";
  }
}

async function loadMovie(){
    const mode = modeSelect.value;

    let movie = null;

    if(mode === "random"){
        movie = await getRandomMovie();
    }
    else {
        movie = await getMovieFromList(mode);
    }

    console.log("Loaded:", movie.title);
    currentMovieId = movie.id;
    setPoster(movie.poster_path);
    searchInput.value = "";
    await loadPosterOptions(movie.id);
}

randomButton.onclick = loadMovie;

modeSelect.onchange = loadMovie;

searchInput.addEventListener("input", (e) => {
    clearTimeout(suggestionTimeout);
    const query = e.target.value.trim();
    
    suggestionTimeout = setTimeout(() => {
        getSuggestions(query);
    }, 300);
});

searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;   

    const title = searchInput.value.trim();
    if (!title) return;

    const movie = await searchMovie(title);
    suggestionsDropdown.innerHTML = "";
    

    if (movie) {
        setPoster(movie.poster_path);
    }
});

document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-container")) {
        suggestionsDropdown.innerHTML = "";
    }
});

posterSelect.addEventListener("change", (e) => {
    const posterPath = e.target.value;
    if (posterPath) {
        setPoster(posterPath);
    }
});

loadMovie();

