function post_line(event) {
  event.preventDefault();

  const form = document.getElementById("form");
  const data = {
    line: form.elements["line"].value.toUpperCase(),
    variant: form.elements["variant"].value.toUpperCase(),
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
      // Clear previous content
      variantsDiv.innerHTML = "";

      if (data.variants && data.variants.variants) {
        Object.entries(data.variants.variants).forEach(([key, variant]) => {
          const variantSpan = document.createElement("span");

          // ➡️ Create a name element
          const nameHeading = document.createElement("h3");
          nameHeading.innerText = key; // Add the variant name (e.g., TD-3MWL)

          // ➡️ Create direction and starting elements
          const directionP = document.createElement("p");
          const nameP = document.createElement("p");

          directionP.innerText = `Direction: ${variant.direction}`;
          nameP.innerText = `Starting: ${variant.starting}`;

          // ➡️ Append elements in order
          variantSpan.appendChild(nameHeading);
          variantSpan.appendChild(directionP);
          variantSpan.appendChild(nameP);

          // ➡️ Append to the main div
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
