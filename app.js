window.addEventListener("DOMContentLoaded", initialDraw);
document.getElementById("runButton").addEventListener("click", drawMap);

async function initialDraw() {
  await demers.buildGraph(false);
  await drawMap();
}

async function drawMap() {
  const opts = {
    "useLinks": document.getElementById("useLinks").checked,
    "nodeSize": parseInt(document.getElementById("nodeSize").value),
    "linkForceStrength": parseFloat(document.getElementById("linkForceStrength").value),
    "collisionForceFactor": parseFloat(document.getElementById("collisionForceFactor").value),
    "svgHeight": document.getElementById("wrapper").clientHeight,
    "svgWidth": document.getElementById("wrapper").clientWidth
  }
  await demers.redraw(opts);
}