window.addEventListener("DOMContentLoaded", initialDraw);
document.getElementById("runButton")
  .addEventListener("click", drawMap);

async function initialDraw() {
  await demers.buildGraph(false);
  await drawMap();
}

async function drawMap() {
  console.log("Redrawing...");
  await demers.redraw({});
}