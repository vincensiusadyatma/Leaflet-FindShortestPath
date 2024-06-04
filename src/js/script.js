import Vertex from './classes/Vertex.js';
import Graph from './classes/Graph.js';
import Result from './classes/Result.js';
import PERSIMPANGAN from '../persimpangan.js';
import RUMAH_SAKIT from '../rumahsakit.js'


const defaultLatLong = [-7.753881231082619, 110.42189287890972];

const controlLatitude = document.getElementById('latitude');
const controlLongitude = document.getElementById('longitude');
const clickSound = document.getElementById('click-sound');
const clickSoundAccident = document.getElementById("click-sound-crash");
const findHosp = document.getElementById("findHospitalButton");
const graphButton = document.getElementById("showGraphButton")

controlLatitude.value = defaultLatLong[0];
controlLongitude.value = defaultLatLong[1];



var hospitalIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/6395/6395229.png', 
    iconSize: [25,25], 
    iconAnchor: [25, 25], 
    popupAnchor: [-12.5, -25] 
  });
  var interceptionIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/1946/1946345.png', 
    iconSize: [15,15], 
    iconAnchor: [15, 15], 
    popupAnchor: [-7.5, -15] 
  });
  
// Create an HOSPITAL MARKER
const hospital_data = RUMAH_SAKIT;

// make hospital marker
var hospital_markers = [];
hospital_data.forEach(function(hospital) {
    const marker = L.marker([hospital.latitude, hospital.longitude], {icon: hospitalIcon }).bindPopup(hospital.id);
    hospital_markers.push(marker);
});
// make hospital data to vertex class
const hospital_vertices = [];
for (const data of hospital_data) {
    const vertex = new Vertex(true,data.latitude, data.longitude, data.label, data.id);
    hospital_vertices.push(vertex);
 
}



// create intersection marker
var intersections_data = PERSIMPANGAN


// make intersection marker
var intersection_markers = [];
intersections_data.forEach(function(intersection) {
    const marker = L.marker([intersection.latitude, intersection.longitude],{icon: interceptionIcon }).bindPopup(intersection.id);
    intersection_markers.push(marker);
});
// make hospital data to intersection class
const intersection_vertices = [];
for (const data of intersections_data) {
    const vertex = new Vertex(false,data.latitude, data.longitude, data.label, data.id);
    intersection_vertices.push(vertex);
}




// The map
var map = L.map('map').setView([defaultLatLong[0], defaultLatLong[1]], 16);


L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);



// Add initial markers to the map
hospital_markers.forEach(function(marker) {
    marker.addTo(map);
});
intersection_markers.forEach(function(marker) {
    marker.addTo(map);
});


// create show graph toggle
let linesDrawn = false;
let drawnLines = [];

graphButton.addEventListener('click', function() {
    if (linesDrawn) {
        // Remove lines from map
        drawnLines.forEach(line => map.removeLayer(line));
        drawnLines = [];
    } else {
        // Draw lines on map
        hospital_data.forEach(hospital => {
            hospital.neighborIds.forEach(neighborId => {
                const neighbor = intersections_data.find(i => i.id === neighborId);
                if (neighbor) {
                    const latlngs = [
                        [hospital.latitude, hospital.longitude],
                        [neighbor.latitude, neighbor.longitude]
                    ];
                    const line = L.polyline(latlngs, { color: 'red', weight: 5 }).addTo(map);
                    drawnLines.push(line);
                }
            });
        });
        intersections_data.forEach(intersection => {
            intersection.neighborIds.forEach(neighborId => {
                const neighbor = intersections_data.find(i => i.id === neighborId);
                if (neighbor) {
                    const latlngs = [
                        [intersection.latitude, intersection.longitude],
                        [neighbor.latitude, neighbor.longitude]
                    ];
                    const line = L.polyline(latlngs, { color: 'blue', weight: 5 }).addTo(map);
                    drawnLines.push(line);
                }
            });
        });
    }
    linesDrawn = !linesDrawn;
});

setDefaultMarker();
// find hospital button function event
findHosp.addEventListener('click', function(){
    clickSound.play();
})

// On map click
map.on('click', function(e) {
    // Play click sound
    clickSoundAccident.play();

    // Set new marker at clicked location
    const newMarker = L.marker([e   .latlng.lat, e.latlng.lng], { icon: L.icon({
        iconUrl: 'https://cdn-icons-png.freepik.com/512/2894/2894975.png', 
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    })}).addTo(map);
    console.log(e.latlng.lat);
    let markers = []
    markers.push(newMarker); 
    controlLatitude.value = e.latlng.lat;
    controlLongitude.value = e.latlng.lng;

    
});

function setDefaultMarker() {
    L.marker([defaultLatLong[0], defaultLatLong[1]], {
        icon: L.icon({
            iconUrl: 'https://www.pinclipart.com/picdir/big/79-798120_push-pin-clipart.png',
            iconSize: [30, 50],
            iconAnchor: [15, 50],
            popupAnchor: [0, -50]
        })
    }).addTo(map);
}


function resetLocation() {
    controlLatitude.value = defaultLatLong[0];
    controlLongitude.value = defaultLatLong[1];
    map.setView([defaultLatLong[0], defaultLatLong[1]], 16);
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && !markers.includes(layer)) {
            map.removeLayer(layer);
        }
    });
    setDefaultMarker();
}

function copyLatLong() {
    navigator.clipboard.writeText(`${controlLatitude.value}, ${controlLongitude.value}`);
}

function findHospital() {
    const startLat = defaultLatLong[0];
    const startLong = defaultLatLong[1];
    const shouldBigHospital = document.getElementById('shouldBigHospital').checked;

    // Clear any existing routes on the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Routing.Control) {
            map.removeControl(layer);
        }
    });

    // Iterate over each marker and find route to the hospital
    markers.forEach(function(marker) {
        const hospitalLat = marker.getLatLng().lat;
        const hospitalLng = marker.getLatLng().lng;

        const start = L.latLng(controlLatitude.value, controlLongitude.value);
        const end = L.latLng(hospitalLat, hospitalLng);

        // Create routing control
        L.Routing.control({
            waypoints: [
                start,
                end
            ],
            routeWhileDragging: false
        }).addTo(map);
    });

    // Asynchronous alert
    setTimeout(() => {
        alert(`Finding nearest ${shouldBigHospital ? 'big hospital' : 'small hospital'} hospital from [${startLat}, ${startLong}]`);
    }, 0);
}



