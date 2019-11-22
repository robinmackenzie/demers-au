window.addEventListener("DOMContentLoaded", initialDraw);
document.getElementById("runButton")
  .addEventListener("click", drawMap);

async function initialDraw() {
  await demers.buildGraph(false);
  const opts = {
    "useLinks": document.getElementById("useLinks").checked,
    "nodeSize": parseInt(document.getElementById("nodeSize").value),
  }
  await drawMap(opts);
}

async function drawMap(opts) {
  await demers.redraw(opts);
}