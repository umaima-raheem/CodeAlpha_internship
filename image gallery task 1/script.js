const modal = document.getElementById("modal");
const modalImg = document.getElementById("modal-img");
const caption = document.getElementById("caption");
const counter = document.getElementById("counter");
const images = document.querySelectorAll(".gallery img");
const close = document.querySelector(".close");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const pauseBtn = document.getElementById("pauseBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const zoomBtn = document.getElementById("zoomBtn");
const downloadBtn = document.getElementById("downloadBtn");
const thumbnails = document.getElementById("thumbnails");

let currentIndex = 0;
let slideshowInterval;
let isPlaying = true;
let isZoomed = false;

images.forEach((img, index) => {
  img.addEventListener("click", () => openModal(index));
});

function openModal(index) {
  modal.style.display = "block";
  currentIndex = index;
  showImage(currentIndex);
  generateThumbnails();
  startSlideshow();
}

function showImage(index) {
  modalImg.src = images[index].src;
  caption.textContent = images[index].alt;
  counter.textContent = `Image ${index + 1} of ${images.length}`;
  updateThumbnailHighlight();
  downloadBtn.setAttribute("href", images[index].src);
}

function startSlideshow() {
  stopSlideshow();
  slideshowInterval = setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  }, 3000);
  isPlaying = true;
  pauseBtn.textContent = "⏸ Pause";
}

function stopSlideshow() {
  clearInterval(slideshowInterval);
  isPlaying = false;
  pauseBtn.textContent = "▶ Play";
}

function generateThumbnails() {
  thumbnails.innerHTML = "";
  images.forEach((img, index) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    thumb.alt = img.alt;
    if (index === currentIndex) thumb.classList.add("active");
    thumb.addEventListener("click", () => {
      currentIndex = index;
      showImage(currentIndex);
    });
    thumbnails.appendChild(thumb);
  });
}

function updateThumbnailHighlight() {
  thumbnails.querySelectorAll("img").forEach((thumb, index) => {
    thumb.classList.toggle("active", index === currentIndex);
  });
}

close.onclick = () => {
  modal.style.display = "none";
  stopSlideshow();
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
};

pauseBtn.onclick = () => {
  isPlaying ? stopSlideshow() : startSlideshow();
};

fullscreenBtn.onclick = () => {
  if (!document.fullscreenElement) modal.requestFullscreen();
  else document.exitFullscreen();
};

zoomBtn.onclick = () => {
  isZoomed = !isZoomed;
  modalImg.style.transform = isZoomed ? "scale(1.5)" : "scale(1)";
};

downloadBtn.onclick = () => {
  const link = document.createElement("a");
  link.href = images[currentIndex].src;
  link.download = `image-${currentIndex + 1}`;
  link.click();
};

// Keyboard Support
document.addEventListener("keydown", (e) => {
  if (modal.style.display === "block") {
    if (e.key === "ArrowRight") nextBtn.click();
    else if (e.key === "ArrowLeft") prevBtn.click();
    else if (e.key === "Escape") close.click();
  }
});

// Touch Swipe Support
let startX = 0;
modal.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});
modal.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  if (startX - endX > 50) nextBtn.click();
  if (endX - startX > 50) prevBtn.click();
});
