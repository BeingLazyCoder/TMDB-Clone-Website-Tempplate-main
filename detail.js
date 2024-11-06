const API_KEY = "aad3fab1607b552befd9a2ac37e556af";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

// Show Loading Indicator
function showLoading() {
  document.getElementById("loadingIndicator").style.display = "block";
  document.getElementById("detail-content").style.display = "none";
}

// Hide Loading Indicator
function hideLoading() {
  document.getElementById("loadingIndicator").style.display = "none";
  document.getElementById("detail-content").style.display = "block";
}

// Show Error Message
function showError(message) {
  const errorMessage = document.getElementById("errorMessage");
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
  hideLoading();
}

// Fetch Movie/Show Details
async function fetchDetails(id, type) {
  showLoading();
  try {
    const url = `${BASE_URL}/${type}/${id}?api_key=${API_KEY}&append_to_response=videos`;
    console.log("Fetching URL:", url);
    const response = await fetch(url);

    if (!response.ok)
      throw new Error("Network response was not ok " + response.statusText);

    const data = await response.json();
    displayDetails(data, type);
    toggleTrailer(type, id,1);
  } catch (error) {
    console.error("Error fetching details:", error);
    showError("Failed to fetch details. Please try again later.");
  } finally {
    hideLoading();
  }
}
// Display Movie/Show Details
function displayDetails(data, type) {
  const posterUrl = data.poster_path
    ? `${IMG_BASE_URL}${data.poster_path}`
    : "";
  const titleOrName = data.title || data.name;
  const releaseDate = new Date(
    data.release_date || data.first_air_date
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const language = data.original_language
    ? data.original_language.toUpperCase()
    : "N/A";
  const overview = data.overview || "No overview available.";
  const genres = data.genres
    ? data.genres.map((genre) => genre.name).join(", ")
    : "N/A";
  const ratings = data.vote_average ? data.vote_average.toFixed(1) : "N/A";
  const popularity = data.popularity ? data.popularity.toFixed(1) : "N/A";
  const budget = data.budget ? `$${data.budget.toLocaleString()}` : "N/A";
  const revenue = data.revenue ? `$${data.revenue.toLocaleString()}` : "N/A";
  const runtime =
    type === "movie"
      ? `${data.runtime || "N/A"} min`
      : `${
          data.episode_run_time ? data.episode_run_time[0] : "N/A"
        } min/episode`;

  document.title = `${titleOrName} - Stream Now on JioStream`;
  document.getElementById("detail-poster").src = posterUrl;
  document.getElementById("detail-title").textContent = ` ${titleOrName}`;
  document.getElementById("detail-meta").innerHTML = `<i class="fa-solid fa-calendar-days"></i> Release Date: ${releaseDate}`;
  document.getElementById("detail-overview").innerHTML = `<i class="fa-solid fa-book-open"></i> Overview : ${overview}`;
  document.getElementById("detail-language").innerHTML = `<i class="fa-solid fa-globe"></i> Language: ${language}`;
  document.getElementById("detail-type").innerHTML = `<i class="fa-solid fa-film"></i> Type: ${type.toUpperCase()}`;
  document.getElementById("detail-runtime").innerHTML = `<i class="fa-regular fa-clock"></i> Runtime: ${runtime}`;
  document.getElementById("detail-genres").innerHTML = `<i class="fa-solid fa-tags"></i> Genres: ${genres}`;
  document.getElementById("detail-ratings").innerHTML = `<i class="fa-solid fa-star"></i> Ratings: ${ratings}`;
  document.getElementById("detail-popularity").innerHTML = `<i class="fa-solid fa-users"></i> Popularity: ${popularity}`;
  document.getElementById("detail-budget").innerHTML = `<i class="fa-solid fa-money-bill-wave"></i> Budget: ${budget}`;
  document.getElementById("detail-revenue").innerHTML = `<i class="fa-solid fa-chart-line"></i> Revenue: ${revenue}`;
    
}
// Toggle Trailer Function based on selected dropdown value
function toggleTrailer(type, id, sourceIndex) {
  const trailerContainers = document.querySelectorAll(".trailer-container");
  trailerContainers.forEach((container, index) => {
    if (index + 1 === sourceIndex) {
      let trailerUrl = "";
      switch (sourceIndex) {
        case 1:
          trailerUrl =
            type === "movie"
              ? `https://vidsrc.dev/embed/movie/${id}`
              : `https://vidsrc.dev/embed/tv/${id}/1/1`;
          break;
        case 2:
          trailerUrl = `https://hnembed.cc/embed/${type}/${id}`;
          break;
        case 3:
          trailerUrl = `https://multiembed.mov/?video_id=${id}&tmdb=1${
            type === "tv" ? "&s=1&e=1" : ""
          }`;
          break;
        case 4:
          trailerUrl =
            type === "movie"
              ? `https://vidlink.pro/movie/${id}`
              : `https://vidlink.pro/tv/${id}/1/1`;
          break;
          case 5:
          trailerUrl =
            type === "movie"
              ? `https://www.embedsoap.com/embed/movie/${id}`
              : `https://www.embedsoap.com/embed/tv/${id}/1/1`;
          break;
          case 6:
          trailerUrl =
            type === "movie"
              ? `https://player.autoembed.cc/embed/movie/${id}`
              : `https://player.autoembed.cc/embed/tv/${id}/1/1`;
          break;
          case 7:
          trailerUrl =
            type === "movie"
              ? `https://player.smashy.stream/movie/${id}`
              : `https://player.smashy.stream/tv/${id}/1/1`;
          break;
          case 8:
          trailerUrl =
            type === "movie"
              ? `https://embed.su/embed/movie/${id}`
              : `https://embed.su/embed/tv/${id}/1/1`;
          break;
          case 9:
          trailerUrl =
            type === "movie"
              ? `https://multiembed.mov/?video_id=${id}&tmdb=1`
              : `https://multiembed.mov/?vidro_id=${id}/1/1`;
          break;
          case 10:
          trailerUrl =
            type === "movie"
              ? `https://moviee.tv/embed/movie/${id}`
              : `https://moviee.tv/tv/${id}/1/1`;
          break;
          case 11:
          trailerUrl =
            type === "movie"
              ? `https://moviesapi.club/movie/${id}`
              : `https://movieapi.club/tv/${id}/1/1`;
          break;
      }
      container.innerHTML = `<iframe src="${trailerUrl}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      container.classList.add("active");
    } else {
      container.classList.remove("active");
      container.innerHTML = "";
    }
  });
}

// Fetch Related Content (for both movie and tv)
async function fetchRelatedContent(id, type) {
  try {
    const url = `${BASE_URL}/${type}/${id}/recommendations?api_key=${API_KEY}`;
    const response = await fetch(url);
    if (!response.ok)
      throw Error("Network response was not ok " + response.statusText);
    const data = await response.json();
    displayRelatedContent(data.results.slice(0,16), type);
  } catch (error) {
    console.error("Error fetching related content:", error);
    showError("Failed to fetch related content.");
  }
}

// Display Related Content
function displayRelatedContent(items, type) {
  const relatedGrid = document.getElementById("related-grid");
  relatedGrid.innerHTML = "";

  items.forEach((item) => {
    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-container";

    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const posterContainer = document.createElement("div");
    posterContainer.className = "movie-poster-container";
    const posterUrl = item.poster_path
      ? `${IMG_BASE_URL}${item.poster_path}`
      : "";
    const rating = item.vote_average.toFixed(1);

    posterContainer.innerHTML = `
            <img class="movie-poster" src="${posterUrl}" alt="${
      item.title || item.name
    }" loading="lazy">
            <div class="movie-rating">${rating}</div>
        `;

    const infoCard = document.createElement("div");
    infoCard.className = "info-card";
    const releaseDate = new Date(
      item.release_date || item.first_air_date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    infoCard.innerHTML = `
            <h2 class="movie-title">${item.title || item.name}</h2>
            <div class="movie-release-date-runtime">
                <p class="movie-release-date">${releaseDate}&nbsp;</p>
                <p class="movie-runtime">${
                  type === "movie" ? "N/A" : "N/A"
                } min</p>
            </div>
            <div class="movie-overview">${
              item.overview || "No overview available."
            }</div>
        `;

    movieCard.appendChild(posterContainer);
    movieCard.appendChild(infoCard);
    movieContainer.appendChild(movieCard);
    relatedGrid.appendChild(movieContainer);

    movieCard.addEventListener("click", () => {
      window.location.href = `detail.html?id=${item.id}&type=${type}`;
    });
  });
}

// Initialize on Page Load
document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  const type = urlParams.get("type");

  if (id && type) {
    fetchDetails(id, type);
    fetchRelatedContent(id, type);
  } else {
    showError(
      "Invalid URL parameters. Please go back to the home page and try again."
    );
  }
  const dropdownMenu = document.getElementById("dropdown-menu");
  dropdownMenu.addEventListener("change", function () {
    const selectedValue = dropdownMenu.value;
    toggleTrailer(type, id, getTrailerIndex(selectedValue));
  });
});

// Get the index of the trailer container based on the source type
function getTrailerIndex(sourceType) {
  switch (sourceType) {
    case "Vidsrc 4K":
      return 1;
    case "HnEmbed":
      return 2;
    case "MultiEmbed":
      return 3;
    case "VidLink":
      return 4;
      case "EmbedSoap":
      return 5;
    case "AutoEmbed":
      return 6;
      case "Smashy Stream":
      return 7;
      case "Embed.su":
        return 8;
        case "DirectStream":
          return 9;
          case "Moviee":
          return 10;
          case "MovieApi":
            return 11
  }
}

function displayRelatedContent(items, type) {
  const relatedGrid = document.getElementById("related-grid");
  relatedGrid.innerHTML = ""; // Clear previous content

  items.forEach((item) => {
    // Container setup for movie card
    const movieContainer = document.createElement("div");
    movieContainer.className = "movie-container";

    // Card element with poster and rating
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    // Poster and rating setup
    const posterContainer = document.createElement("div");
    posterContainer.className = "movie-poster-container";
    const posterUrl = item.poster_path
      ? `${IMG_BASE_URL}${item.poster_path}`
      : "";
    const rating = item.vote_average.toFixed(1);

    posterContainer.innerHTML = `
          <img class="movie-poster" src="${posterUrl}" alt="${
      item.title || item.name
    }" loading="lazy">
          <div class="movie-rating">${rating}</div>
      `;

    // Info card setup with title, release date, and overview
    const infoCard = document.createElement("div");
    infoCard.className = "info-card";
    const releaseDate = new Date(
      item.release_date || item.first_air_date
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    // Placeholder for runtime; will be updated if fetched
    let runtimeText = "N/A";

    // If type is "movie", fetch the runtime
    if (type === "movie") {
      fetch(`https://api.themoviedb.org/3/movie/${item.id}?api_key=${API_KEY}`)
        .then((response) => response.json())
        .then((data) => {
          runtimeText = `${data.runtime} min `;
          infoCard.querySelector(".movie-runtime").textContent = runtimeText;
        })
        .catch((error) => console.error("Error fetching runtime:", error));
    }

    // Setup initial HTML content for infoCard
    infoCard.innerHTML = `
          <h2 class="movie-title">${item.title || item.name}</h2>
          <div class="movie-release-date-runtime">
              <p class="movie-release-date">${releaseDate}</p>
              <p class="movie-runtime">${runtimeText}</p> <!-- This will be updated after fetch -->
          </div>
          <div class="movie-overview">${
            item.overview || "No overview available."
          }</div>
      `;

    // Click event to navigate to detail page
    movieCard.addEventListener("click", () => {
      window.location.href = `detail.html?id=${item.id}&type=${type}`;
    });

    // Append elements to structure based on screen size
    movieCard.appendChild(posterContainer);
    if (window.innerWidth <= 768) {
      // Mobile view: append info inside card
      movieCard.appendChild(infoCard);
      relatedGrid.appendChild(movieCard);
    } else {
      // Desktop view: display info card separately
      movieContainer.appendChild(movieCard);
      movieContainer.appendChild(infoCard);
      relatedGrid.appendChild(movieContainer);
    }
  });
}
