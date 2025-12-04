const slider = document.getElementById("slider");
const base = document.querySelector(".img-base");
const mirror = document.querySelector(".img-mirror");

const leftMask = document.querySelector(".img-container");
const rightMask = document.querySelector(".img-container-reversed");

const swapBtn = document.getElementById("swapBtn");

// --- SLIDER MOVEMENT LOGIC ---
slider.addEventListener("input", () => {
  const pct = (slider.value - 50) / 50;
  const maxOffset = 200;
  const offset = pct * maxOffset;

  base.style.transform = `translateX(${offset}px)`;
  mirror.style.transform = `scaleX(-1) translateX(${offset}px)`;
});

// --- SWAP MASKS ---
swapBtn.addEventListener("click", () => {
  leftMask.classList.toggle("mask-left");
  leftMask.classList.toggle("mask-right");

  rightMask.classList.toggle("mask-left");
  rightMask.classList.toggle("mask-right");
});


//-------------------------------------------------------//
