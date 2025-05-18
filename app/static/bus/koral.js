let divStopsContent = "";
let previoust_stop = "";

socket.on("update_route", (data) => {
  loaded = true;
  LoadLine(data);
});

socket.on("next_stop", (data) => {
  NextStop(data);
});

socket.on("current_stop", (data) => {
  CurrentStop(data);
});

const line_div = document.querySelector("#line");
const line_type = document.querySelector("#line_type");
const time = document.querySelector("#time");
const day_of_the_week = document.querySelector("#day_of_the_week");
const date = document.querySelector("#date");
const stops_div = document.querySelector("#stops");
const stop_name_div = document.querySelector("#stop_name");
const info_stop_div = document.querySelector("#info_stop");
const announcement_span = document.querySelector("#announcement");

function sanitizeStopName(stopName) {
  return stopName.replace(/[\s\-."'()]+/g, "");
}

function LoadLine(data) {
  divStopsContent = "";
  line_div.style.background = "none";
  line_div.style.color = "#333";

  if (data.line.startsWith("1") || data.line.startsWith("2")) {
    line_div.innerText = data.line;
    line_type.innerText = "linia zwykła";
  } else if (data.line.startsWith("3")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "linia okresowa";
  } else if (data.line.startsWith("4")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "linia przyspieszona okresowa";
  } else if (data.line.startsWith("5")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "linia przyspieszona";
  } else if (data.line.startsWith("7")) {
    line_div.style.color = "rgb(31, 167, 31)";
    line_div.innerText = data.line;
    line_type.innerText = "linia strefowa";
  } else if (data.line.startsWith("8")) {
    line_div.style.color = "rgb(31, 167, 31)";
    line_div.innerText = data.line;
    line_type.innerText = "linia strefowa okresowa";
  } else if (data.line.startsWith("9")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "linia specjalna";
  } else if (data.line.startsWith("N")) {
    line_div.style.color = "white";
    line_div.style.background = "rgb(18, 18, 138)";
    line_div.innerText = data.line;
    line_type.innerText = "linia nocna";
  } else if (data.line.startsWith("E")) {
    line_div.style.color = "red";
    line_div.innerText = data.line;
    line_type.innerText = "linia ekspresowa";
  }

  stops = data.route.stops;

  announcement_span.style.color = "rgb(139, 9, 139)";
  info_stop_div.innerText = "Przystanek: ";
  stop_name_div.innerText = stops[0].name;
  previoust_stop = stops[0].name;

  stops_div.innerHTML = "";

  stops.forEach((stop, index) => {
    const positionPercent =
      stops.length === 1 ? 50 : (index / (stops.length - 1)) * 100;

    const stopElement = document.createElement("div");
    stopElement.style.left = `${positionPercent}%`;

    const imgSrc =
      stop.type === "2"
        ? "/static/bus/icons/stop_on_request.svg"
        : "/static/bus/icons/stop.svg";

    let stop_name = sanitizeStopName(stop.name);

    stopElement.innerHTML = `
    <span class="rotated-stop">
      <img src="${imgSrc}" />
      <p>${stop.name}</p>
    </span>
    </div>
  `;

    stops_div.appendChild(stopElement);
  });
}

function NextStop(data) {
  announcement_span.style.color = "black";
  if (previoust_stop != "") {
    document.querySelector(`#${sanitizeStopName(previoust_stop)}`).style.color =
      "black";
  }
  info_stop_div.innerText = "Następny przystanek: ";
  stop_name_div.innerText = data.next_stop;

  if (previoust_stop !== "") {
    document
      .querySelector(`#${sanitizeStopName(previoust_stop)}`)
      .classList.add("disabled");
  }
}

function CurrentStop(data) {
  announcement_span.style.color = "rgb(139, 9, 139)";
  info_stop_div.innerText = "Przystanek: ";
  stop_name_div.innerText = data.current_stop;

  if (data.current_stop.endsWith("NA ŻĄDANIE (ON REQUEST)")) {
    const name = data.current_stop.replace("- NA ŻĄDANIE (ON REQUEST)", " ");
    document.querySelector(
      `#${sanitizeStopName(name)}${data.stop_number}`
    ).style.color = "rgb(139, 9, 139)";
    previoust_stop = `${name}${data.stop_number}`;
  } else {
    previoust_stop = `${data.current_stop}${data.stop_number}`;
    document.querySelector(
      `#${sanitizeStopName(data.current_stop)}${data.stop_number}`
    ).style.color = "rgb(139, 9, 139)";
  }
}

function TimeLoad() {
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
  TimeLoad();
}, 1000);
