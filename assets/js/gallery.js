// Lays out .photo-gallery images in two columns on desktop, placing each image
// in the currently shorter column so that reading order is roughly preserved
// (1.jpg next to 2.jpg, etc). On mobile the images are left in a single column.
var desktopQuery = window.matchMedia("(min-width: 601px)");

function layoutGallery(galleryEl, imgs) {
  galleryEl.innerHTML = "";

  if (!desktopQuery.matches) {
    galleryEl.classList.remove("masonry");
    imgs.forEach(function(img) { galleryEl.appendChild(img); });
    return;
  }

  var columns = [document.createElement("div"), document.createElement("div")];
  var heights = [0, 0];

  columns.forEach(function(column) {
    column.className = "photo-column";
    galleryEl.appendChild(column);
  });

  // Columns are equal width, so an image's height is proportional to its aspect ratio
  imgs.forEach(function(img) {
    var i = heights[1] < heights[0] ? 1 : 0;
    columns[i].appendChild(img);
    heights[i] += img.naturalWidth ? img.naturalHeight / img.naturalWidth : 0;
  });

  galleryEl.classList.add("masonry");
}

// Image dimensions are known as soon as the image starts loading, well before it has
// finished downloading, so poll for them rather than waiting for the load event
function whenSized(imgs, callback) {
  var sized = imgs.every(function(img) { return img.naturalWidth || img.complete; });

  if (sized) {
    callback();
  } else {
    setTimeout(function() { whenSized(imgs, callback); }, 50);
  }
}

document.querySelectorAll(".photo-gallery").forEach(function(galleryEl) {
  var imgs = Array.prototype.slice.call(galleryEl.querySelectorAll("img"));

  whenSized(imgs, function() {
    layoutGallery(galleryEl, imgs);
    galleryEl.classList.add("ready");

    desktopQuery.addEventListener("change", function() {
      layoutGallery(galleryEl, imgs);
    });
  });
});
