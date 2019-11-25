window.addEventListener("DOMContentLoaded", initialDraw);
document.getElementById("runButton").addEventListener("click", drawMap);
document.getElementById("resetButton").addEventListener("click", resetParams);

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

function resetParams() {
  document.getElementById("useLinks").checked = true;
  document.getElementById("nodeSize").value = 20;
  document.getElementById("linkForceStrength").value = 0.6;
  document.getElementById("collisionForceFactor").value = 1;
}