const API_KEY="aad3fab1607b552befd9a2ac37e556af",BASE_URL="https://api.themoviedb.org/3",IMG_BASE_URL="https://image.tmdb.org/t/p/w500";let searchTimeout,currentType="movie",currentPage=1,currentSort="popularity.desc",currentGenre="",currentYear="",currentLanguage="",isLoading=!1;function fetchData(e=1){isLoading||(isLoading=!0,showLoading(),fetch(`${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${e}&sort_by=${currentSort}&with_genres=${currentGenre}&year=${currentYear}&with_original_language=${currentLanguage}`).then(e=>e.json()).then(t=>{displayResults(t.results,1===e),isLoading=!1,hideLoading()}).catch(e=>{console.error("Error:",e),isLoading=!1,hideLoading()}))}function displayResults(e,t=!0){let a=document.getElementById("content-view");a&&(t&&(a.innerHTML=""),e.forEach(e=>{let t=document.createElement("div");t.className="movie-card";let n=new Date(e.release_date||e.first_air_date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),r=Math.round(10*e.vote_average);t.innerHTML=`
            <img class="movie-poster" src="${IMG_BASE_URL}${e.poster_path}web.p" alt="${e.title||e.name}">
            <div class="movie-info">
                <h2 class="movie-title">${e.title||e.name}</h2>
                <p class="movie-release-date">${n}</p>
                <div class="movie-overview">${e.overview}</div>
            </div>
            <div class="movie-rating">${r}%</div>
        `,t.addEventListener("click",()=>navigateToDetail(e.id)),a.appendChild(t)}))}function navigateToDetail(e){window.location.href=`detail.html?id=${e}&type=${currentType}`}function showLoading(){let e=document.getElementById("loading");e&&(e.style.display="block")}function hideLoading(){let e=document.getElementById("loading");e&&(e.style.display="none")}function search(e){if(e.length<3)return void hideSearchResults();let t=`${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${encodeURIComponent(e)}`;fetch(t).then(e=>e.json()).then(e=>displaySearchResults(e.results)).catch(e=>console.error("Error:",e))}function displaySearchResults(e){let t=document.querySelector(".search-results"),a=document.querySelector("#searchInput");t.innerHTML="",a.value.trim()&&e.length>0?(e.slice(0,5).forEach(e=>{let a=document.createElement("div");a.className="search-result-item";let n=new Date(e.release_date||e.first_air_date).getFullYear();a.innerHTML=`
                <img src="${IMG_BASE_URL}${e.poster_path}.web.p" alt="${e.title||e.name}" class="poster">
                <div class="result-info">
                    <h3 class="title">${e.title||e.name}</h3>
                    <span class="year">(${n})</span>
                </div>
            `,a.addEventListener("click",()=>{navigateToDetail(e.id)}),t.appendChild(a)}),t.style.display="block"):t.style.display="none"}const searchInput=document.querySelector("#searchInput");function fetchGenres(){fetch(`${BASE_URL}/genre/${currentType}/list?api_key=${API_KEY}`).then(e=>e.json()).then(e=>populateGenreFilter(e.genres)).catch(e=>console.error("Error:",e))}function populateGenreFilter(e){let t=document.getElementById("genreFilter");t&&(t.innerHTML='<option value="">Genre</option>',e.forEach(e=>{let a=document.createElement("option");a.value=e.id,a.textContent=e.name,t.appendChild(a)}))}function fetchSortOptions(){let e=document.getElementById("sortFilter");e&&[{value:"popularity.desc",label:"Popularity Descending"},{value:"popularity.asc",label:"Popularity Ascending"},{value:"vote_average.desc",label:"Rating Descending"},{value:"vote_average.asc",label:"Rating Ascending"},{value:"release_date.desc",label:"Release Date Descending"},{value:"release_date.asc",label:"Release Date Ascending"},].forEach(t=>{let a=document.createElement("option");a.value=t.value,a.textContent=t.label,e.appendChild(a)})}function fetchLanguages(){fetch(`${BASE_URL}/configuration/languages?api_key=${API_KEY}`).then(e=>e.json()).then(e=>populateLanguageFilter(e)).catch(e=>console.error("Error:",e))}function populateLanguageFilter(e){let t=document.getElementById("languageFilter");t&&(e.sort((e,t)=>e.english_name.localeCompare(t.english_name)),t.innerHTML='<option value="">Language</option>',e.forEach(e=>{let a=document.createElement("option");a.value=e.iso_639_1,a.textContent=e.english_name,t.appendChild(a)}))}function populateYearFilter(){let e=document.getElementById("yearFilter");if(e)for(let t=new Date().getFullYear();t>=1900;t--){let a=document.createElement("option");a.value=t,a.textContent=t,e.appendChild(a)}}function handleScroll(){window.innerHeight+window.scrollY>=document.body.offsetHeight-500&&!isLoading&&fetchData(++currentPage)}const movieToggle=document.getElementById("movieToggle"),tvToggle=document.getElementById("tvToggle"),indicator=document.querySelector(".indicator");function setActiveToggle(){"movie"===currentType?(movieToggle.classList.add("active"),tvToggle.classList.remove("active"),indicator.style.transform="translateX(0)"):(movieToggle.classList.remove("active"),tvToggle.classList.add("active"),indicator.style.transform="translateX(100%)")}function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"}),showMessageBar()}function showMessageBar(){let e=document.getElementById("messageBar");e.style.transform="translate(-50%, 0)",e.style.opacity="1",setTimeout(hideMessageBar,2e3)}function hideMessageBar(){let e=document.getElementById("messageBar");e.style.transform="translate(-50%, 10px)",e.style.opacity="0"}movieToggle.addEventListener("click",e=>{e.preventDefault(),currentType="movie",setActiveToggle()}),tvToggle.addEventListener("click",e=>{e.preventDefault(),currentType="tv",setActiveToggle()}),setActiveToggle(),searchInput.addEventListener("input",()=>{""===searchInput.value.trim()&&(document.querySelector(".search-results").style.display="none")}),document.addEventListener("DOMContentLoaded",()=>{let e=document.getElementById("searchInput"),t=document.getElementById("searchButton"),a=document.getElementById("sortFilter"),n=document.getElementById("genreFilter"),r=document.getElementById("yearFilter"),i=document.getElementById("languageFilter"),l=document.getElementById("movieToggle"),o=document.getElementById("tvToggle");e&&t&&(e.addEventListener("input",e=>{clearTimeout(searchTimeout),searchTimeout=setTimeout(()=>search(e.target.value),300)}),t.addEventListener("click",()=>search(e.value)),document.addEventListener("click",e=>{e.target.closest(".search-container")||hideSearchResults()})),a&&a.addEventListener("change",e=>{currentSort=e.target.value,currentPage=1,fetchData()}),n&&n.addEventListener("change",e=>{currentGenre=e.target.value,currentPage=1,fetchData()}),r&&r.addEventListener("change",e=>{currentYear=e.target.value,currentPage=1,fetchData()}),i&&i.addEventListener("change",e=>{currentLanguage=e.target.value,currentPage=1,fetchData()}),l&&o&&(l.addEventListener("click",e=>{e.preventDefault(),currentType="movie",currentPage=1,setActiveToggle(),fetchGenres(),fetchData()}),o.addEventListener("click",e=>{e.preventDefault(),currentType="tv",currentPage=1,setActiveToggle(),fetchGenres(),fetchData()})),setActiveToggle(),fetchSortOptions(),fetchGenres(),fetchLanguages(),populateYearFilter(),fetchData(),window.addEventListener("scroll",handleScroll)}),window.onscroll=function(){let e=document.getElementById("backToTopBtn");document.body.scrollTop>300||document.documentElement.scrollTop>300?e.style.display="block":(e.style.display="none",hideMessageBar())};const button=document.getElementById("backToTopBtn");if(button.addEventListener("mouseenter",showMessageBar),button.addEventListener("mouseleave",hideMessageBar),"fetch"in window){let e=document.createElement("script");e.src="modern-script.js",document.head.appendChild(e)}else{let t=document.createElement("script");t.src="legacy-script.js",document.head.appendChild(t)}function preloadImage(e){let t=document.createElement("link");t.rel="preload",t.href=e,t.as="image",document.head.appendChild(t)}function addImage(e){preloadImage(e);let t=document.createElement("img");t.src=e,t.alt="Description of the image",t.className="dynamic-image",document.getElementById("image-container").appendChild(t)}const lazyLoadImages=()=>{let e=document.querySelectorAll("img[data-src]"),t=new IntersectionObserver((e,t)=>{e.forEach(e=>{if(e.isIntersecting){let a=e.target;a.src=a.dataset.src,a.classList.remove("lazy"),t.unobserve(a)}})});e.forEach(e=>t.observe(e))};function debounce(e,t){let a;return function(...n){clearTimeout(a),a=setTimeout(()=>e.apply(this,n),t)}}function displayResults(e,t=!0){let a=document.getElementById("content-view");if(!a)return;let n=document.createDocumentFragment();e.forEach(e=>{let t=document.createElement("div");t.className="movie-card";let a=new Date(e.release_date||e.first_air_date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),r=Math.round(10*e.vote_average);t.innerHTML=`
            <img class="movie-poster" src="${IMG_BASE_URL}${e.poster_path}.webp" data-src="${IMG_BASE_URL}${e.poster_path}" alt="${e.title||e.name}" class="lazy">
            <div class="movie-info">
                <h2 class="movie-title">${e.title||e.name}</h2>
                <p class="movie-release-date">${a}</p>
                <div class="movie-overview">${e.overview}</div>
            </div>
            <div class="movie-rating">${r}%</div>
        `,t.addEventListener("click",()=>navigateToDetail(e.id)),n.appendChild(t)}),t&&(a.innerHTML=""),a.appendChild(n),lazyLoadImages()}async function fetchDataWithExpiry(e,t=60){let a=`tmdb_${e}`,n=JSON.parse(localStorage.getItem(a));if(n&&Date.now()-n.timestamp<6e4*t)return console.log("Loading data from cache with expiry check"),n.data;try{let r=await fetch(`https://api.themoviedb.org/3/${e}`),i=await r.json();return localStorage.setItem(a,JSON.stringify({data:i,timestamp:Date.now()})),console.log("Data cached in localStorage with expiry"),i}catch(l){return console.error("Error fetching data:",l),null}}setInterval(()=>{(window.outerWidth-window.innerWidth>160||window.outerHeight-window.innerHeight>160)&&(alert("Developer tools are not allowed!"),window.location.href="https://jiostream.netlify.app")},1e3),setInterval(()=>{},5e3),document.addEventListener("contextmenu",e=>e.preventDefault()),document.onkeydown=function(e){if(123===e.keyCode||e.ctrlKey&&e.shiftKey&&(73===e.keyCode||67===e.keyCode)||e.ctrlKey&&85===e.keyCode)return alert("Shortcut disabled!"),!1},function e(){let t=!1,a=new Image;Object.defineProperty(a,"id",{get:function(){t=!0,setTimeout(()=>{t&&(window.location.href="https://jiostream.netlify.app")},500)}}),console.log("%c ",a)}(),fetchDataWithExpiry("movie/popular").then(e=>{e&&console.log("Data loaded:",e)});