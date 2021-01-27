// URL for GeoJSON

var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson";



// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  createMap(data.features);
});


// Create function to assign color based on Depth of earthquake

function depthColor(depth) {
    var color = "";
    if (depth <= 50) { color = "#ffebec"; }
    else if (depth <= 100) {color = "#f7abaf"; }
    else if (depth <= 150) { color = "#ff6b73"; }
    else if (depth <= 200) {color = "#f71925"; }
    else { color = "#990008"; }

return color;

};


// Create function to assign radius based on magnitude of earthquake

function magCheck(mag){
    return mag * 4;
};

function createMap(earthquakeData) {


      EarthquakeMarkers = earthquakeData.map((feature) =>

        L.circleMarker([feature.geometry.coordinates[1],feature.geometry.coordinates[0]],{
            radius: magCheck(feature.properties.mag),
            stroke: true,
            color: 'black',
            opacity: 1,
            weight: 0.5,
            fill: true,
            fillColor: depthColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.9   
        })
        .bindPopup("<h1> Magnitude : " + feature.properties.mag +
        "</h1><h1> Depth: " + feature.geometry.coordinates[2] +
        "</h1><hr><h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>")
      )

  
      var earthquakes=L.layerGroup(EarthquakeMarkers)
  
       var mags = earthquakeData.map((d) => magCheck(+d.properties.mag));
       console.log(d3.extent(mags));
       console.log(mags);
  



  // Define streetmap and darkmap layers
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });


  // Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      27, -20
    ],
    zoom: 3,
    layers: [streetmap, earthquakes]
  });

// Create a legend to display information about our map
var info = L.control({
    position: "bottomright"
  });
  
  info.onAdd = function(myMap){
    var div = L.DomUtil.create("div","legend");
    div.innerHTML = [
        "<p>Depth</p>",
        "<k class='depth2'></k><span><50</span><br>",
        "<k class='depth3'></k><span>50-100</span><br>",
        "<k class='depth4'></k><span>100-150</span><br>",
        "<k class='depth5'></k><span>150-200</span><br>",
        "<k class='depth6'></k><span>>200</span><br>"
      ].join("");
    return div;
}
// Add the info legend to the map
info.addTo(myMap);

}
