let stations = [];
let backgroundChanged = false;

const routeDiv = document.querySelector("#route");
const routeText = document.createElement("span");
const line_div = document.querySelector("#line");
const direction_div = document.querySelector(".direction");

function load_line() {
  fetch("/route_get")
    .then((response) => response.json())
    .then((data) => {
      line_div.innerText = data.line;
      stations = data.stops;

      if (stations.length > 0) {
        direction_div.innerText = stations.pop();
        routeText.classList.add("scrolling-text");
        routeText.innerText = stations.join(" - ");
        routeDiv.appendChild(routeText);

        startScrolling();
        // const header = document.querySelector("header");
        // header.style.backgroundColor = "red";
      } else {
        console.log("No data yet");
        setTimeout(() => {
          load_line();
        }, 1000);
      }
    });
}

function startScrolling() {
  setTimeout(() => {
    const textWidth = routeText.getBoundingClientRect().width;
    const screenWidth = window.innerWidth;
    const totalDistance = textWidth;

    const speed = 500;
    const duration = (totalDistance / speed) * 1000;

    let startTime = null;
    let currentX = screenWidth;

    function scroll(timestamp) {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      currentX = screenWidth - (progress / duration) * totalDistance;

      routeText.style.transform = `translateX(${currentX}px)`;

      if (currentX > -textWidth) {
        requestAnimationFrame(scroll);
      } else {
        if (!backgroundChanged) {
          const header = document.querySelector("header");
          // header.style.backgroundColor = "red";
          backgroundChanged = true;
        }
        startTime = null;
        currentX = screenWidth;
        requestAnimationFrame(scroll);
      }
    }

    routeText.style.transform = `translateX(${screenWidth}px)`;

    requestAnimationFrame(scroll);
  }, 100);
}

if (stations.length === 0) {
  setTimeout(() => {
    load_line();
  }, 1000);
}

document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    load_line();
  }
});
