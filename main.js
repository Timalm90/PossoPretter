const API_KEY = "222b074ef12e930e8324992aa11d38da";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/original";

const img1 = document.querySelector(".img-base");
const img2 = document.querySelector(".img-mirror");

const randomButton = document.getElementById("randomButton");
const modeSelect = document.getElementById("mode");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");


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
    setPoster(movie.poster_path);
}

randomButton.onclick = loadMovie;

modeSelect.onchange = loadMovie;

searchButton.onclick = async () => {
    const title = searchInput.value.trim();
    if(!title) return;

    const movie = await searchMovie(title);
    if(movie) setPoster(movie.poster_path);
};

searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;   

    const title = searchInput.value.trim();
    if (!title) return;

    const movie = await searchMovie(title);

    if (movie) {
        setPoster(movie.poster_path);
    }
});


loadMovie();

