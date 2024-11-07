const API_KEY = "aad3fab1607b552befd9a2ac37e556af";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w200";

let searchTimeout;
let currentType = "movie",
  currentPage = 1,
  currentSort = "popularity.desc",
  currentGenre = "",
  currentYear = "",
  currentLanguage = "",
  isLoading = false,
  hasMoreContent = true;
// Function to fetch data with loading indicator and error handling
async function fetchData(pageIncrement = 0) {
  if (isLoading || !hasMoreContent) return; // Prevent simultaneous requests
  isLoading = true;
  showLoading(); // Show loading spinner when fetching data

  const url = `${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${
    currentPage + pageIncrement
  }&sort_by=${currentSort}&with_genres=${currentGenre}&year=${currentYear}&with_original_language=${currentLanguage}`;

  try {
    const response = await fetch(url);
    
    // Check if the response is ok (status 200-299), else throw error
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // Display the results if data is available
    displayResults(data.results, pageIncrement === 0);
    
    // Update pagination details
    hasMoreContent = data.page < data.total_pages;
    currentPage = data.page;

  } catch (error) {
    console.error("Error fetching data:", error);
    
    // Show error message to the user
    showError("Something went wrong while fetching data. Please try again.");
    
  } finally {
    isLoading = false;  // Mark loading as finished
    hideLoading();      // Hide the loading spinner
  }
}

// Function to show the loading spinner
function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show loading spinner overlay
  }
}

// Function to hide the loading spinner
function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "none"; // Hide loading spinner overlay
  }
}

// Function to show error messages
function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.textContent = message;
    errorMessage.style.display = "block"; // Show error message
  }
}

// Function to hide the error message
function hideError() {
  const errorMessage = document.getElementById("errorMessage");
  if (errorMessage) {
    errorMessage.style.display = "none"; // Hide error message
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function handleScroll() {
  const e = document.getElementById("Btn");
  window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
    !isLoading &&
    hasMoreContent &&
    fetchData(currentPage + 1),
    (e.style.display = window.scrollY > 300 ? "block" : "none");
}

function displayResults(results, clear = true) {
  const contentView = document.getElementById("cv");
  if (!contentView) return;

  if (clear) {
    contentView.innerHTML = "";
  }
  results.forEach((result) => {
    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-container";

    const card = document.createElement("div");
    card.className = "movie-card";

    const posterContainer = document.createElement("div");
    posterContainer.className = "movie-poster-container";

    const infoCard = document.createElement("div");
    infoCard.className = "info-card";

    const releaseDate = new Date(
      result.release_date || result.first_air_date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const rating = result.vote_average.toFixed(1);

    // Fetch runtime and add it to the card
    fetch(`https://api.themoviedb.org/3/movie/${result.id}?api_key=${API_KEY}`)
      .then((response) => response.json())
      .then((data) => {
        const runtime = data.runtime;
        posterContainer.innerHTML = `
                    <img class="movie-poster" src="${IMG_BASE_URL}${
          result.poster_path
        }" alt="${result.title || result.name}">
                    <div class="movie-rating"><span>${rating}</span></div>
                `;
        infoCard.innerHTML = `
                    <h2 class="movie-title">${result.title || result.name}</h2>
                    <div class="movie-release-date-runtime">
                    <p class="movie-release-date">${releaseDate}&nbsp;</p>
                    <p class="movie-runtime" >&nbsp;&nbsp;${runtime} min &nbsp;</p></div>
                    <div class="movie-overview">${result.overview}</div>
                `;
        card.addEventListener("click", () => navigateToDetail(result.id));
        contentView.appendChild(card);
        card.appendChild(posterContainer);
        if (window.innerWidth <= 768) {
          card.appendChild(infoCard);
          contentView.appendChild(card);
        } else {
          movieContainer.appendChild(card);
          movieContainer.appendChild(infoCard);
          contentView.appendChild(movieContainer);
        }
      })
      .catch((error) => console.error("Error:", error));
  });
}
function navigateToDetail(id) {
  window.location.href = `detail.html?id=${id}&type=${currentType}`;
}

function showLoading() {
  document.getElementById("loadingIndicator").style.display = "block";
}

function hideLoading() {
  document.getElementById("loadingIndicator").style.display = "none";
}

function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

function hideError() {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.style.display = "none";
}

async function search(query) {
  if (!query) return hideSearchResults();

  showLoading();
  hideError();
  try {
    const response = await fetch(
      `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}`
    );
    if (!response.ok)
      throw new Error("Network response was not ok " + response.statusText);
    const data = await response.json();
    displaySearchResults(data.results);
    hasMoreContent = data.page < data.total_pages;
    currentPage = data.page;
  } catch (error) {
    console.error("Error:", error);
    showError("Not Found");
  } finally {
    hideLoading();
  }
}

function displaySearchResults(results) {
  const searchResultsContainer = document.querySelector(".search-results");
  searchResultsContainer.innerHTML = "";
  if (results.length > 0) {
    results.forEach((result) => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.onclick = () => navigateToDetail(result.id);
      item.innerHTML = `
                <img src="${IMG_BASE_URL}${
        result.poster_path
      }" class="poster" alt="${result.title || result.name}" />
                <div class="result-info">
                    <span class="title">${result.title || result.name}</span>
                    <span class="year">${new Date(
                      result.release_date || result.first_air_date
                    ).getFullYear()}</span>
                </div>
            `;
      searchResultsContainer.appendChild(item);
    });
    searchResultsContainer.style.display = "block";
  } else {
    searchResultsContainer.style.display = "none";
  }
}

function hideSearchResults() {
  const searchResultsContainer = document.querySelector(".search-results");
  if (searchResultsContainer) {
    searchResultsContainer.innerHTML = "";
    searchResultsContainer.style.display = "none";
  }
}

function handleScroll() {
  const Btn = document.getElementById("Btn");
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
    !isLoading &&
    hasMoreContent
  ) {
    fetchData(1);
  }
  Btn.style.display = window.scrollY > 300 ? "block" : "none";
}
// Set default value to "movie" on page load
const mediaSelect = document.getElementById("mediaSelect");
mediaSelect.value = "movie"; // This sets the default value to "movie"

// Add event listener to handle the change when a new option is selected
mediaSelect.addEventListener("change", (e) => {
  const selectedType = e.target.value;

  // Set the currentType based on the selected option
  if (selectedType === "movie") {
    currentType = "movie";
  } else {
    currentType = "tv";
  }

  // Reset the page and fetch content for the selected type
  currentPage = 1;
  hasMoreContent = true;
  fetchGenres(); // Assuming fetchGenres is defined elsewhere
  fetchData();   // Assuming fetchData is defined elsewhere
});

async function fetchGenres() {
  const genreFilter = document.getElementById("genreFilter");
  if (genreFilter) {
    try {
      const response = await fetch(
        `${BASE_URL}/genre/${currentType}/list?api_key=${API_KEY}`
      );
      if (!response.ok)
        throw new Error("Network response was not ok " + response.statusText);
      const data = await response.json();
      genreFilter.innerHTML = '<option value="">Genre</option>';
      data.genres.forEach((genre) => {
        const option = document.createElement("option");
        option.value = genre.id;
        option.textContent = genre.name;
        genreFilter.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  }
}

async function fetchSortOptions() {
  const sortFilter = document.getElementById("sortFilter");
  if (sortFilter) {
    [
      { value: "popularity.desc", label: "Popularity Descending" },
      { value: "popularity.asc", label: "Popularity Ascending" },
      { value: "vote_average.desc", label: "Rating Descending" },
      { value: "vote_average.asc", label: "Rating Ascending" },
      { value: "primary_release_date.desc", label: "Release Date Descending" },
      { value: "primary_release_date.asc", label: "Release Date Ascending" },
    ].forEach((option) => {
      const selectOption = document.createElement("option");
      selectOption.value = option.value;
      selectOption.textContent = option.label;
      sortFilter.appendChild(selectOption);
    });
  }
}

function populateYearFilter() {
  const yearFilter = document.getElementById("yearFilter");
  if (yearFilter) {
    for (let year = new Date().getFullYear(); year >= 1900; year--) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    }
  }
}
async function fetchLanguages() {
  const languageFilter = document.getElementById("languageFilter");
  if (languageFilter) {
    try {
      const response = await fetch(
        `${BASE_URL}/configuration/languages?api_key=${API_KEY}`
      );
      if (!response.ok)
        throw new Error("Network response was not ok " + response.statusText);
      const data = await response.json();

      // List of languages to prioritize (case-sensitive for matching)
      const prioritizedLanguages = [
        "English", "Hindi", "Tamil", "Telugu", "Bhojpuri"
      ];

      // Separate prioritized languages from others
      const prioritized = [];
      const rest = [];

      data.forEach(language => {
        if (prioritizedLanguages.includes(language.english_name)) {
          prioritized.push(language);
        } else {
          rest.push(language);
        }
      });

      // Sort the remaining languages alphabetically
      rest.sort((a, b) => a.english_name.localeCompare(b.english_name));

      // Combine prioritized languages with the rest
      const sortedLanguages = [...prioritized, ...rest];

      // Clear the existing options and set the default option
      languageFilter.innerHTML = '<option value="">Language</option>';

      // Add the sorted options
      sortedLanguages.forEach((language) => {
        const option = document.createElement("option");
        option.value = language.iso_639_1;
        option.textContent = language.english_name;
        languageFilter.appendChild(option);
      });
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const sortFilter = document.getElementById("sortFilter");
  const genreFilter = document.getElementById("genreFilter");
  const yearFilter = document.getElementById("yearFilter");
  const languageFilter = document.getElementById("languageFilter");

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => search(e.target.value), 300);
  });

  searchButton.addEventListener("click", () => search(searchInput.value));

  sortFilter.addEventListener("change", (e) => {
    currentSort = e.target.value;
    currentPage = 1;
    hasMoreContent = true;
    fetchData();
  });

  genreFilter.addEventListener("change", (e) => {
    currentGenre = e.target.value;
    currentPage = 1;
    hasMoreContent = true;
    fetchData();
  });

  yearFilter.addEventListener("change", (e) => {
    currentYear = e.target.value;
    currentPage = 1;
    hasMoreContent = true;
    fetchData();
  });

  languageFilter.addEventListener("change", (e) => {
    currentLanguage = e.target.value;
    currentPage = 1;
    hasMoreContent = true;
    fetchData();
  });
  fetchSortOptions();
  fetchGenres();
  fetchLanguages();
  populateYearFilter();
  fetchData();

  window.addEventListener("scroll", handleScroll);
});
// Show the loading spinner
function showLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "flex"; // Show spinner
  }
}

// Hide the loading spinner
function hideLoading() {
  const loadingOverlay = document.getElementById("loadingOverlay");
  if (loadingOverlay) {
    loadingOverlay.style.display = "none"; // Hide spinner
  }
}