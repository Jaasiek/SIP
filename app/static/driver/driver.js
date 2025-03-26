function post_line(key) {
  const form = document.getElementById("form");
  const data = {
    line: form.elements["line"].value.toUpperCase(),
    variant: key.toUpperCase(),
  };

  fetch("http://127.0.0.1:5000/route_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function variants() {
  const form = document.getElementById("form");
  const variantsDiv = document.getElementById("versions");

  const data = {
    line: form.elements["line"].value.toUpperCase(),
  };

  fetch("http://127.0.0.1:5000/driver", {
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
          svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          svg.setAttribute("height", "24px");
          svg.setAttribute("viewBox", "0 -960 960 960");
          svg.setAttribute("width", "24px");
          svg.setAttribute("fill", "#000000");

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
        variantsDiv.innerText = "No variants found.";
      }
    })
    .catch((error) => console.error("Error:", error));
}

function next_stop() {
  const data = {
    next_stop: true,
  };
  fetch("http://127.0.0.1:5000/next_stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}

function current_stop() {
  const data = {
    current_stop: true,
  };
  fetch("http://127.0.0.1:5000/current_stop", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
}
