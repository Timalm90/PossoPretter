const slider = document.getElementById("slider");
const base = document.querySelector(".img-base");
const mirror = document.querySelector(".img-mirror");


const leftMask = document.querySelector(".img-container");
const rightMask = document.querySelector(".img-container-reversed");

const swapButton = document.getElementById("swapButton");

// --- SLIDER MOVEMENT---
slider.addEventListener("input", () => {
  const pct = (slider.value - 50) / 61;
  const offset = pct * 50; // percent-based

  base.style.transform = `translateX(${offset}%)`;
  mirror.style.transform = `scaleX(-1) translateX(${offset}%)`;
});


swapButton.addEventListener("click", () => {
  leftMask.classList.toggle("mask-left");
  leftMask.classList.toggle("mask-right");

  rightMask.classList.toggle("mask-left");
  rightMask.classList.toggle("mask-right");
});
