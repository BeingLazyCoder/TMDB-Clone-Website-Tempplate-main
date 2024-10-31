const API_KEY = "aad3fab1607b552befd9a2ac37e556af",
    BASE_URL = "https://api.themoviedb.org/3",
    IMG_BASE_URL = "https://image.tmdb.org/t/p/w500";
let searchTimeout,
    currentType = "movie",
    currentPage = 1,
    currentSort = "popularity.desc",
    currentGenre = "",
    currentYear = "",
    currentLanguage = "",
    isLoading = !1;
function fetchData(e = 1) {
    if (isLoading) return;
    (isLoading = !0), showLoading();
    fetch(`${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${e}&sort_by=${currentSort}&with_genres=${currentGenre}&year=${currentYear}&with_original_language=${currentLanguage}`)
        .then((e) => e.json())
        .then((t) => {
            displayResults(t.results, 1 === e), (isLoading = !1), hideLoading();
        })
        .catch((e) => {
            console.error("Error:", e), (isLoading = !1), hideLoading();
        });
}
function displayResults(e, t = !0) {
    const n = document.getElementById("content-view");
    n &&
        (t && (n.innerHTML = ""),
        e.forEach((e) => {
            const t = document.createElement("div");
            t.className = "movie-card";
            const a = new Date(e.release_date || e.first_air_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                o = Math.round(10 * e.vote_average);
            (t.innerHTML = `\n            <img class="movie-poster" src="${IMG_BASE_URL}${e.poster_path}web.p" alt="${e.title || e.name}">\n            <div class="movie-info">\n                <h2 class="movie-title">${
                e.title || e.name
            }</h2>\n                <p class="movie-release-date">${a}</p>\n                <div class="movie-overview">${e.overview}</div>\n            </div>\n            <div class="movie-rating">${o}%</div>\n        `),
                t.addEventListener("click", () => navigateToDetail(e.id)),
                n.appendChild(t);
        }));
}
function navigateToDetail(e) {
    window.location.href = `detail.html?id=${e}&type=${currentType}`;
}
function showLoading() {
    const e = document.getElementById("loading");
    e && (e.style.display = "block");
}
function hideLoading() {
    const e = document.getElementById("loading");
    e && (e.style.display = "none");
}
function search(e) {
    if (e.length < 3) return void hideSearchResults();
    const t = `${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${encodeURIComponent(e)}`;
    fetch(t)
        .then((e) => e.json())
        .then((e) => displaySearchResults(e.results))
        .catch((e) => console.error("Error:", e));
}
function displaySearchResults(e) {
    const t = document.querySelector(".search-results"),
        n = document.querySelector("#searchInput");
    (t.innerHTML = ""),
        n.value.trim() && e.length > 0
            ? (e.slice(0, 5).forEach((e) => {
                  const n = document.createElement("div");
                  n.className = "search-result-item";
                  const a = new Date(e.release_date || e.first_air_date).getFullYear();
                  (n.innerHTML = `\n                <img src="${IMG_BASE_URL}${e.poster_path}.web.p" alt="${e.title || e.name}" class="poster">\n                <div class="result-info">\n                    <h3 class="title">${
                      e.title || e.name
                  }</h3>\n                    <span class="year">(${a})</span>\n                </div>\n            `),
                      n.addEventListener("click", () => {
                          navigateToDetail(e.id);
                      }),
                      t.appendChild(n);
              }),
              (t.style.display = "block"))
            : (t.style.display = "none");
}
const searchInput = document.querySelector("#searchInput");
function fetchGenres() {
    fetch(`${BASE_URL}/genre/${currentType}/list?api_key=${API_KEY}`)
        .then((e) => e.json())
        .then((e) => populateGenreFilter(e.genres))
        .catch((e) => console.error("Error:", e));
}
function populateGenreFilter(e) {
    const t = document.getElementById("genreFilter");
    t &&
        ((t.innerHTML = '<option value="">Genre</option>'),
        e.forEach((e) => {
            const n = document.createElement("option");
            (n.value = e.id), (n.textContent = e.name), t.appendChild(n);
        }));
}
function fetchSortOptions() {
    const e = document.getElementById("sortFilter");
    e &&
        [
            { value: "popularity.desc", label: "Popularity Descending" },
            { value: "popularity.asc", label: "Popularity Ascending" },
            { value: "vote_average.desc", label: "Rating Descending" },
            { value: "vote_average.asc", label: "Rating Ascending" },
            { value: "release_date.desc", label: "Release Date Descending" },
            { value: "release_date.asc", label: "Release Date Ascending" },
        ].forEach((t) => {
            const n = document.createElement("option");
            (n.value = t.value), (n.textContent = t.label), e.appendChild(n);
        });
}
function fetchLanguages() {
    fetch(`${BASE_URL}/configuration/languages?api_key=${API_KEY}`)
        .then((e) => e.json())
        .then((e) => populateLanguageFilter(e))
        .catch((e) => console.error("Error:", e));
}
function populateLanguageFilter(e) {
    const t = document.getElementById("languageFilter");
    t &&
        (e.sort((e, t) => e.english_name.localeCompare(t.english_name)),
        (t.innerHTML = '<option value="">Language</option>'),
        e.forEach((e) => {
            const n = document.createElement("option");
            (n.value = e.iso_639_1), (n.textContent = e.english_name), t.appendChild(n);
        }));
}
function populateYearFilter() {
    const e = document.getElementById("yearFilter");
    if (!e) return;
    for (let t = new Date().getFullYear(); t >= 1900; t--) {
        const n = document.createElement("option");
        (n.value = t), (n.textContent = t), e.appendChild(n);
    }
}
function handleScroll() {
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isLoading && (currentPage++, fetchData(currentPage));
}

const movieToggle = document.getElementById("movieToggle");
const tvToggle = document.getElementById("tvToggle");
const indicator = document.querySelector(".indicator");

function setActiveToggle() {
    if (currentType === "movie") {
        movieToggle.classList.add("active");
        tvToggle.classList.remove("active");
        indicator.style.transform = "translateX(0)"; // Position under Movies
    } else {
        movieToggle.classList.remove("active");
        tvToggle.classList.add("active");
        indicator.style.transform = "translateX(100%)"; // Position under TV Shows
    }
}

// Add event listeners to toggle links
movieToggle.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    currentType = "movie";
    setActiveToggle();
});

tvToggle.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default link behavior
    currentType = "tv";
    setActiveToggle();
});

// Initialize the toggle state
setActiveToggle();

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" }), showMessageBar();
}
function showMessageBar() {
    const e = document.getElementById("messageBar");
    (e.style.transform = "translate(-50%, 0)"), (e.style.opacity = "1"), setTimeout(hideMessageBar, 2e3);
}
function hideMessageBar() {
    const e = document.getElementById("messageBar");
    (e.style.transform = "translate(-50%, 10px)"), (e.style.opacity = "0");
}
searchInput.addEventListener("input", () => {
    "" === searchInput.value.trim() && (document.querySelector(".search-results").style.display = "none");
}),
    document.addEventListener("DOMContentLoaded", () => {
        const e = document.getElementById("searchInput"),
            t = document.getElementById("searchButton"),
            n = document.getElementById("sortFilter"),
            a = document.getElementById("genreFilter"),
            o = document.getElementById("yearFilter"),
            r = document.getElementById("languageFilter"),
            c = document.getElementById("movieToggle"),
            s = document.getElementById("tvToggle");
        e &&
            t &&
            (e.addEventListener("input", (e) => {
                clearTimeout(searchTimeout), (searchTimeout = setTimeout(() => search(e.target.value), 300));
            }),
            t.addEventListener("click", () => search(e.value)),
            document.addEventListener("click", (e) => {
                e.target.closest(".search-container") || hideSearchResults();
            })),
            n &&
                n.addEventListener("change", (e) => {
                    (currentSort = e.target.value), (currentPage = 1), fetchData();
                }),
            a &&
                a.addEventListener("change", (e) => {
                    (currentGenre = e.target.value), (currentPage = 1), fetchData();
                }),
            o &&
                o.addEventListener("change", (e) => {
                    (currentYear = e.target.value), (currentPage = 1), fetchData();
                }),
            r &&
                r.addEventListener("change", (e) => {
                    (currentLanguage = e.target.value), (currentPage = 1), fetchData();
                }),
            c &&
                s &&
                (c.addEventListener("click", (e) => {
                    e.preventDefault(), (currentType = "movie"), (currentPage = 1), setActiveToggle(), fetchGenres(), fetchData();
                }),
                s.addEventListener("click", (e) => {
                    e.preventDefault(), (currentType = "tv"), (currentPage = 1), setActiveToggle(), fetchGenres(), fetchData();
                })),
            setActiveToggle(),
            fetchSortOptions(),
            fetchGenres(),
            fetchLanguages(),
            populateYearFilter(),
            fetchData(),
            window.addEventListener("scroll", handleScroll);
    }),
    (window.onscroll = function () {
        const e = document.getElementById("backToTopBtn");
        document.body.scrollTop > 300 || document.documentElement.scrollTop > 300 ? (e.style.display = "block") : ((e.style.display = "none"), hideMessageBar());
    });
const button = document.getElementById("backToTopBtn");
if ((button.addEventListener("mouseenter", showMessageBar), button.addEventListener("mouseleave", hideMessageBar), "fetch" in window)) {
    const e = document.createElement("script");
    (e.src = "modern-script.js"), document.head.appendChild(e);
} else {
    const e = document.createElement("script");
    (e.src = "legacy-script.js"), document.head.appendChild(e);
}
function preloadImage(e) {
    const t = document.createElement("link");
    (t.rel = "preload"), (t.href = e), (t.as = "image"), document.head.appendChild(t);
}
function addImage(e) {
    preloadImage(e);
    const t = document.createElement("img");
    (t.src = e), (t.alt = "Description of the image"), (t.className = "dynamic-image");
    document.getElementById("image-container").appendChild(t);
}
const lazyLoadImages = () => {
    const e = document.querySelectorAll("img[data-src]"),
        t = new IntersectionObserver((e, t) => {
            e.forEach((e) => {
                if (e.isIntersecting) {
                    const n = e.target;
                    (n.src = n.dataset.src), n.classList.remove("lazy"), t.unobserve(n);
                }
            });
        });
    e.forEach((e) => t.observe(e));
};
function debounce(e, t) {
    let n;
    return function (...a) {
        clearTimeout(n), (n = setTimeout(() => e.apply(this, a), t));
    };
}
function displayResults(e, t = !0) {
    const n = document.getElementById("content-view");
    if (!n) return;
    const a = document.createDocumentFragment();
    e.forEach((e) => {
        const t = document.createElement("div");
        t.className = "movie-card";
        const n = new Date(e.release_date || e.first_air_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
            o = Math.round(10 * e.vote_average);
        (t.innerHTML = `\n            <img class="movie-poster" src="${IMG_BASE_URL}${e.poster_path}.webp" data-src="${IMG_BASE_URL}${e.poster_path}" alt="${
            e.title || e.name
        }" class="lazy">\n            <div class="movie-info">\n                <h2 class="movie-title">${e.title || e.name}</h2>\n                <p class="movie-release-date">${n}</p>\n                <div class="movie-overview">${
            e.overview
        }</div>\n            </div>\n            <div class="movie-rating">${o}%</div>\n        `),
            t.addEventListener("click", () => navigateToDetail(e.id)),
            a.appendChild(t);
    }),
        t && (n.innerHTML = ""),
        n.appendChild(a),
        lazyLoadImages();
}(function () {
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
                        window.location.href = "index.html";  // Redirect on console interaction
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

