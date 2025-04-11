function post_line(key) {
  const form = document.getElementById("form");
  const data = {
    line: form.elements["line"].value.toUpperCase(),
    variant: key.toUpperCase(),
  };

  fetch("http://192.168.88.199:5000/route_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function variants(event) {
  event.preventDefault();
  const form = document.getElementById("form");
  const variantsDiv = document.getElementById("versions");
  const buttonsDiv = document.getElementById("buttons");

  const data = {
    line: form.elements["line"].value.toUpperCase(),
  };

  fetch("http://192.168.88.199:5000/driver", {
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

        addStopButtons(buttonsDiv);
      } else {
        variantsDiv.innerText = "Bad line";
      }
    });
}

function addStopButtons(container) {
  document.getElementById("next_stop")?.remove();
  document.getElementById("current_stop")?.remove();

  const nextStopBtn = document.createElement("button");
  nextStopBtn.id = "next_stop";
  nextStopBtn.innerText = "Next stop";
  nextStopBtn.onclick = next_stop;

  const currentStopBtn = document.createElement("button");
  currentStopBtn.id = "current_stop";
  currentStopBtn.innerText = "Current stop";
  currentStopBtn.onclick = current_stop;

  container.appendChild(nextStopBtn);
  container.appendChild(currentStopBtn);
}

function next_stop() {
  const data = {
    next_stop: true,
  };
  fetch("http://19192.168.88.199:5000xt_stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function current_stop() {
  const data = {
    current_stop: true,
  };
  fetch("http://192.168.88.199:5000/current_stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
