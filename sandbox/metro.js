const stations = [
  "MŁOCINY",
  "WAWRZYSZEW",
  "STARE BIELANY",
  "SŁODOWIEC",
  "MARYMONT",
  "PLAC WILSONA",
  "DWORZEC GDAŃSKI",
  "RATUSZ ARSENAŁ",
  "ŚWIĘTOKRZYSKA",
  "CENTRUM",
  "POLITECHNIKA",
  "POLE MOKOTOWSKIE",
  "RACŁAWICKA",
  "WIERZBNO",
  "WILANOWSKA",
  "SŁUŻEW",
  "URSYNÓW",
  "STOKŁOSY",
  "IMIELIN",
  "NATOLIN",
  "KABATY",
];

const routeDiv = document.querySelector("#route");
const routeText = document.createElement("span");

routeText.classList.add("scrolling-text");
routeText.innerText = stations.join(" - ");
routeDiv.appendChild(routeText);

function startScrolling() {
  const textWidth = routeText.getBoundingClientRect().width;
  const screenWidth = window.innerWidth;
  const totalDistance = textWidth; // Total distance to cover

  // Speed = pixels per second
  const speed = 200; // Adjust as needed
  const duration = (totalDistance / speed) * 1000; // Duration in ms

  let startTime = null;

  // Start just outside the right edge
  let currentX = screenWidth;

  function scroll(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    // Calculate position based on time elapsed
    currentX = screenWidth - (progress / duration) * totalDistance;

    routeText.style.transform = `translateX(${currentX}px)`;

    if (currentX > -textWidth) {
      requestAnimationFrame(scroll);
    } else {
      // Reset position once it scrolls out
      startTime = null;
      currentX = screenWidth;
      requestAnimationFrame(scroll);
    }
  }

  // ✅ Start at the right edge so it shows immediately
  routeText.style.transform = `translateX(${screenWidth}px)`;

  // ✅ Start the animation immediately
  requestAnimationFrame(scroll);
}

// ✅ Start after the DOM is loaded
startScrolling();
