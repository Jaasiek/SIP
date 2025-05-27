socket.on("update_route", (data) => {
  loaded = true;
  LoadLine(data);
  console.log(data);
});

const buttonsDiv = document.querySelector("#buttons");
const form = document.getElementById("form");
const variantsDiv = document.getElementById("versions");
const lineDataDiv = document.getElementById("line_data");
const lineDiv = document.getElementById("line");
const directionDiv = document.getElementById("direction");

function post_line(key) {
  const data = {
    line: form.elements["line"].value.toUpperCase(),
    variant: key.toUpperCase(),
  };

  fetch("http://192.168.88.187:5000/route_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
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

  lineDiv.innerText = data.line;
  directionDiv.innerText = data.route.direction.toUpperCase();
  data.route.stops.forEach((stop) => {
    console.log(`${stop.name} ${stop.stop_number}`);
  });
}
