const slider = document.getElementById("slider");
const base = document.querySelector(".img-base");
const mirror = document.querySelector(".img-mirror");

slider.addEventListener("input", () => {
  const pct = (slider.value - 50) / 50;   // -1 to +1
  const maxOffset = 200;                  // px movement range
  const offset = pct * maxOffset;

  // Move images under masks
  base.style.transform = `translateX(${offset}px)`;
  mirror.style.transform = `scaleX(-1) translateX(${-offset}px)`;
});
