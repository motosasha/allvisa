// Adding 1vh (use: height: 100vh; height: calc(var(--vh, 1vh) * 100);) to fix 100vh on mobile phones
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty("--vh", `${vh}px`);
window.addEventListener("resize", () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
});
