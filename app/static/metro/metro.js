let stations = [];

const routeDiv = document.querySelector("#route");
const routeText = document.createElement("span");
const line_div = document.querySelector("#line");
const direction_div = document.querySelector(".direction");

function load_line() {
  fetch("/route_get")
    .then((response) => response.json())
    .then((data) => {
      stations = data.stops;
      line_div.innerText = data.line;
      direction_div.innerText = stations[stations.length - 1];
      routeText.classList.add("scrolling-text");
      routeText.innerText = stations.join(" - ");
      routeDiv.appendChild(routeText);
      console.log(data);

      // Call startScrolling only after the text has been added to the DOM
      startScrolling();
    });
}

function startScrolling() {
  // Ensure the element has been fully rendered before calculating the width
  setTimeout(() => {
    const textWidth = routeText.getBoundingClientRect().width;
    const screenWidth = window.innerWidth;
    const totalDistance = textWidth;

    const speed = 200;
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
        startTime = null;
        currentX = screenWidth;
        requestAnimationFrame(scroll);
      }
    }

    routeText.style.transform = `translateX(${screenWidth}px)`;

    requestAnimationFrame(scroll);
  }, 100); // Use a slight delay to ensure the element has rendered
}

load_line();
