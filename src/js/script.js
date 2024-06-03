import Vertex from './classes/Vertex.js';
import Graph from './classes/Graph.js';
import Result from './classes/Result.js';
import persimpangan from '../persimpangan.js';
import RumahSakit from '../Rumah-sakit.js'


const defaultLatLong = [-7.753881231082619, 110.42189287890972];

const controlLatitude = document.getElementById('latitude');
const controlLongitude = document.getElementById('longitude');
const clickSound = document.getElementById('click-sound');
const clickSoundAccident = document.getElementById("click-sound-crash");
const findHosp = document.getElementById("findHospitalButton");

controlLatitude.value = defaultLatLong[0];
controlLongitude.value = defaultLatLong[1];



var hospitalIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/6395/6395229.png', 
    iconSize: [30,30], 
    iconAnchor: [15, 50], 
    popupAnchor: [0, -50] 
  });
  var interceptionIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/1946/1946345.png', 
    iconSize: [30,30], 
    iconAnchor: [15, 50], 
    popupAnchor: [0, -50] 
  });
  
// Create an HOSPITAL MARKER
const hospital_data = RumahSakit;

// make hospital marker
var hospital_markers = [];
hospital_data.forEach(function(hospital) {
    const marker = L.marker([hospital.latitude, hospital.longitude], {icon: hospitalIcon }).bindPopup(hospital.nama);
    hospital_markers.push(marker);
});
// make hospital data to vertex class
const hospital_vertices = [];
for (const data of hospital_data) {
    const vertex = new Vertex(true,data.latitude, data.longitude, data.nama, Vertex.idCounter);
    hospital_vertices.push(vertex);
 
}



// create intersection marker
var intersections_data = persimpangan


// make intersection marker
var intersection_markers = [];
intersections_data.forEach(function(intersection) {
    const marker = L.marker([intersection.latitude, intersection.longitude],{icon: interceptionIcon }).bindPopup(intersection.persimpangan);
    intersection_markers.push(marker);
});
// make hospital data to intersection class
const intersection_vertices = [];
for (const data of intersections_data) {
    const vertex = new Vertex(false,data.latitude, data.longitude, data.persimpangan, Vertex.idCounter);
    intersection_vertices.push(vertex);
}


hospital_vertices[0].addNeighbor(intersection_vertices[19].getId)

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
    const newMarker = L.marker([e.latlng.lat, e.latlng.lng], { icon: L.icon({
        iconUrl: 'https://cdn-icons-png.freepik.com/512/2894/2894975.png', 
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    })}).addTo(map);
    
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



