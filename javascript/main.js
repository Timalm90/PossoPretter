const API_KEY = CONFIG.TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w780";

const img1 = document.querySelector(".img-base");
const img2 = document.querySelector(".img-mirror");

const randomButton = document.getElementById("randomButton");
const modeSelect = document.getElementById("mode");
const searchInput = document.getElementById("search");
const suggestionsDropdown = document.getElementById("suggestions");
const posterSelect = document.getElementById("posterSelect");
const loadingText = document.getElementById("loadingText");
const movieTitle = document.getElementById("movieTitle");
const saveButton = document.getElementById("saveButton");

let suggestionTimeout;
let currentMovieId = null;

async function fetchImageAsBlob(src) {
  const proxied = `http://localhost:5501/${encodeURIComponent(src)}`;
  const res = await fetch(proxied);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

function getContainRect(containerW, containerH, imgW, imgH) {
  const containerAspect = containerW / containerH;
  const imageAspect = imgW / imgH;
  
  let rectW, rectH;
  if (containerAspect > imageAspect) {
    // Image height fills container
    rectH = containerH;
    rectW = rectH * imageAspect;
  } else {
    // Image width fills container
    rectW = containerW;
    rectH = rectW / imageAspect;
  }
  
  // Center in container
  const x = (containerW - rectW) / 2;
  const y = (containerH - rectH) / 2;
  
  return { x, y, w: rectW, h: rectH };
}

function randInt(max){
    return Math.floor(Math.random() * max);
}

function showLoading(message = "Loading movie...") {
    loadingText.textContent = message;
}

function hideLoading() {
    loadingText.textContent = "";
}

function setPoster(path){
    if(!path) return;
    img1.src = IMG + path;
    img2.src = IMG + path;
}

async function getRandomMovie(){
    try {
        // Get a random page from discover results to avoid always getting the same movies
        const randomPage = randInt(500) + 1;
        
        const url = `${BASE}/discover/movie?api_key=${API_KEY}&language=en-US&sort_by=popularity.desc&vote_average.gte=7&with_original_language=en|sv&page=${randomPage}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data.results || data.results.length === 0) {
            // Fallback: retry with different page
            return getRandomMovie();
        }

        // Filter out movies without posters
        const validMovies = data.results.filter(movie => movie.poster_path && !movie.adult);
        
        if (validMovies.length === 0) {
            // Fallback: retry
            return getRandomMovie();
        }

        // Pick a random movie from the valid results
        return validMovies[randInt(validMovies.length)];
    } catch (error) {
        console.error("Error fetching random movie:", error);
        // Fallback to the old method if discover fails
        return getRandomMovieFallback();
    }
}

async function getRandomMovieFallback(){
    // Fallback method if discover API fails
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
    showLoading("Loading movie...");
    currentMovieId = movie.id;
    setPoster(movie.poster_path);
    movieTitle.textContent = movie.title;
    searchInput.value = "";
    searchInput.blur();
    await loadPosterOptions(movie.id);
    hideLoading();
    // Reset zoom on mobile after search
    document.body.style.zoom = "100%";
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
    posterSelect.innerHTML = '<option value="">Alt Poster</option>';

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
    
    showLoading("Loading movie...");

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
    movieTitle.textContent = movie.title;
    searchInput.value = "";
    await loadPosterOptions(movie.id);
    hideLoading();
}

randomButton.onclick = loadMovie;

modeSelect.onchange = loadMovie;

searchInput.addEventListener("input", (e) => {
    clearTimeout(suggestionTimeout);
    const query = e.target.value.trim();
    
    suggestionTimeout = setTimeout(() => {
        getSuggestions(query);
    }, 200);
});

searchInput.addEventListener("keydown", async (e) => {
    if (e.key !== "Enter") return;   

    const title = searchInput.value.trim();
    if (!title) return;

    showLoading("Searching...");
    const movie = await searchMovie(title);
    suggestionsDropdown.innerHTML = "";
    

    if (movie) {
        setPoster(movie.poster_path);
        currentMovieId = movie.id;
        await loadPosterOptions(movie.id);
    }
    hideLoading();
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

// Helper: compute the rendered rect of an object-fit:contain image
// inside its container. Returns { x, y, w, h } in container-local pixels.
function getContainRect(containerW, containerH, imgNatW, imgNatH) {
  const containerRatio = containerW / containerH;
  const imgRatio = imgNatW / imgNatH;
  let w, h;
  if (imgRatio > containerRatio) {
    // Image is wider than container ratio → letterboxed (bars top/bottom)
    w = containerW;
    h = containerW / imgRatio;
  } else {
    // Image is taller → pillarboxed (bars left/right)
    h = containerH;
    w = containerH * imgRatio;
  }
  return {
    x: (containerW - w) / 2,
    y: (containerH - h) / 2,
    w,
    h,
  };
}

async function saveImage() {
  try {
    showLoading("Saving image...");

    const baseImg    = document.querySelector(".img-base");
    const slider     = document.getElementById("slider");
    const leftContainer = document.querySelector(".img-container");

    // --- Fetch images via blob to avoid CORS taint ---
    const [tempBase, tempMirror] = await Promise.all([
      fetchImageAsBlob(baseImg.src),
      fetchImageAsBlob(baseImg.src), // same source for both sides
    ]);

    const imgNatW = tempBase.naturalWidth;
    const imgNatH = tempBase.naturalHeight;

    // --- Screen-space geometry ---
    const container  = document.querySelector(".pair");
    const { width: contW, height: contH } = container.getBoundingClientRect();

    // The actual rendered image rect inside the container (object-fit:contain)
    const rendered = getContainRect(contW, contH, imgNatW, imgNatH);

    // Translate offset: fraction of the *rendered image width*, not the container
    const pct       = (slider.value - 50) / 61;
    const offsetPct = pct * 50; // percentage of the image element box (as CSS applies it)
    const offsetPx  = (offsetPct / 100) * rendered.w; // map to rendered image pixels

    // Clip boundary is at 50% of the container in screen space
    const clipScreenX = contW / 2;

    // Express clip boundary relative to the rendered image's left edge,
    // then scale to native image pixels
    const scale = imgNatW / rendered.w;
    const clipImgX  = (clipScreenX - rendered.x) * scale;
    const offsetImg = offsetPx * scale;

    // --- Canvas at full native resolution ---
    const canvas = document.createElement("canvas");
    canvas.width  = imgNatW;
    canvas.height = imgNatH;
    const ctx = canvas.getContext("2d");

    const leftIsLeft = leftContainer.classList.contains("mask-left");

    function drawSide(side, source, mirrored, translateX) {
      const destX = side === "left" ? 0       : clipImgX;
      const destW = side === "left" ? clipImgX : imgNatW - clipImgX;

      ctx.save();
      ctx.beginPath();
      ctx.rect(destX, 0, destW, imgNatH);
      ctx.clip();

      if (mirrored) {
        // CSS: scaleX(-1) translateX(+offset%)
        // Applied right-to-left: first translate, then flip around x=0
        ctx.translate(imgNatW, 0);
        ctx.scale(-1, 1);
        ctx.translate(translateX, 0);
      } else {
        ctx.translate(translateX, 0);
      }

      ctx.drawImage(source, 0, 0, imgNatW, imgNatH);
      ctx.restore();
    }

    if (leftIsLeft) {
      drawSide("left",  tempBase,   false, offsetImg);
      drawSide("right", tempMirror, true,  offsetImg);
    } else {
      drawSide("left",  tempMirror, true,  offsetImg);
      drawSide("right", tempBase,   false, offsetImg);
    }

    canvas.toBlob((blob) => {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `PossoPretter-${currentMovieId || "image"}.png`;
      
      // Mobile-friendly approach: use try/catch for different methods
      try {
        // Try standard method first
        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        // Fallback for iOS: open in new window
        window.open(link.href, "_blank");
      }
      
      setTimeout(() => {
        URL.revokeObjectURL(link.href);
      }, 100);
      
      showLoading("Image saved!");
      setTimeout(hideLoading, 2000);
    }, "image/png");

  } catch (err) {
    console.error("Error saving image:", err);
    hideLoading();
    alert("Error saving image. Please try again.");
  }
}

saveButton.addEventListener("click", saveImage);

loadMovie();

