;const demers = (function() {

  let graph;

  async function buildGraph(fromSource) {
    let graph;
    if (fromSource) {
      graph = await computeDemersGraph();
    } else {
      graph = await getDemersGraph();
    }
    return graph;
  }

  async function redraw(opts) {
    if (!graph) {
      graph = await buildGraph(false); 
    }
  
    const stateColors = d3.scaleQuantize().domain([0, 8]).range(d3.schemeSet1);
    for(let i=0; i<graph.nodes.length; i++) {
      graph.nodes[i]["fill"] = stateColors(graph.nodes[i]["CED_CODE18"][0]);
    }
  
    // prep
    const width = 800, height = 600;
    let maxSize = opts.nodeSize;
  
    const projection = d3.geoEquirectangular()
      .scale(width)
      .translate([width / 2, height / 2]);
  
    const size  = d3.scaleSqrt().range([0, maxSize]);
    
    d3.select("#map")
      .html("");
      
    const svg = d3.select("#map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g");
  
    const linkForce = d3.forceLink()
      .id(function (d) { return d["CED_CODE18"] })
      .distance(function (d) {
        return (size(d.source["CED_POPU17"]) + size(d.target["CED_POPU17"])) / 200;
        // return (size(d.source["AREASQKM18"]) + size(d.target["AREASQKM18"])) / 200
      })
      .strength(0.6);
  
    const collisionForce = rectCollide()
      .size(function (d) {
        var l = size(d["CED_POPU17"])
        return [l, l]
      })
      .iterations(12)
  
    const simulation = d3.forceSimulation()
      .force("center", d3.forceCenter(width / 1.5, (height - maxSize) / 1.8))
      .force("link", linkForce)
      .force("collision", collisionForce)
      .force("x", d3.forceX(function (d) { return d.xi })) //.strength(1.0125))
      .force("y", d3.forceY(function (d) { return d.yi })) //.strength(1.0125))
  
    // use graph
    size.domain([0, d3.max(graph.nodes, d => d["CED_POPU17"])]);
  
    graph.nodes.forEach(function (d) {
      var coords = projection([d.long, d.lat])
      d.x = d.xi = coords[0]
      d.y = d.yi = coords[1]
    });
  
    const divisions = svg.selectAll(".division")
      .data(graph.nodes)
      .enter()
      .append("g")
      .attr("class", "division")
      .style("fill", d => d["fill"]);
  
    divisions.append("rect");
  
    // divisions.append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("dy", ".3em")
    //   .text(function (d) { return d["CED_NAME18"] });
  
    simulation.nodes(graph.nodes);
    simulation.force("link").links(!opts.useLinks ? [] : graph.links);
    simulation.on("tick", ticked);
  
    function ticked() {
      var sizes = d3.local();
  
      divisions
        .property(sizes, function (d) { return size(d["CED_POPU17"]) })
        .attr("transform", function (d) { return "translate(" + d.x + "," + d.y + ")" });
  
      divisions.selectAll("rect")
        .attr("x", function (d) { return sizes.get(this) / -2 })
        .attr("y", function (d) { return sizes.get(this) / -2 })
        .attr("width", function (d) { return sizes.get(this) })
        .attr("height", function (d) { return sizes.get(this) })
    }
  
    function rectCollide() {
      var nodes, sizes, masses
      var size = constant([0, 0])
      var strength = 1
      var iterations = 1
  
      function force() {
        var node, size, mass, xi, yi
        var i = -1
        while (++i < iterations) { iterate() }
  
        function iterate() {
          var j = -1
          var tree = d3.quadtree(nodes, xCenter, yCenter).visitAfter(prepare)
  
          while (++j < nodes.length) {
            node = nodes[j]
            size = sizes[j]
            mass = masses[j]
            xi = xCenter(node)
            yi = yCenter(node)
  
            tree.visit(apply)
          }
        }
  
        function apply(quad, x0, y0, x1, y1) {
          var data = quad.data
          var xSize = (size[0] + quad.size[0]) / 2
          var ySize = (size[1] + quad.size[1]) / 2
          if (data) {
            if (data.index <= node.index) { return }
  
            var x = xi - xCenter(data)
            var y = yi - yCenter(data)
            var xd = Math.abs(x) - xSize
            var yd = Math.abs(y) - ySize
  
            if (xd < 0 && yd < 0) {
              var l = Math.sqrt(x * x + y * y)
              var m = masses[data.index] / (mass + masses[data.index])
  
              if (Math.abs(xd) < Math.abs(yd)) {
                node.vx -= (x *= xd / l * strength) * m
                data.vx += x * (1 - m)
              } else {
                node.vy -= (y *= yd / l * strength) * m
                data.vy += y * (1 - m)
              }
            }
          }
  
          return x0 > xi + xSize || y0 > yi + ySize ||
            x1 < xi - xSize || y1 < yi - ySize
        }
  
        function prepare(quad) {
          if (quad.data) {
            quad.size = sizes[quad.data.index]
          } else {
            quad.size = [0, 0]
            var i = -1
            while (++i < 4) {
              if (quad[i] && quad[i].size) {
                quad.size[0] = Math.max(quad.size[0], quad[i].size[0])
                quad.size[1] = Math.max(quad.size[1], quad[i].size[1])
              }
            }
          }
        }
      }
  
      function xCenter(d) { return d.x + d.vx }
      function yCenter(d) { return d.y + d.vy }
  
      force.initialize = function (_) {
        sizes = (nodes = _).map(size)
        masses = sizes.map(function (d) { return d[0] * d[1] })
      }
  
      force.size = function (_) {
        return (arguments.length
          ? (size = typeof _ === 'function' ? _ : constant(_), force)
          : size)
      }
  
      force.strength = function (_) {
        return (arguments.length ? (strength = +_, force) : strength)
      }
  
      force.iterations = function (_) {
        return (arguments.length ? (iterations = +_, force) : iterations)
      }
  
      return force
    }
  
    function constant(_) {
      return function () { return _ }
    }
  
  }

  async function getDemersGraph() {
    const nodes = await d3.json("./nodes.json");
    const links = await d3.json("./links.json");
    return {
      "nodes": nodes,
      "links": links
    }
  }

  async function computeDemersGraph() {
    // get abs file simplified with mapshaper.org
    const mapKey = "CED_CODE18";
    const mapData = await d3.json("./CED_2018_AUST_1pc.geo.json");

    // use turf.js to remove islands
    const mapDataNoIslands = removeIslands(mapData);

    // get unique list of polygon codes
    const codes = mapDataNoIslands
      .features
      .map(f => f.properties[mapKey])
      .filter((v, i, a) => a.indexOf(v) === i);

    // return object with graph data 
    return {
      "nodes": mapNodes(mapDataNoIslands),
      "links": mapLinks(mapDataNoIslands)
    }

    // function to remove islands
    function removeIslands(mapData) {     
      // new FeatureCollection
      let newMapData = {
        "type": "FeatureCollection",
        "features": []
      }
    
      // iterate features
      for(let i=0; i<mapData.features.length; i++) {
        let f = mapData.features[i];
        // some features have no geometry
        if(f.geometry != null) {
          // want to remove all areas but largest from multi polygons
          if(f.geometry.type == "MultiPolygon") {
            let coordCount = f.geometry.coordinates.length;
            let largestArea = 0;
            let largestCoords;
            // iterate coordinate sets to get largest polygon and keep coords of that polygon
            for(let j=0; j<coordCount; j++) {
              let polygon = turf.polygon(f.geometry.coordinates[j]);
              let area = turf.area(polygon);
              if(area>largestArea) {
                largestArea = area;
                largestCoords = f.geometry.coordinates[j];
              }
            }
            newMapData.features.push({
              "type": "Feature",
              "geometry": {
                "type": "Polygon",
                "coordinates": largestCoords
              },
              "properties": f.properties
            });
          } else {
            // push original feature into new data
            newMapData.features.push({
              "type": "Feature",
              "geometry": f.geometry,
              "properties": f.properties
            });
          }
        }
      }
      return newMapData;
    }

    // return links of map polygons for force directed graph
    function mapLinks(mapData) {

      let polygons = {};
      let links = [];

      // pre compute the polygon for each feature
      for (let i=0; i<codes.length; i++) {
        let feature = mapData.features.find(f => f.properties[mapKey] == codes[i]);
        // skip features with no geometry otherwise get the turf polygon
        if (feature.geometry) {
          polygons[codes[i]] = turf.polygon(feature.geometry.coordinates);
        }
      }

      // iterate all polygons looking for neighbours (turf intersect)
      let polygonCount = Object.keys(polygons).length;
      for (let i=0; i<polygonCount; i++) {
        for (let j=0; j<polygonCount; j++) {
          if (!(i==j)) {
            let key1 = Object.keys(polygons)[i];
            let key2 = Object.keys(polygons)[j];
            let polygon1 = polygons[key1];
            let polygon2 = polygons[key2];
            let test = turf.intersect(polygon1, polygon2);
            if(test) {
              links.push({
                "source": key1,
                "target": key2
              });
            }           
          }
        }
      }
      return links;
    }
 
    // return nodes of per map polygons for force directed graph
    function mapNodes(mapData) {
      let nodes = [];
      for(let i=0; i<mapData.features.length; i++) {
        let f = mapData.features[i];
        let coords = f.geometry.coordinates;
        let polygon = turf.polygon(coords);
        let centre = turf.centerOfMass(polygon);
        nodes.push({
          "CED_CODE18": f.properties["CED_CODE18"],
          "CED_NAME18": f.properties["CED_NAME18"],
          "CED_POPU17": f.properties["CED_POPU17"],
          "AREASQKM18": f.properties["AREASQKM18"],
          "lat": centre.geometry.coordinates[1],
          "long": centre.geometry.coordinates[0]
        });
      }
      return nodes;
    }
  
  }

  return {
    "buildGraph": buildGraph,
    "redraw": redraw
  }

})();
