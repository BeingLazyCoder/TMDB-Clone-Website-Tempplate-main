const API_KEY = "aad3fab1607b552befd9a2ac37e556af",
  BASE_URL = "https://api.themoviedb.org/3",
  IMG_BASE_URL = "https://image.tmdb.org/t/p/w200";
async function fetchDetails(e, t) {
  showLoading(), hideError();
  try {
    let a = await fetch(
      `${BASE_URL}/${t}/${e}?api_key=${API_KEY}&append_to_response=videos`
    );
    if (!a.ok) throw Error("Network response was not ok " + a.statusText);
    displayDetails(await a.json(), t);
  } catch (e) {
    console.error("Error:", e),
      showError("Failed to fetch details. Please try again later.");
  } finally {
    hideLoading();
  }
}
function displayDetails(e, t) {
  let
    n = document.getElementById("detail-poster"),
    o = document.getElementById("detail-title"),
    i = document.getElementById("detail-meta"),
    r = document.getElementById("detail-overview"),
    l = document.getElementById("watch-trailer-btn"),
    d = document.getElementById("watch-trailer-btn2"),
    s = document.getElementById("watch-trailer-btn3"),
    x = document.getElementById("watch-trailer-btn4"),
    y = document.getElementById("watch-trailer-btn5"),
    z = document.getElementById("watch-trailer-btn6"),
    c = e.backdrop_path ? `${IMG_BASE_URL}${e.backdrop_path}` : "",
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
        <span>${"movie" === t ? `${e.runtime} min` : `${e.episode_run_time[0]} min/episode`}</span> | 
        <span>${e.genres.map((gen) => gen.name).join(", ")}</span>`;
  r.textContent = e.overview;

  // Show all buttons and set up their click handlers
  const buttons = [l, d, s, x, y, z];
  buttons.forEach((btn, index) => {
    btn.style.display = "block";
    btn.onclick = () => toggleTrailer(t, e.id, index + 1);
    if (index === 3) {
      btn.classList.add('active'); // Set the first button as active
      toggleTrailer(t, e.id, index + 1); // Show the trailer for the first button
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
          url = "movie" === e ? `https://vidsrc.dev/embed/movie/${t}` : `https://vidsrc.dev/embed/tv/${t}/1/1`;
          break;
        case 2:
          url = `https://hnembed.cc/embed/${e}/${t}`;
          break;
        case 3:
          url = `https://multiembed.mov/?video_id=${t}&tmdb=1${"tv" === e ? "&s=1&e=1" : ""}`;
          break;
        case 4:
          url = "movie" === e ? `https://vidlink.pro/movie/${t}` : `https://vidlink.pro/tv/${t}/1/1`;
          break;
        case 5:
          url = "movie" === e ? `https://embed.su/embed/movie/${t}` : `https://embed.su/embed/tv/${t}/1/1`;
          break;
        case 6:
          url = "movie" === e ? `https://www.2embed.cc/embed/${t}` : `https://www.2embed.cc/embedtvfull/${t}`;
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

// Get all buttons with the class 'watch-trailer-btn'
// This part can remain the same
const buttons = document.querySelectorAll('.watch-trailer-btn');

// Add click event listener to each button
buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove 'active' class from all buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Add 'active' class to the clicked button
    button.classList.add('active');
  });
});
 
async function fetchRelatedContent(e, t) {
  try {
    let a = await fetch(
      `${BASE_URL}/${t}/${e}/recommendations?api_key=${API_KEY}`
    );
    if (!a.ok) throw Error("Network response was not ok " + a.statusText);
    displayRelatedContent((await a.json()).results.slice(0, 16), t);
  } catch (e) {
    console.error("Error:", e),
      showError("Failed to fetch related content. Please try again later.");
  }
}

function displayRelatedContent(e, t) {
  let a = document.getElementById("related-grid");
  (a.innerHTML = ""),
    e.forEach((e) => {
      let n = document.createElement("div");
      n.className = "movie-card";
      let o = e.poster_path ? `${IMG_BASE_URL}${e.poster_path}` : "",
        i = new Date(e.release_date || e.first_air_date).toLocaleDateString(
          "en-US",
          { year: "numeric", month: "long", day: "numeric" }
        ),
        r = Math.round(10 * e.vote_average);
      (n.innerHTML = `\n          <img class="movie-poster" src="${o}" alt="${
        e.title || e.name
      }" loading="lazy">\n          <div class="movie-info">\n            <h2 class="movie-title">${
        e.title || e.name
      }</h2>\n            <p class="movie-release-date">${i}</p>\n            <div class="movie-overview">${
        e.overview
      }</div>\n          </div>\n          <div class="movie-rating">${r}%</div>\n        `),
        n.addEventListener("click", () => {
          window.location.href = `detail.html?id=${e.id}&type=${t}`;
        }),
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
  (t.textContent = e), (t.style.display = "block");
}
function hideError() {
  document.getElementById("errorMessage").style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => {
  let e = new URLSearchParams(window.location.search),
    t = e.get("id"),
    a = e.get("type");
  t && a
    ? (fetchDetails(t, a), fetchRelatedContent(t, a))
    : showError(
        "Invalid URL parameters. Please go back to the home page and try again."
      );
});