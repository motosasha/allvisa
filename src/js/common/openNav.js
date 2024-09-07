export function openNav(target, state) {
  let bodyState = target.getAttribute("data-state");
  bodyState === state ? (target.dataset.state = "") : (target.dataset.state = state);
}
