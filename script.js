const API_KEY="aad3fab1607b552befd9a2ac37e556af",BASE_URL="https://api.themoviedb.org/3",IMG_BASE_URL="https://image.tmdb.org/t/p/w500";let searchTimeout,currentType="movie",currentPage=1,currentSort="popularity.desc",currentGenre="",currentYear="",currentLanguage="",isLoading=!1;function fetchData(e=1){isLoading||(isLoading=!0,showLoading(),fetch(`${BASE_URL}/discover/${currentType}?api_key=${API_KEY}&page=${e}&sort_by=${currentSort}&with_genres=${currentGenre}&year=${currentYear}&with_original_language=${currentLanguage}`).then((e=>e.json())).then((t=>{displayResults(t.results,1===e),isLoading=!1,hideLoading()})).catch((e=>{console.error("Error:",e),isLoading=!1,hideLoading()})))}function displayResults(e,t=!0){const n=document.getElementById("content-view");n&&(t&&(n.innerHTML=""),e.forEach((e=>{const t=document.createElement("div");t.className="movie-card";const a=new Date(e.release_date||e.first_air_date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),o=Math.round(10*e.vote_average);t.innerHTML=`\n            <img class="movie-poster" src="${IMG_BASE_URL}${e.poster_path}web.p" alt="${e.title||e.name}">\n            <div class="movie-info">\n                <h2 class="movie-title">${e.title||e.name}</h2>\n                <p class="movie-release-date">${a}</p>\n                <div class="movie-overview">${e.overview}</div>\n            </div>\n            <div class="movie-rating">${o}%</div>\n        `,t.addEventListener("click",(()=>navigateToDetail(e.id))),n.appendChild(t)})))}function navigateToDetail(e){window.location.href=`detail.html?id=${e}&type=${currentType}`}function showLoading(){const e=document.getElementById("loading");e&&(e.style.display="block")}function hideLoading(){const e=document.getElementById("loading");e&&(e.style.display="none")}function search(e){if(e.length<3)return void hideSearchResults();const t=`${BASE_URL}/search/${currentType}?api_key=${API_KEY}&query=${encodeURIComponent(e)}`;fetch(t).then((e=>e.json())).then((e=>displaySearchResults(e.results))).catch((e=>console.error("Error:",e)))}function displaySearchResults(e){const t=document.querySelector(".search-results"),n=document.querySelector("#searchInput");t.innerHTML="",n.value.trim()&&e.length>0?(e.slice(0,5).forEach((e=>{const n=document.createElement("div");n.className="search-result-item";const a=new Date(e.release_date||e.first_air_date).getFullYear();n.innerHTML=`\n                <img src="${IMG_BASE_URL}${e.poster_path}.web.p" alt="${e.title||e.name}" class="poster">\n                <div class="result-info">\n                    <h3 class="title">${e.title||e.name}</h3>\n                    <span class="year">(${a})</span>\n                </div>\n            `,n.addEventListener("click",(()=>{navigateToDetail(e.id)})),t.appendChild(n)})),t.style.display="block"):t.style.display="none"}const searchInput=document.querySelector("#searchInput");function fetchGenres(){fetch(`${BASE_URL}/genre/${currentType}/list?api_key=${API_KEY}`).then((e=>e.json())).then((e=>populateGenreFilter(e.genres))).catch((e=>console.error("Error:",e)))}function populateGenreFilter(e){const t=document.getElementById("genreFilter");t&&(t.innerHTML='<option value="">Genre</option>',e.forEach((e=>{const n=document.createElement("option");n.value=e.id,n.textContent=e.name,t.appendChild(n)})))}function fetchSortOptions(){const e=document.getElementById("sortFilter");e&&[{value:"popularity.desc",label:"Popularity Descending"},{value:"popularity.asc",label:"Popularity Ascending"},{value:"vote_average.desc",label:"Rating Descending"},{value:"vote_average.asc",label:"Rating Ascending"},{value:"release_date.desc",label:"Release Date Descending"},{value:"release_date.asc",label:"Release Date Ascending"}].forEach((t=>{const n=document.createElement("option");n.value=t.value,n.textContent=t.label,e.appendChild(n)}))}function fetchLanguages(){fetch(`${BASE_URL}/configuration/languages?api_key=${API_KEY}`).then((e=>e.json())).then((e=>populateLanguageFilter(e))).catch((e=>console.error("Error:",e)))}function populateLanguageFilter(e){const t=document.getElementById("languageFilter");t&&(e.sort(((e,t)=>e.english_name.localeCompare(t.english_name))),t.innerHTML='<option value="">Language</option>',e.forEach((e=>{const n=document.createElement("option");n.value=e.iso_639_1,n.textContent=e.english_name,t.appendChild(n)})))}function populateYearFilter(){const e=document.getElementById("yearFilter");if(e)for(let t=(new Date).getFullYear();t>=1900;t--){const n=document.createElement("option");n.value=t,n.textContent=t,e.appendChild(n)}}function handleScroll(){window.innerHeight+window.scrollY>=document.body.offsetHeight-500&&!isLoading&&(currentPage++,fetchData(currentPage))}const movieToggle=document.getElementById("movieToggle"),tvToggle=document.getElementById("tvToggle"),indicator=document.querySelector(".indicator");function setActiveToggle(){"movie"===currentType?(movieToggle.classList.add("active"),tvToggle.classList.remove("active"),indicator.style.transform="translateX(0)"):(movieToggle.classList.remove("active"),tvToggle.classList.add("active"),indicator.style.transform="translateX(100%)")}function scrollToTop(){window.scrollTo({top:0,behavior:"smooth"}),showMessageBar()}function showMessageBar(){const e=document.getElementById("messageBar");e.style.transform="translate(-50%, 0)",e.style.opacity="1",setTimeout(hideMessageBar,2e3)}function hideMessageBar(){const e=document.getElementById("messageBar");e.style.transform="translate(-50%, 10px)",e.style.opacity="0"}movieToggle.addEventListener("click",(e=>{e.preventDefault(),currentType="movie",setActiveToggle()})),tvToggle.addEventListener("click",(e=>{e.preventDefault(),currentType="tv",setActiveToggle()})),setActiveToggle(),searchInput.addEventListener("input",(()=>{""===searchInput.value.trim()&&(document.querySelector(".search-results").style.display="none")})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("searchInput"),t=document.getElementById("searchButton"),n=document.getElementById("sortFilter"),a=document.getElementById("genreFilter"),o=document.getElementById("yearFilter"),r=document.getElementById("languageFilter"),c=document.getElementById("movieToggle"),i=document.getElementById("tvToggle");e&&t&&(e.addEventListener("input",(e=>{clearTimeout(searchTimeout),searchTimeout=setTimeout((()=>search(e.target.value)),300)})),t.addEventListener("click",(()=>search(e.value))),document.addEventListener("click",(e=>{e.target.closest(".search-container")||hideSearchResults()}))),n&&n.addEventListener("change",(e=>{currentSort=e.target.value,currentPage=1,fetchData()})),a&&a.addEventListener("change",(e=>{currentGenre=e.target.value,currentPage=1,fetchData()})),o&&o.addEventListener("change",(e=>{currentYear=e.target.value,currentPage=1,fetchData()})),r&&r.addEventListener("change",(e=>{currentLanguage=e.target.value,currentPage=1,fetchData()})),c&&i&&(c.addEventListener("click",(e=>{e.preventDefault(),currentType="movie",currentPage=1,setActiveToggle(),fetchGenres(),fetchData()})),i.addEventListener("click",(e=>{e.preventDefault(),currentType="tv",currentPage=1,setActiveToggle(),fetchGenres(),fetchData()}))),setActiveToggle(),fetchSortOptions(),fetchGenres(),fetchLanguages(),populateYearFilter(),fetchData(),window.addEventListener("scroll",handleScroll)})),window.onscroll=function(){const e=document.getElementById("backToTopBtn");document.body.scrollTop>300||document.documentElement.scrollTop>300?e.style.display="block":(e.style.display="none",hideMessageBar())};const button=document.getElementById("backToTopBtn");if(button.addEventListener("mouseenter",showMessageBar),button.addEventListener("mouseleave",hideMessageBar),"fetch"in window){const e=document.createElement("script");e.src="modern-script.js",document.head.appendChild(e)}else{const e=document.createElement("script");e.src="legacy-script.js",document.head.appendChild(e)}function preloadImage(e){const t=document.createElement("link");t.rel="preload",t.href=e,t.as="image",document.head.appendChild(t)}function addImage(e){preloadImage(e);const t=document.createElement("img");t.src=e,t.alt="Description of the image",t.className="dynamic-image",document.getElementById("image-container").appendChild(t)}async function fetchDataWithExpiry(e,t=60){let n=`tmdb_${e}`,a=JSON.parse(localStorage.getItem(n));if(a&&Date.now()-a.timestamp<6e4*t)return console.log("Loading data from cache with expiry check"),a.data;try{let t=await fetch(`https://api.themoviedb.org/3/${e}`),a=await t.json();return localStorage.setItem(n,JSON.stringify({data:a,timestamp:Date.now()})),console.log("Data cached in localStorage with expiry"),a}catch(e){return console.error("Error fetching data:",e),null}}document.addEventListener("DOMContentLoaded",(()=>{let e=new URLSearchParams(window.location.search),t=e.get("id"),n=e.get("type");e.get("season"),e.get("episode"),t&&n&&(fetchDetails(t,n),fetchRelatedContent(t,n))})),setInterval((()=>{(window.outerWidth-window.innerWidth>160||window.outerHeight-window.innerHeight>160)&&(alert("Developer tools are not allowed!"),window.location.href="https://jiostream.netlify.app")}),1e3),setInterval((()=>{}),5e3),document.addEventListener("contextmenu",(e=>e.preventDefault())),document.onkeydown=function(e){if(123===e.keyCode||e.ctrlKey&&e.shiftKey&&(73===e.keyCode||67===e.keyCode)||e.ctrlKey&&85===e.keyCode)return alert("Shortcut disabled!"),!1},function(){let e=!1,t=new Image;Object.defineProperty(t,"id",{get:function(){e=!0,setTimeout((()=>{e&&(window.location.href="https://jiostream.netlify.app")}),500)}}),console.log("%c ",t)}(),fetchDataWithExpiry("movie/popular").then((e=>{e&&console.log("Data loaded:",e)}));const lazyLoadImages=()=>{const e=document.querySelectorAll("img[data-src]"),t=new IntersectionObserver(((e,t)=>{e.forEach((e=>{if(e.isIntersecting){const n=e.target;n.src=n.dataset.src,n.classList.remove("lazy"),t.unobserve(n)}}))}));e.forEach((e=>t.observe(e)))};function debounce(e,t){let n;return function(...a){clearTimeout(n),n=setTimeout((()=>e.apply(this,a)),t)}}function displayResults(e,t=!0){const n=document.getElementById("content-view");if(!n)return;const a=document.createDocumentFragment();e.forEach((e=>{const t=document.createElement("div");t.className="movie-card";const n=new Date(e.release_date||e.first_air_date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),o=Math.round(10*e.vote_average);t.innerHTML=`\n            <img class="movie-poster" src="${IMG_BASE_URL}${e.poster_path}.webp" data-src="${IMG_BASE_URL}${e.poster_path}" alt="${e.title||e.name}" class="lazy">\n            <div class="movie-info">\n                <h2 class="movie-title">${e.title||e.name}</h2>\n                <p class="movie-release-date">${n}</p>\n                <div class="movie-overview">${e.overview}</div>\n            </div>\n            <div class="movie-rating">${o}%</div>\n        `,t.addEventListener("click",(()=>navigateToDetail(e.id))),a.appendChild(t)})),t&&(n.innerHTML=""),n.appendChild(a),lazyLoadImages()}var time,count,w=window.innerWidth,h=window.innerHeight,canvas=document.getElementById("test"),ctx=canvas.getContext("2d"),rate=60,arc=100,size=7,speed=20,parts=new Array,colors=["red","#f57900","yellow","#ce5c00","#5c3566"],mouse={x:0,y:0};function create(){time=0,count=0;for(var e=0;e<arc;e++)parts[e]={x:Math.ceil(Math.random()*w),y:Math.ceil(Math.random()*h),toX:5*Math.random()-1,toY:2*Math.random()-1,c:colors[Math.floor(Math.random()*colors.length)],size:Math.random()*size}}function particles(){ctx.clearRect(0,0,w,h),canvas.addEventListener("mousemove",MouseMove,!1);for(var e=0;e<arc;e++){var t=parts[e],n=DistanceBetween(mouse,parts[e]);n=Math.max(Math.min(15-n/10,10),1);ctx.beginPath(),ctx.arc(t.x,t.y,t.size*n,0,2*Math.PI,!1),ctx.fillStyle=t.c,ctx.strokeStyle=t.c,e%2==0?ctx.stroke():ctx.fill(),t.x=t.x+t.toX*(.05*time),t.y=t.y+t.toY*(.05*time),t.x>w&&(t.x=0),t.y>h&&(t.y=0),t.x<0&&(t.x=w),t.y<0&&(t.y=h)}time<speed&&time++,setTimeout(particles,1e3/rate)}function MouseMove(e){mouse.x=e.layerX,mouse.y=e.layerY}function DistanceBetween(e,t){var n=t.x-e.x,a=t.y-e.y;return Math.sqrt(n*n+a*a)}canvas.setAttribute("width",w),canvas.setAttribute("height",h),create(),particles();