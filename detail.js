const API_KEY = "aad3fab1607b552befd9a2ac37e556af",
    BASE_URL = "https://api.themoviedb.org/3",
    IMG_BASE_URL = "https://image.tmdb.org/t/p/original";

function fetchDetails(e, t) {
    fetch(`${BASE_URL}/${t}/${e}?api_key=${API_KEY}&append_to_response=videos`).then((e => e.json())).then((e => displayDetails(e, t))).catch((e => console.error("Error:", e)))
}
function displayDetails(e, t) {
    const n = document.querySelector(".backdrop-container"),
        a = document.getElementById("detail-poster"),
        i = document.getElementById("detail-title"),
        o = document.getElementById("detail-meta"),
        r = document.getElementById("detail-overview"),
        s = document.getElementById("watch-trailer-btn"),
        z = document.getElementById("watch-trailer-btn2"),
        w = document.getElementById("watch-trailer-btn3"),
        d = e.backdrop_path ? IMG_BASE_URL + e.backdrop_path : "",
        l = e.poster_path ? IMG_BASE_URL + e.poster_path : "",
        c = new Date(e.release_date || e.first_air_date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });

    n.style.backgroundImage = `url(${d})`;
    a.src = l;
    a.alt = e.title || e.name;
    i.textContent = e.title || e.name;
    o.innerHTML = `
        <span>${c}</span> | 
        <span>${"movie" === t ? e.runtime + " min" : e.episode_run_time[0] + " min/episode"}</span> | 
        <span>${e.genres.map((e => e.name)).join(", ")}</span>
    `;
    r.textContent = e.overview;

    s.style.display = "block";
    s.onclick = () => toggleTrailer(t, e.id);
    z.style.display = "block";
    z.onclick = () => toggleTrailer2(t, e.id);
    w.style.display = "block";
    w.onclick = () => toggleTrailer3(t, e.id);
}

function toggleTrailer(type, id) {
    const container1 = document.getElementById("trailer-container");
    const container2 = document.getElementById("trailer-container2");
    const container3 = document.getElementById("trailer-container3");

    // Hide other containers
    container2.classList.remove("active");
    container2.innerHTML = "";
    container3.classList.remove("active");
    container3.innerHTML = "";

    // Show this container
    let url = type === "movie" ? `https://vidsrc.dev/embed/movie/${id}` : `https://vidsrc.dev/embed/tv/${id}/1/1`;
    container1.classList.add("active");
    container1.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function toggleTrailer2(type, id) {
    const container1 = document.getElementById("trailer-container");
    const container2 = document.getElementById("trailer-container2");
    const container3 = document.getElementById("trailer-container3");

    // Hide other containers
    container1.classList.remove("active");
    container1.innerHTML = "";
    container3.classList.remove("active");
    container3.innerHTML = "";

    // Show this container
    let url = type === "movie" ? `https://hnembed.cc/embed/movie/${id}` : `https://hnembed.cc/embed/tv/${id}`;
    container2.classList.add("active");
    container2.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}

function toggleTrailer3(type, id) {
    const container1 = document.getElementById("trailer-container");
    const container2 = document.getElementById("trailer-container2");
    const container3 = document.getElementById("trailer-container3");

    // Hide other containers
    container1.classList.remove("active");
    container1.innerHTML = "";
    container2.classList.remove("active");
    container2.innerHTML = "";

    // Show this container
    let url = type === "movie" ? `https://multiembed.mov/?video_id=${id}&tmdb=1` : `https://multiembed.mov/?video_id=${id}&tmdb=1&s=1&e=1`;
    container3.classList.add("active");
    container3.innerHTML = `<iframe src="${url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
}


function fetchRelatedContent(e, t) {
    fetch(`${BASE_URL}/${t}/${e}/recommendations?api_key=${API_KEY}`).then((e => e.json())).then((e => displayRelatedContent(e.results.slice(0, 10), t))).catch((e => console.error("Error:", e)))
}

function displayRelatedContent(e, t) {
    const n = document.getElementById("related-grid");
    n.innerHTML = "", e.forEach((e => {
        const a = document.createElement("div");
        a.className = "movie-card";
        const i = e.poster_path ? `${IMG_BASE_URL}/${e.poster_path}` : "",
            o = new Date(e.release_date || e.first_air_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            }),
            r = Math.round(10 * e.vote_average);
        a.innerHTML = `\n            <img class="movie-poster" src="${i}" alt="${e.title||e.name}">\n            <div class="movie-info">\n                <h2 class="movie-title">${e.title||e.name}</h2>\n                <p class="movie-release-date">${o}</p>\n                <div class="movie-overview">${e.overview}</div>\n            </div>\n            <div class="movie-rating">${r}%</div>\n        `, a.addEventListener("click", (() => {
            window.location.href = `detail.html?id=${e.id}&type=${t}`
        })), n.appendChild(a)
    }))
}
document.addEventListener("DOMContentLoaded", (() => {
    const e = new URLSearchParams(window.location.search),
        t = e.get("id"),
        n = e.get("type");
    e.get("season"), e.get("episode");
    t && n && (fetchDetails(t, n), fetchRelatedContent(t, n))
}));
(function () {
    // Function to detect if Developer Tools are opened based on window dimensions
    function detectDevTools() {
        const threshold = 160;
        setInterval(() => {
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                alert("Developer tools are not allowed!");
                window.location.href = "https://yourwebsite.com"; // Redirect to another page
            }
        }, 1000);
    }

    // Trigger debugger to annoy users inspecting code
    function triggerDebugger() {
        setInterval(() => {
            debugger;  // Pauses execution if DevTools are open
        }, 5000);  // Run every 5 seconds (adjust interval as needed)
    }

    // Disable right-click and certain key combinations
    function disableShortcuts() {
        // Disable right-click
        document.addEventListener("contextmenu", (e) => e.preventDefault());

        // Disable F12, Ctrl+Shift+I, and Ctrl+Shift+C
        document.onkeydown = function (e) {
            if (e.keyCode === 123 ||  // F12
                (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 67)) || // Ctrl+Shift+I or Ctrl+Shift+C
                (e.ctrlKey && e.keyCode === 85)) {  // Ctrl+U
                alert("Shortcut disabled!");
                return false;
            }
        };
    }

    // Redirect or perform another action if console interaction is detected
    function detectConsoleOpen() {
        let openConsole = false;
        const element = new Image();
        Object.defineProperty(element, 'id', {
            get: function () {
                openConsole = true;
                setTimeout(() => {
                    if (openConsole) {
                        window.location.href = "https://yourwebsite.com";  // Redirect on console interaction
                    }
                }, 500);
            }
        });
        console.log('%c ', element); // Triggers getter if console is open
    }

    // Run protection functions
    detectDevTools();
    triggerDebugger();
    disableShortcuts();
    detectConsoleOpen();
})();

