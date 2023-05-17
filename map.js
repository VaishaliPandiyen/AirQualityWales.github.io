let map = L.map("map", {
  center: [52.35600282867075, -3.832320954338758],
  minZoom: 8, // to not zoom out too much
  zoom: 8,
});
document.getElementById("reset_zoom").addEventListener("click", function () {
  map.setView([52.35600282867075, -3.832320954338758], 8);
});

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

let data = "wales_aqm.csv";

let pm25_icon = L.icon({
  iconUrl: "Images/location_pin_6.png",
  iconSize: [38, 55],
});
let others_icon = L.icon({
  iconUrl: "Images/location_pin_3.png",
  iconSize: [38, 55],
});

const pm25Checkbox = document.getElementById("PM 2.5");
const otherPollutantsCheckbox = document.getElementById("Other Pollutants");
const pm25Markers = [];
const otherPollutantsMarkers = [];
let pm25_layer;
// let others_layer;

Papa.parse(data, {
  download: true,
  header: true,
  complete: function (results) {
    results.data.pop();
    
    let mapMarkers = () => {
      if (pm25Checkbox.checked) {
        console.log("Showing PM 2.5 monitors");
        for (let c of results.data) {
          if (c["PM 2.5"] == "Yes") {
            const marker = L.marker([c["Latitude"], c["Longitude"]], {
              icon: pm25_icon,
            }).bindTooltip(
              `${c["Place"]} <br> Monitored by: ${c["Monitoring Authority"]}`
            );
            pm25Markers.push(marker);
          }
        }
        pm25_layer = L.layerGroup(pm25Markers);
        pm25_layer.addTo(map);
      } else {
        console.log("Hiding PM 2.5 monitors");
        pm25_layer.removeFrom(map);
        pm25Markers.length = 0;
      }
    };
    pm25Checkbox.addEventListener("change", mapMarkers);
    mapMarkers();
    otherPollutantsCheckbox.addEventListener("change", () => {
      if (otherPollutantsCheckbox.checked) {
        for (let c of results.data) {
          if (c["PM 2.5"] !== "Yes") {
            const marker = L.marker([c["Latitude"], c["Longitude"]], {
              icon: others_icon,
            }).bindTooltip(`${c["Place"]}`);

            otherPollutantsMarkers.push(marker);
          }
        }
        others_layer = L.layerGroup(otherPollutantsMarkers);
        others_layer.addTo(map);
      } else {
        others_layer.removeFrom(map);
        otherPollutantsMarkers.length = 0;
      }
    });
  },
});
