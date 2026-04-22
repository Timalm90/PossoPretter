const slider = document.getElementById("slider");
const base = document.querySelector(".img-base");
const mirror = document.querySelector(".img-mirror");

const leftMask = document.querySelector(".img-container");
const rightMask = document.querySelector(".img-container-reversed");

const swapButton = document.getElementById("swapButton");

// --- SLIDER FILL ---
function updateSliderFill() {
  const val = (slider.value - slider.min) / (slider.max - slider.min) * 100;
  slider.style.background = `linear-gradient(to right, #62366F 0%, #62366F ${val}%, #ffffff  ${val}%, #ffffff 100%)`;
}

// --- SLIDER MOVEMENT ---
slider.addEventListener("input", () => {
  const pct = (slider.value - 50) / 61;
  const offset = pct * 50;

  base.style.transform = `translateX(${offset}%)`;
  mirror.style.transform = `scaleX(-1) translateX(${offset}%)`;

  updateSliderFill();
});

// Initialize on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', updateSliderFill);
} else {
  updateSliderFill();
}

swapButton.addEventListener("click", () => {
  leftMask.classList.toggle("mask-left");
  leftMask.classList.toggle("mask-right");

  rightMask.classList.toggle("mask-left");
  rightMask.classList.toggle("mask-right");

  swapButton.classList.toggle("rotated");
});