<h1 align="center">
PossopRetter
</h1>
<p align="center">
<p align="center">

  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-yellow?logo=javascript">

<p align="center">

https://webbegrim.se/posterposter/

Load a movie poster and explore its mirrored perspective in real-time. Adjust the mirror point with an interactive slider, reverse the view, and discover movies through multiple discovery modes.

##  Features

- **Multiple Discovery Modes**: Browse movies by Popular, Random, Top Rated, or Now Playing categories
- **Search Functionality**: Find specific movies by title using the integrated search bar
- **Interactive Slider**: Smoothly transition between two mirrored views of the movie poster
- **Reverse Toggle**: Swap the left and right image panels with a single click
- **Random Refresh**: Load a new random movie with the Refresh button

##  Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for TMDB API access)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Timalm90/PossoPretter.git
   ```

2. Open `index.html` in your web browser or serve it with a local server:
   ```bash
   python -m http.server 8000
   ```

3. Navigate to `http://localhost:8000` in your browser

##  How to Use

1. **Select a Discovery Mode**: Use the dropdown menu to choose between:
   - **Popular**: Currently trending movies
   - **Random**: Completely random movie selection
   - **Top Rated**: Highest-rated movies
   - **Now Playing**: Movies currently in theaters

2. **Search for Movies**: Type a movie title in the search bar and press Enter to find a specific film

3. **Use the Slider**: Drag the slider below the movie posters to smoothly transition between the two mirrored views

4. **Reverse the View**: Click the "Reverse" button to swap the left and right panels

5. **Refresh**: Click the "Refresh" button to load a new movie in the current mode

##  Technologies Used

- **HTML5**: Semantic markup and responsive structure
- **CSS3**: Modern styling with flexbox and animations
- **Vanilla JavaScript**: Pure JS for interactivity (no frameworks)
- **TMDB API**: The Movie Database API for movie data and posters

##  Project Structure

```
PossoPretter/
├── index.html           # Main HTML file
├── javascript/
│   ├── main.js         # API calls and movie loading logic
│   └── imgrvrs.js      # Image slider and reverse toggle functionality
├── resources/
│   ├── style.css       # Stylesheet
│   └── img/            # Image assets
├── README.md           # This file
└── LICENSE
```

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  About

PossoPretter was created as a school assignment exploring web APIs and interactive UI design.
