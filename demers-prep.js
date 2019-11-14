const data1 = getGeoJson();
const data2 = removeIslands(data1);
const mapKey = "CED_CODE18";

// https://stackoverflow.com/questions/1960473/get-all-unique-values-in-a-javascript-array-remove-duplicates
var codes = data2.features.map(f => f.properties[mapKey])
  .filter((v, i, a) => a.indexOf(v) === i);

function mapLinks(input) {
  var links = [];
  for(let i=0; i<codes.length; i++) {
    for(let j=0; j<codes.length; j++) {
      if(i!=j) {
        // console.log(`Testing codes ${codes[i]} and ${codes[j]}`);
        let feature1 = data.features.find(f => f.properties[mapKey] == codes[i]);
        let feature2 = data.features.find(f => f.properties[mapKey] == codes[j]);
        if(feature1.geometry && feature2.geometry) {
          // console.log("Obtained two features");
          let polygon1 = turf.polygon(feature1.geometry.coordinates);
          let polygon2 = turf.polygon(feature2.geometry.coordinates);
          // console.log(polygon1);
          // console.log(polygon2);
          let test = turf.intersect(polygon1, polygon2);
          if(test) {
            // console.log(`test has result for ${codes[i]} and ${codes[j]}`);
            links.push({
              "source": feature1.properties[mapKey],
              "target": feature2.properties[mapKey]
            });
          } else {
            // console.log("test is null");
          }
        }
      }
    }
    console.log(i);
  }
  return links;
}

function centres(inputData) {
  let nodes = [];
  for(let i=0; i<inputData.features.length; i++) {
    let f = inputData.features[i];
    let coords = f.geometry.coordinates;
    let polygon = turf.polygon(coords);
    let centre = turf.centerOfMass(polygon);
    nodes.push({
      "CED_CODE18": f.properties["CED_CODE18"],
      "CED_NAME18": f.properties["CED_NAME18"],
      "CED_POPU17": f.properties["CED_POPU17"],
      "lat": centre.geometry.coordinates[1],
      "long": centre.geometry.coordinates[0]
    });
  }
  return nodes;
}

function removeIslands(inputData) {
  // remove islands
  let newData = {
    "type": "FeatureCollection",
    "features": []
  }

  // iterate features
  for(let i=0; i<inputData.features.length; i++) {
    let f = inputData.features[i];
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
        newData.features.push({
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": largestCoords
          },
          "properties": f.properties
        });
      } else {
        // push original feature into new data
        newData.features.push({
          "type": "Feature",
          "geometry": f.geometry,
          "properties": f.properties
        });
      }
    }
  }
  return newData;
}


