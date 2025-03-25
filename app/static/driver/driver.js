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
