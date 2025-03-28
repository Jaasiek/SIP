let streets = [];
let previoust_stop = null;
let previoust_stop_number = null;
let scrollingPaused = false;
let activeScreen = null;
let loaded = false;
let timeBoardTimeout = null;
let shortened_course = false;
let direction = null;

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

socket.on("next_stop", (data) => {
  nextStop(data);
});

socket.on("current_stop", (data) => {
  current_stop(data);
});

socket.on("update_route", (data) => {
  loaded = true;
  load_line(data);
});

function load_line(data) {
  if (loaded) {
    if (data.success == true) {
      streets = data.route.streets;

      if (streets.length > 0) {
        if (
          data.line.startsWith("4") ||
          data.line.startsWith("5") ||
          data.line.startsWith("C") ||
          data.line.startsWith("8") ||
          data.line.startsWith("9")
        ) {
          line_div.style.color = "red";
          line_div.innerText = data.line;
        } else if (data.line.startsWith("7") || data.line.startsWith("Z")) {
          line_div.style.color = "rgb(31, 167, 31)";
          line_div.innerText = data.line;
        } else if (data.line.startsWith("N")) {
          line_div.style.color = "white";
          line_div.style.background = "rgb(18, 18, 138)";
          line_div.innerText = data.line;
        } else {
          line_div.style.color = "#333";
          line_div.innerText = data.line;
        }

        routeText.classList.add("scrolling-text");

        if (data.variant.startsWith("TX")) {
          shortened_course = true;
          direction = data.route.direction;
          direction_div.innerText = `${data.route.direction} - kurs skrócony`;
          direction_div.style.background = "red";
          direction_div.style.color = "white";

          const lastStopSpan = document.createElement("span");
          lastStopSpan.innerText = `Ostatni przystanek: ${data.route.direction}`;
          lastStopSpan.style.background = "red";
          lastStopSpan.style.color = "white";
          lastStopSpan.style.padding = "2px 5px";
          lastStopSpan.style.borderRadius = "5px";

          routeText.innerText = `TRASA: ${streets.join(" - ")} `;
          routeText.appendChild(lastStopSpan);
        } else {
          direction_div.style.color = "#333";
          direction_div.style.background = "white";
          direction_div.innerText = data.route.direction;

          routeText.innerText = `TRASA: ${streets.join(" - ")}`;
        }

        routeDiv.appendChild(routeText);
        routeDiv.appendChild(routeText);

        startScrolling();
      }
    } else {
      console.log("No data yet");
    }
  }
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
  if (scrollingPaused || activeScreen !== null) return;
  activeScreen = "time_board";

  const textWidth = routeText.getBoundingClientRect().width;
  const screenWidth = window.innerWidth;
  const totalDistance = textWidth;

  const speed = 250;
  const duration = (totalDistance / speed) * 1000;

  let startTime = null;
  let currentX = screenWidth;

  function scroll(timestamp) {
    if (scrollingPaused || activeScreen !== "time_board") return;
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;

    currentX = screenWidth - (progress / duration) * totalDistance;

    routeText.style.transform = `translateX(${currentX}px)`;

    if (currentX > -textWidth) {
      requestAnimationFrame(scroll);
    } else {
      routeText.style.transform = `translateX(${screenWidth}px)`;

      header.style.display = "none";
      time_board_display = true;
      time_board.style.display = "flex";

      timeBoardTimeout = setTimeout(() => {
        if (activeScreen === "time_board") {
          time_board.style.display = "none";
          header.style.display = "flex";
          activeScreen = null;
          startScrolling();
        }
      }, 5000);
    }
  }

  requestAnimationFrame(scroll);
}

function nextStop(data) {
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
    stop_name.style.color = "#333";
    stop_name.style.fontWeight = "bold";
    info.style.color = "#333";

    if (activeScreen === "time_board" && timeBoardTimeout) {
      clearTimeout(timeBoardTimeout);
      time_board.style.display = "none";
    }

    scrollingPaused = true;
    activeScreen = "next_stop";
    header.style.display = "none";

    const audio = new Audio(
      `http://127.0.0.1:5000/next_stop_announcement/${encodeURIComponent(
        data.next_stop
      )}.mp3`
    );

    audio.play().catch((error) => {
      console.log("Błąd podczas odtwarzania:", error);
    });

    info.innerText = "NASTĘPNY PRZYSTANEK:";

    let count = 0;
    const interval = setInterval(() => {
      info.innerText = count % 2 === 0 ? "NEXT STOP:" : "NASTĘPNY PRZYSTANEK:";
      count++;
      if (count >= 4) clearInterval(interval);
    }, 2000);

    stop_name.innerText = data.next_stop;

    setTimeout(() => {
      if (activeScreen === "next_stop") {
        info.innerText = "";
        stop_name.innerText = "";
        scrollingPaused = false;
        header.style.display = "flex";
        activeScreen = null;
        startScrolling();
      }
    }, 10000);
  }
}

function current_stop(data) {
  if (!data.success) {
    console.log("No data yet");
    return;
  }
  stop_name.style.color = "rgb(139, 9, 139)";
  stop_name.style.fontWeight = "bold";
  info.style.color = "rgb(139, 9, 139)";

  if (activeScreen === "time_board" && timeBoardTimeout) {
    clearTimeout(timeBoardTimeout);
    time_board.style.display = "none";
  }

  scrollingPaused = true;
  header.style.display = "none";

  if (data.stop_type == "4") {
    const audio = new Audio(
      `http://127.0.0.1:5000/last_stop_announcement/${encodeURIComponent(
        data.current_stop
      )}.mp3`
    );

    audio.play().catch((error) => {
      console.log("Błąd podczas odtwarzania:", error);
    });
  } else {
    const audio = new Audio(
      `http://127.0.0.1:5000/current_stop_announcement/${encodeURIComponent(
        data.current_stop
      )}.mp3`
    );

    audio.play().catch((error) => {
      console.log("Błąd podczas odtwarzania:", error);
    });
  }

  info.innerText = "PRZYSTANEK:";

  let count = 0;
  const interval = setInterval(() => {
    info.innerText = count % 2 === 0 ? "CURRENT STOP:" : "PRZYSTANEK:";
    count++;
    if (count >= 4) clearInterval(interval);
  }, 2000);
  stop_name.innerText = data.current_stop;

  if (streets.length > 0 && streets[0] !== data.stop_street) {
    streets.shift();
    if (shortened_course) {
      const lastStopSpan = document.createElement("span");
      lastStopSpan.innerText = `Ostatni przystanek: ${direction}`;
      lastStopSpan.style.background = "red";
      lastStopSpan.style.color = "white";
      lastStopSpan.style.padding = "2px 5px";
      lastStopSpan.style.borderRadius = "5px";

      routeText.innerText = `TRASA: ${streets.join(" - ")} `;
      routeText.appendChild(lastStopSpan);
    } else {
      routeText.innerText = `TRASA: ${streets.join(" - ")}`;
    }
  }

  setTimeout(() => {
    info.innerText = "";
    stop_name.innerText = "";
    scrollingPaused = false;
    header.style.display = "flex";
    activeScreen = null;
    startScrolling();
  }, 10000);
}

if (streets.length === 0) {
  setTimeout(() => {
    load_line();
  }, 1000);
}

setInterval(() => {
  blue_board();
}, 500);
