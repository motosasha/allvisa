// touch/no-touch
"ontouchstart" in window
  ? document.documentElement.classList.add("touch")
  : document.documentElement.classList.add("no-touch");
