const auth = "563492ad6f917000010000019ee42d9520cb4112bbef3e2845cca330";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const submitButton = document.querySelector("submit-btn"); 
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let pageNumber = 1;
let fetchLink;
let currentSearch;

// Main functions
async function fetchApi(url) {
    const dataFetch = await fetch(url,{
        method: "GET",  
        headers: {
            Accept: "application/json",
            Authorization: auth
        }
    });
    const data = await dataFetch.json();
    return data;
}

function generatePictures(data) {
    data.photos.forEach(photo => { 
        
        const galleryImg = document.createElement("div");
        galleryImg.classList.add("gallery-img");
        galleryImg.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original} target="_blank">Download</a>
        </div>
        <img src=${photo.src.large} alt=${photo.src.photographer}></img>
        `;
        gallery.appendChild(galleryImg);
    });
}

async function curatedImage() {
    fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";
    const data = await fetchApi(fetchLink);
    generatePictures(data);
}

async function searchPhotos(search) {
    clear();
    fetchLink = `https://api.pexels.com/v1/search?query=${search}+query&per_page=15&page=1`;
    const data = await fetchApi(fetchLink);
    generatePictures(data);
}

//Event Listeners
searchInput.addEventListener("input", updateInput);
more.addEventListener("click", loadMore);

form.addEventListener("submit", (event) => {
    event.preventDefault();
    searchPhotos(searchValue);
    currentSearch = searchValue;
});


//Callback function for Event Listeners
function updateInput(event) {
    searchValue = event.target.value;
}

async function loadMore() {
    pageNumber++;
    if (searchValue) {
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${pageNumber}`
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${pageNumber}`;
    }
    const data = await fetchApi(fetchLink);
    generatePictures(data);
}

function clear() {
    gallery.innerHTML = "";
    searchInput.value = "";
}

curatedImage();