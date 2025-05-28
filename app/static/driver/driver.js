socket.on("update_route", (data) => {
  loaded = true;
  LoadLine(data);
  console.log(data);
});

const buttonsDiv = document.querySelector("#buttons");
const form = document.getElementById("form");
const formDriver = document.getElementById("driver_number");
const variantsDiv = document.getElementById("versions");
const lineDataDiv = document.getElementById("line_data");
const lineDiv = document.getElementById("line");
const directionDiv = document.getElementById("direction");
const driverIDp = document.getElementById("driverID");
const driverDiv = document.getElementById("driver");
// const timeDiv = document.getElementById("time");

function post_line(key) {
  const data = {
    line: form.elements["lineInput"].value.toUpperCase(),
    brigade: form.elements["brigade"].value,
    variant: key.toUpperCase(),
    driverID: formDriver.elements["driver_number"].value,
  };

  fetch("http://192.168.88.187:5000/route_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function login(event) {
  event.preventDefault();

  formDriver.style.display = "none";
  form.style.display = "flex";
}

function variants(event) {
  event.preventDefault();

  const data = {
    line: form.elements["line"].value.toUpperCase(),
  };

  fetch("http://192.168.88.187:5000/driver", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      variantsDiv.innerHTML = "";

      if (data.variants && data.variants.variants) {
        Object.entries(data.variants.variants).forEach(([key, variant]) => {
          const variantSpan = document.createElement("span");

          const directionP = document.createElement("p");
          directionP.innerText = `${variant.starting} `;

          const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
          );
          svg.setAttribute("height", "24px");
          svg.setAttribute("viewBox", "0 -960 960 960");
          svg.setAttribute("width", "24px");
          svg.setAttribute("fill", "#FFFFFF");

          const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
          );
          path.setAttribute(
            "d",
            "M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z"
          );

          svg.appendChild(path);
          directionP.appendChild(svg);
          directionP.appendChild(
            document.createTextNode(` ${variant.direction}`)
          );

          const selectButton = document.createElement("button");
          selectButton.innerHTML =
            '<svg xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#75FB4C"><path d="M379.33-244 154-469.33 201.67-517l177.66 177.67 378.34-378.34L805.33-670l-426 426Z"/></svg>';
          selectButton.onclick = () => post_line(key);

          variantSpan.appendChild(directionP);
          variantSpan.appendChild(selectButton);

          variantsDiv.appendChild(variantSpan);
        });
      } else {
        variantsDiv.innerText = "Bad line";
      }
    });
}

function addStopButtons(container) {
  document.getElementById("next_stop")?.remove();
  document.getElementById("current_stop")?.remove();
  document.getElementById("check_out")?.remove();

  const nextStopBtn = document.createElement("button");
  nextStopBtn.id = "next_stop";
  nextStopBtn.innerText = "Next stop";
  nextStopBtn.onclick = nextStop;

  const checkOutBtn = document.createElement("button");
  checkOutBtn.id = "check_out";
  checkOutBtn.innerText = "Check OUT";
  checkOutBtn.onclick = checkOut;

  const currentStopBtn = document.createElement("button");
  currentStopBtn.id = "current_stop";
  currentStopBtn.innerText = "Current stop";
  currentStopBtn.onclick = CurrentStop;

  container.appendChild(nextStopBtn);
  container.appendChild(checkOutBtn);
  container.appendChild(currentStopBtn);
}

function nextStop() {
  const data = {
    next_stop: true,
  };
  fetch("http://192.168.88.187:5000/next_stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function CurrentStop() {
  const data = {
    current_stop: true,
  };
  fetch("http://192.168.88.187:5000/current_stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function checkOut() {
  const variantsDiv = document.getElementById("versions");
  variantsDiv.style.display = "flex";
  buttonsDiv.style.display = "none";
  form.style.display = "flex";
  lineDataDiv.style.display = "none";
}

function LoadLine(data) {
  const variantsDiv = document.getElementById("versions");
  variantsDiv.style.display = "none";
  addStopButtons(buttonsDiv);
  buttonsDiv.style.display = "flex";
  form.style.display = "none";
  lineDataDiv.style.display = "flex";

  lineDiv.innerText = `${data.line}/${data.brigade}`;
  driverDiv.style.display = "flex";
  driverIDp.innerText = data.driverID;

  data.route.stops.forEach((stop) => {
    console.log(`${stop.name} ${stop.stop_number}`);
  });

  function checkScrollingDirection() {
    const direction = document.getElementById("direction");
    if (direction.scrollWidth > 475) {
      direction.classList.add("scrolling");
    } else {
      direction.classList.remove("scrolling");
    }
  }
  if (data.variant.startsWith("TD") || data.variant.startsWith("TZ")) {
    directionDiv.innerText = "Przejazd Techniczny";
    directionDiv.style.color = "red";
  } else {
    directionDiv.innerText = data.route.direction.toUpperCase();
    directionDiv.style.color = "white";
  }
  checkScrollingDirection();
}

// function time() {
//   const date_creator = new Date();
//   function addZero(i) {
//     if (i < 10) {
//       i = "0" + i;
//     }
//     return i;
//   }

//   const hours = date_creator.getHours();
//   const minutes = date_creator.getMinutes();
//   const seconds = date_creator.getSeconds();

//   timeDiv.innerText = `${addZero(hours)}:${addZero(minutes)}:${addZero(
//     seconds
//   )}`;
// }

// setInterval(() => {
//   time();
// }, 500);
