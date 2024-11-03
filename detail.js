const API_KEY = "aad3fab1607b552befd9a2ac37e556af";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE_URL = "https://image.tmdb.org/t/p/w200";
async function fetchDetails(e, t) {
  showLoading();
  hideError();
  try {
    const apiUrl = `${BASE_URL}/${t}/${e}?append_to_response=videos`; // Remove API key from here
    let response = await fetch(`/api/proxy?url=${encodeURIComponent(apiUrl)}`);
    
    if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
    
    displayDetails(await response.json(), t);
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to fetch details. Please try again later.");
  } finally {
    hideLoading();
  }
}

function displayDetails(e, t) {
  let n = document.getElementById("detail-poster"),
      o = document.getElementById("detail-title"),
      i = document.getElementById("detail-meta"),
      r = document.getElementById("detail-overview"),
      buttons = [
          document.getElementById("watch-trailer-btn"),
          document.getElementById("watch-trailer-btn2"),
          document.getElementById("watch-trailer-btn3"),
          document.getElementById("watch-trailer-btn4"),
          document.getElementById("watch-trailer-btn5"),
          document.getElementById("watch-trailer-btn6")
      ];
      
  let c = e.backdrop_path ? `${IMG_BASE_URL}${e.backdrop_path}` : "",
      m = e.poster_path ? `${IMG_BASE_URL}${e.poster_path}` : "",
      p = new Date(e.release_date || e.first_air_date).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "long", day: "numeric" }
      );

  document.title = `${e.title || e.name} - Stream Now on JioStream`;
  n.src = m;
  n.alt = e.title || e.name;
  o.textContent = e.title || e.name;
  i.innerHTML = `
      <span>${p}</span> | 
      <span>${t === "movie" ? `${e.runtime} min` : `${e.episode_run_time[0]} min/episode`}</span> | 
      <span>${e.genres.map(gen => gen.name).join(", ")}</span>`;
  r.textContent = e.overview;

  // Show all buttons and set up their click handlers
  buttons.forEach((btn, index) => {
    btn.style.display = "block";
    btn.onclick = () => toggleTrailer(t, e.id, index + 1);
    if (index === 3) {
      btn.classList.add('active');
      toggleTrailer(t, e.id, index + 1);
    } else {
      btn.classList.remove('active');
    }
  });
}

function toggleTrailer(e, t, a) {
  [
    document.getElementById("trailer-container"),
    document.getElementById("trailer-container2"),
    document.getElementById("trailer-container3"),
    document.getElementById("trailer-container4"),
    document.getElementById("trailer-container5"),
    document.getElementById("trailer-container6"),
  ].forEach((n, o) => {
    if (o + 1 === a) {
      let url;
      switch (a) {
        case 1:
          url = e === "movie" ? `https://vidsrc.dev/embed/movie/${t}` : `https://vidsrc.dev/embed/tv/${t}/1/1`;
          break;
        case 2:
          url = `https://hnembed.cc/embed/${e}/${t}`;
          break;
        case 3:
          url = `https://multiembed.mov/?video_id=${t}&tmdb=1${e === "tv" ? "&s=1&e=1" : ""}`;
          break;
        case 4:
          url = e === "movie" ? `https://vidlink.pro/movie/${t}` : `https://vidlink.pro/tv/${t}/1/1`;
          break;
        case 5:
          url = e === "movie" ? `https://embed.su/embed/movie/${t}` : `https://embed.su/embed/tv/${t}/1/1`;
          break;
        case 6:
          url = e === "movie" ? `https://www.2embed.cc/embed/${t}` : `https://www.2embed.cc/embedtvfull/${t}`;
          break;
      }
      n.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
      n.classList.add("active");
    } else {
      n.classList.remove("active");
      n.innerHTML = "";
    }
  });
}

async function fetchRelatedContent(e, t) {
  try {
    const apiUrl = `${BASE_URL}/${t}/${e}/recommendations?api_key=${API_KEY}`;
    let response = await fetch(proxyUrl + apiUrl);
    
    if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
    
    displayRelatedContent((await response.json()).results.slice(0, 16), t);
  } catch (error) {
    console.error("Error:", error);
    showError("Failed to fetch related content. Please try again later.");
  }
}

function displayRelatedContent(e, t) {
  let a = document.getElementById("related-grid");
  a.innerHTML = "";
  e.forEach(e => {
    let n = document.createElement("div");
    n.className = "movie-card";
    let o = e.poster_path ? `${IMG_BASE_URL}${e.poster_path}` : "",
        i = new Date(e.release_date || e.first_air_date).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "long", day: "numeric" }
        ),
        r = Math.round(10 * e.vote_average);
    n.innerHTML = `
      <img class="movie-poster" src="${o}" alt="${e.title || e.name}" loading="lazy">
      <div class="movie-info">
        <h2 class="movie-title">${e.title || e.name}</h2>
        <p class="movie-release-date">${i}</p>
        <div class="movie-overview">${e.overview}</div>
      </div>
      <div class="movie-rating">${r}%</div>`;
    
    n.addEventListener("click", () => {
      window.location.href = `detail.html?id=${e.id}&type=${t}`;
    });
    a.appendChild(n);
  });
}

function showLoading() {
  document.getElementById("loadingIndicator").style.display = "block";
}

function hideLoading() {
  document.getElementById("loadingIndicator").style.display = "none";
}

function showError(e) {
  let t = document.getElementById("errorMessage");
  t.textContent = e;
  t.style.display = "block";
}

function hideError() {
  document.getElementById("errorMessage").style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
  let params = new URLSearchParams(window.location.search),
      id = params.get("id"),
      type = params.get("type");
  if (id && type) {
    fetchDetails(id, type);
    fetchRelatedContent(id, type);
  } else {
    showError("Invalid URL parameters. Please go back to the home page and try again.");
  }
});
