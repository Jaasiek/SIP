let streets = [];
let previoust_stop = null;
let previoust_stop_number = null;
let scrollingPaused = false;

const routeDiv = document.querySelector("#route");
const routeText = document.createElement("span");
const line_div = document.querySelector("#line");
const direction_div = document.querySelector(".direction");
const time = document.querySelector("#time");
const day_of_the_week = document.querySelector("#day_of_the_week");
const date = document.querySelector("#other");
const info = document.querySelector("#information");
const stop_name = document.querySelector("#stop_name");
const header = document.querySelector("header");
const time_board = document.querySelector("#blue_board");
const stop = document.querySelector("#stop_info");

function load_line() {
  fetch("/route_get")
    .then((response) => response.json())
    .then((data) => {
      if (data.success == true) {
        streets = data.route.streets;

        if (streets.length > 0) {
          line_div.innerText = data.line;
          direction_div.innerText = data.route.direction;
          routeText.classList.add("scrolling-text");
          routeText.innerText = streets.join(" - ");
          routeDiv.appendChild(routeText);

          startScrolling();
        }
      } else {
        console.log("No data yet");
        setTimeout(() => {
          load_line();
        }, 1000);
      }
    });
}

function blue_board() {
  const months = [
    "stycznia",
    "lutego",
    "marca",
    "kwietnia",
    "maja",
    "czerwca",
    "lipca",
    "sierpnia",
    "września",
    "października",
    "listopada",
    "grudnia",
  ];
  const weekdays = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];
  const date_creator = new Date();
  function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }

  const year = date_creator.getFullYear();
  const month = date_creator.getMonth();
  const day = date_creator.getDay();
  const day_of_the_month = date_creator.getDate();
  const hours = date_creator.getHours();
  const minutes = date_creator.getMinutes();

  time.innerText = `${addZero(hours)}:${addZero(minutes)}`;
  day_of_the_week.innerText = `${weekdays[day]}`;
  date.innerText = `${day_of_the_month.toString()} ${
    months[month]
  } ${year.toString()}`;
}

function startScrolling() {
  if (scrollingPaused) return;
  const textWidth = routeText.getBoundingClientRect().width;
  const screenWidth = window.innerWidth;
  const totalDistance = textWidth;

  const speed = 500;
  const duration = (totalDistance / speed) * 1000;

  let startTime = null;
  let currentX = screenWidth;

  function scroll(timestamp) {
    if (scrollingPaused) return;
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    currentX = screenWidth - (progress / duration) * totalDistance;

    routeText.style.transform = `translateX(${currentX}px)`;

    if (currentX > -textWidth) {
      requestAnimationFrame(scroll);
    } else {
      routeText.style.transform = `translateX(${screenWidth}px)`;

      header.style.display = "none";
      time_board.style.display = "flex";

      setTimeout(() => {
        time_board.style.display = "none";
        header.style.display = "flex";

        setTimeout(() => {
          startScrolling();
        }, 500);
      }, 5000);
    }
  }

  requestAnimationFrame(scroll);
}

function nextStop() {
  fetch("/next_stop")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.log("No data yet");
        return;
      }

      if (
        data.next_stop !== previoust_stop ||
        data.stop_number !== previoust_stop_number
      ) {
        previoust_stop = data.next_stop;
        previoust_stop_number = data.stop_number;
        stop_name.style.color = "black";
        info.style.color = "black";

        scrollingPaused = true;
        header.style.display = "none";

        info.innerText = "Następny przystanek:";
        stop_name.innerText = data.next_stop;

        setTimeout(() => {
          info.innerText = "";
          stop_name.innerText = "";
          scrollingPaused = false;
          header.style.display = "flex";
          startScrolling();
        }, 5000);
      }
    });
}

function current_stop() {
  fetch("/current_stop")
    .then((response) => response.json())
    .then((data) => {
      if (!data.success) {
        console.log("No data yet");
        return;
      }
      if (
        data.current_stop !== previoust_stop ||
        data.stop_number !== previoust_stop_number
      ) {
        scrollingPaused = true;
        header.style.display = "none";
        info.style.color = "red";
        info.innerText = "Przystanek:";
        stop_name.style.color = "red";
        stop_name.innerText = data.current_stop;

        setTimeout(() => {
          info.innerText = "";
          stop_name.innerText = "";
          scrollingPaused = false;
          header.style.display = "flex";
          startScrolling();
        }, 5000);
      }
    });
}

if (streets.length === 0) {
  setTimeout(() => {
    load_line();
  }, 1000);
}

document.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    load_line();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.key === " ") {
    nextStop();
  }
});

setInterval(() => {
  blue_board();
}, 500);

setInterval(() => {
  nextStop();
  // setTimeout(current_stop, 2000);
}, 5000);
