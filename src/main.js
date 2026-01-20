import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import "../style.css";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const API_KEY = "47873630-6df1888e9a425e125fd567ab2";

const form = document.querySelector("#search-form");
const gallery = document.querySelector(".gallery");
const loader = document.querySelector(".loader");

let lightbox = null;

form.addEventListener("submit", onSearch);

function onSearch(event) {
  event.preventDefault();

  const query = event.currentTarget.elements.query.value.trim();

  if (!query) {
    iziToast.warning({
      message: "Please enter a search query.",
      position: "topRight",
    });
    return;
  }

  gallery.innerHTML = "";
  loader.classList.remove("is-hidden");

  fetchImages(query)
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.error({
          message:
            "Sorry, there are no images matching your search query. Please try again!",
          position: "topRight",
        });
        return;
      }

      renderGallery(data.hits);

      if (lightbox) {
        lightbox.destroy();
      }

      lightbox = new SimpleLightbox(".gallery a", {
        captionsData: "alt",
        captionDelay: 250,
      });
    })
    .catch(error => {
      console.error(error);
      iziToast.error({
        message: "Something went wrong. Please try again later!",
        position: "topRight",
      });
    })
    .finally(() => {
      loader.classList.add("is-hidden");
    });
}

function fetchImages(query) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: "true",
  });

  return fetch(`https://pixabay.com/api/?${params}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    });
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
          <div class="info">
            <p><b>Likes</b><br>${likes}</p>
            <p><b>Views</b><br>${views}</p>
            <p><b>Comments</b><br>${comments}</p>
            <p><b>Downloads</b><br>${downloads}</p>
          </div>
        </a>
      </li>`
    )
    .join("");

  gallery.insertAdjacentHTML("beforeend", markup);
}
