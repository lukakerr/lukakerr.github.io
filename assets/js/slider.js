// Elements
var bannerEl = document.querySelector(".banner");
var sliderEl = document.querySelectorAll(".slider");
var previousEl = document.querySelector(".previous-img");
var nextEl = document.querySelector(".next-img");

// Data attributes
var height = bannerEl.getAttribute("data-height");
var width = bannerEl.getAttribute("data-width");
var slideSpeed = bannerEl.getAttribute("data-slide-speed");
var autoSlide = bannerEl.getAttribute("data-autoslide");

// Slider variables
var totalImgs = sliderEl.length;
var currentImgNumber = 1;
var nextImgNumber = currentImgNumber + 1;
var previousImgNumber = totalImgs;
var randomImgNumber = 3;
var currentImg = bannerEl.querySelector('img:nth-of-type(' + currentImgNumber + ')');
var nextImg = bannerEl.querySelector('img:nth-of-type(' + nextImgNumber + ')');
var previousImg = bannerEl.querySelector('img:nth-of-type(' + previousImgNumber + ')');
var randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');

// Set CSS to element or elements
function setCSS(styles, elements) {
  if (elements.length > 1) {
    for (var i = 0; i < elements.length; i++) {
      Object.assign(elements[i].style, styles);
    }
  } else {
    Object.assign(elements.style, styles);
  }
}

// Set CSS before elements appear
document.body.style.margin = '0';

setCSS({
  width: '100%',
  height: 'fit-content',
  'min-height': '470px',
  margin: '0 auto',
  position: 'relative',
  'display': 'flex',
  'justify-content': 'center',
}, bannerEl);

setCSS({
  position: 'absolute',
  width: '50%',
  height: '100%',
  top: '0'
}, [previousEl, nextEl]);

setCSS({
  cursor: (totalImgs <= 1) ? 'default' : 'w-resize',
  width: '50%',
  left: '0'
}, previousEl);

setCSS({
  cursor: (totalImgs <= 1) ? 'default' : 'e-resize',
  right: '0'
}, nextEl);

// For multiple elements of same class
// Iterate over and set individual element's CSS
for (var i = 0; i < sliderEl.length; i++) {
  setCSS({
    width: 'auto', 
    'height': height + 'px', 
    'max-height': '470px',
    'margin': '0 auto',
  }, sliderEl[i]);

  setCSS({
    position: 'absolute',
    opacity: '0', 'object-fit': 'cover'
  }, sliderEl[i]);
}

(function() {
  function fadeTo(element, speed, opacity) {
    setCSS({
      transition: 'opacity ' + speed + 'ms',
      opacity: opacity
    }, element);
  }

  function loadImg() {
    fadeTo(currentImg, slideSpeed, 1);
  }

  function nextImgFade() {
    fadeTo(currentImg, slideSpeed, 0);
    fadeTo(nextImg, slideSpeed, 1);
  }

  function previousImgFade() {
    fadeTo(currentImg, slideSpeed, 0);
    fadeTo(previousImg, slideSpeed, 1);
  }

  function randomImgFade() {
    fadeTo(currentImg, slideSpeed, 0);
    fadeTo(randomImg, slideSpeed, 1);
  }

  function imgLoop() {
    nextImgNumber = currentImgNumber + 1;
    previousImgNumber = currentImgNumber - 1;

    if (currentImgNumber == totalImgs) {
      nextImgNumber = 1;
    }

    if (currentImgNumber == 1) {
      previousImgNumber = totalImgs;
    }
  }

  function refreshImgs() {
    currentImg = bannerEl.querySelector('img:nth-of-type(' + currentImgNumber + ')');
    nextImg = bannerEl.querySelector('img:nth-of-type(' + nextImgNumber + ')');
    previousImg = bannerEl.querySelector('img:nth-of-type(' + previousImgNumber + ')');
    randomImg = bannerEl.querySelector('img:nth-of-type(' + randomImgNumber + ')');
  }

  function callFunctions() {
    imgLoop();
    refreshImgs();
  }

  function restartInterval() {
    clearInterval(interval);
    interval = setInterval(loopImages, autoSlide);
  }

  function loopImages() {
    var event = document.createEvent('HTMLEvents');
    event.initEvent('click', 1, 0);
    nextEl.dispatchEvent(event);
  }

  // Iterate over previous and next elements
  // On click, check direction, fade next image in and assign current image number
  var previousAndNext = [previousEl, nextEl];
  for (var t = 0; t < previousAndNext.length; t++) {
    if (totalImgs > 1) {
      previousAndNext[t].onclick = function(e) {
        var direction = e.target.getAttribute('class');
        if (direction == "next-img") {
          nextImgFade();
          currentImgNumber = nextImgNumber;
        } else {
          previousImgFade();
          currentImgNumber = previousImgNumber;
        }
        restartInterval();
        callFunctions();
      };
    }
  }

  loadImg();

  // Only set interval if there is more than 1 image
  if (totalImgs > 1) {
    var interval = setInterval(loopImages, autoSlide);
  }
})();