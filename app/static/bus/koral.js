let divStopsContent = "";

socket.on("update_route", (data) => {
  loaded = true;
  load_line(data);
});

const line_div = document.querySelector("#line");
const line_type = document.querySelector("#line_type");
const time = document.querySelector("#time");
const day_of_the_week = document.querySelector("#day_of_the_week");
const date = document.querySelector("#date");
const stops_div = document.querySelector("#stops");

function load_line(data) {
  divStopsContent = "";
  line_div.style.background = "none";
  line_div.style.color = "#333";

  if (data.line.startsWith("1") || data.line.startsWith("2")) {
    line_div.innerText = data.line;
    line_type.innerText = "Linia zwykła";
  } else if (data.line.startsWith("3")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "Linia okresowa";
  } else if (data.line.startsWith("4")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "Linia przyspieszona okresowa";
  } else if (data.line.startsWith("5")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "Linia przyspieszona";
  } else if (data.line.startsWith("7")) {
    line_div.style.color = "rgb(31, 167, 31)";
    line_div.innerText = data.line;
    line_type.innerText = "Linia strefowa";
  } else if (data.line.startsWith("8")) {
    line_div.style.color = "rgb(31, 167, 31)";
    line_div.innerText = data.line;
    line_type.innerText = "Linia strefowa okresowa";
  } else if (data.line.startsWith("9")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "Linia specjalna";
  } else if (data.line.startsWith("N")) {
    line_div.style.color = "white";
    line_div.style.background = "rgb(18, 18, 138)";
    line_div.innerText = data.line;
    line_type.innerText = "Linia nocna";
  } else if (data.line.startsWith("E")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "Linia ekspresowa";
  }

  console.log(data.route.stops);

  stops = data.route.stops.reverse();

  stops_div.innerHTML = "";

  stops.forEach((stop, index) => {
    const positionPercent =
      stops.length === 1 ? 50 : (index / (stops.length - 1)) * 100;

    const stopElement = document.createElement("div");
    stopElement.className = "stop-wrapper";
    stopElement.style.left = `${positionPercent}%`;

    const imgSrc =
      stop.type === "2"
        ? "/static/bus/icons/stop_on_request.svg"
        : "/static/bus/icons/stop.svg";

    stopElement.innerHTML = `
    <div class="stop">
    <p class="time">0'</p>
    <span class="rotated-stop">
      <img src="${imgSrc}" />
      <p>${stop.name}</p>
    </span>
    </div>
  `;

    stops_div.appendChild(stopElement);
  });
}

function time_load() {
  const weekdays = ["ndz.", "pon.", "wt.", "śr.", "czw.", "pt.", "sob."];
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
  date.innerText = `${addZero(day_of_the_month.toString())}.${addZero(
    (month + 1).toString()
  )}.${year.toString()}`;
}

setInterval(() => {
  time_load();
}, 1000);
