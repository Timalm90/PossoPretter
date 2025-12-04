const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: '222b074ef12e930e8324992aa11d38da'
  }
};

fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));


 
  
/*
  🎬 Image URLs

TMDB image paths must be combined with the base URL:

const imgUrl = "https://image.tmdb.org/t/p/w500" + movie.poster_path;
*/

