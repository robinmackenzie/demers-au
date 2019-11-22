window.addEventListener("DOMContentLoaded", initialDraw);
document.getElementById("runButton")
  .addEventListener("click", drawMap);

async function initialDraw() {
  await demers.buildGraph(false);
  await drawMap();
}

async function drawMap() {
  const opts = {
    "useLinks": document.getElementById("useLinks").checked,
    "nodeSize": parseInt(document.getElementById("nodeSize").value),
  }
  await demers.redraw(opts);
}