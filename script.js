const addBookmark = document.getElementById("show-modal");
const modal = document.getElementById("modal");
const close = document.getElementById("close-modal");
const bookmarkForm = document.getElementById("bookmark-form");
const websiteNameEl = document.getElementById("website-name");
const websiteUrlEl = document.getElementById("website-url");
const bookmarksContainer = document.getElementById("bookmarks-container");
const urlError = document.getElementById("url-error");

let bookmarks = [];

const showModal = () => {
  modal.classList.add("show-modal");
  websiteNameEl.focus();
};

const closeModal = () => {
  modal.classList.remove("show-modal");
};

const hideModal = (e) => {
  if (e.target.className === "modal-container show-modal") {
    closeModal();
  }
};

const validate = (url) => {
  const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
  const regex = new RegExp(expression);
  if (!url.match(regex)) {
    urlError.textContent = "Please provide a valid web address";
    return false;
  }

  return true;
};

const fetchBookmarks = () => {
  if (localStorage.getItem("bookmarks")) {
    bookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }

  buildBookMarks();
};

const buildBookMarks = () => {
  bookmarksContainer.textContent = "";
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;

    const item = document.createElement("div");
    item.classList.add("item");

    const closeIcon = document.createElement("i");
    closeIcon.classList.add("fas", "fa-times");
    closeIcon.setAttribute("title", "Delete Bookmark");
    closeIcon.setAttribute("onclick", `deleteBookmark('${url}')`);

    const linkInfo = document.createElement("div");
    linkInfo.classList.add("name");

    const favicon = document.createElement("img");
    favicon.src = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`;

    const link = document.createElement("a");
    link.setAttribute("href", `${url}`);
    link.setAttribute("target", "_blank");
    link.textContent = name;

    linkInfo.append(favicon, link);

    item.append(closeIcon, linkInfo);
    bookmarksContainer.appendChild(item);
  });
};

const deleteBookmark = (url) => {
  bookmarks = bookmarks.filter((bookmark) => bookmark.url !== url);

  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
};

const storeBookmark = (e) => {
  e.preventDefault();
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes("https://") && !urlValue.includes("http://")) {
    urlValue = `https://${urlValue}`;
  }

  if (!validate(urlValue)) {
    return false;
  }

  const bookmark = {
    name: nameValue,
    url: urlValue,
  };

  bookmarks.push(bookmark);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  fetchBookmarks();
  bookmarkForm.reset();
  websiteNameEl.focus();
};

fetchBookmarks();

// addBookmark.addEventListener("click", showModal);

addBookmark.addEventListener("click", showModal);
close.addEventListener("click", closeModal);
window.addEventListener("click", hideModal);
bookmarkForm.addEventListener("submit", storeBookmark);
