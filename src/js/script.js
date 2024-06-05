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
const resetButton = document.getElementById("resetButton");
const copyLatLongButton = document.getElementById("copyLatLongButton");
const startPointButton = document.getElementById('startPoint');
const goalPointButton = document.getElementById('goalPoint');
const fillStartButton = document.getElementById("fillStartButton");
const fillGoalButton = document.getElementById("fillGoalButton");

// create toggle fill start and fill goal poin
fillStartButton.addEventListener('click', function() {
    console.log('click');
    startPointButton.disabled = false;
    goalPointButton.disabled = true;
    fillStartButton.disabled = true;
    fillGoalButton.disabled = false;
    fillStartButton.style.backgroundColor = '#3a3a3a';
    fillGoalButton.style.backgroundColor = '#0056b3';
});

fillGoalButton.addEventListener('click', function() {
    console.log('click');
    goalPointButton.disabled = false;
    startPointButton.disabled = true;
    fillGoalButton.disabled = true;
    fillStartButton.disabled = false;
    fillGoalButton.style.backgroundColor = '#3a3a3a';
    fillStartButton.style.backgroundColor = '#0056b3';
});


// create marker icons
var hospitalIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/6395/6395229.png', 
    iconSize: [25,25], 
    iconAnchor: [25, 25], 
    popupAnchor: [-12.5, -25] 
  });
  var intersectionIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/1946/1946345.png', 
    iconSize: [15,15], 
    iconAnchor: [15, 15], 
    popupAnchor: [-7.5, -15] 
  });

  var ambulanceIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/2894/2894975.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]})
  

    
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

let lastClickedMarker = null;  
// make intersection marker
var intersection_markers = [];
intersections_data.forEach(function(intersection) {
    const marker = L.marker([intersection.latitude, intersection.longitude], {icon: intersectionIcon }).bindPopup(intersection.id);
    marker.addEventListener('click', function() {
        if (lastClickedMarker) {
            lastClickedMarker.setIcon(intersectionIcon);  
        }
        marker.setIcon(ambulanceIcon); 
        lastClickedMarker = marker;  
    });
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

// setDefaultMarker();
// find hospital button function event
findHosp.addEventListener('click', function(){
    clickSound.play();
})



// Initialize variable to store the marker
let existingAmbulanceMarker = null;

// On map click
map.on('click', function (e) {
    // Play click sound
    clickSoundAccident.play();

    // Remove existing marker if present
    if (existingAmbulanceMarker) {
        map.removeLayer(existingAmbulanceMarker);
    }

    // Set new marker at clicked location
    existingAmbulanceMarker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: ambulanceIcon
    }).addTo(map);

    // Update control values
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

resetButton.addEventListener('click', function() {
    console.log('click');
    linesDrawn = false;
    controlLatitude.value = defaultLatLong[0];
    controlLongitude.value = defaultLatLong[1];
    map.setView([defaultLatLong[0], defaultLatLong[1]], 16);

    // Remove all markers except hospital and intersection markers akwoekawoekawokawoek
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker && !hospital_markers.includes(layer) && !intersection_markers.includes(layer)) {
            map.removeLayer(layer);
        }
    });

    // Remove all drawn lines from map hehehehehe 
    drawnLines.forEach(line => map.removeLayer(line));
    drawnLines = [];

    // Remove the existing ambulance marker :v
    if (existingAmbulanceMarker) {
        map.removeLayer(existingAmbulanceMarker);
        existingAmbulanceMarker = null;
    }
});


copyLatLongButton.addEventListener('click',function(){
    navigator.clipboard.writeText(`${controlLatitude.value}, ${controlLongitude.value}`);
})


const result = ['itc-37', 'itc-57', 'itc-20', 'rs-jih'];

/*'itc-1',  'itc-2',
  'itc-3',  'itc-26',
  'itc-27', 'itc-29',
  'itc-28', 'itc-50',
  'itc-59', 'rs-siloam-yogyakarta',
  'itc-32', 'itc-42',
  'itc-37', 'itc-57',
  'itc-20', 'rs-jih' */

const full_vertex = PERSIMPANGAN.concat(RUMAH_SAKIT)
const findNode = (id) => {
    return full_vertex.find(intersection => intersection.id === id);
};
findHosp.addEventListener('click', function() {
    const lat = controlLatitude.value;
    const lon = controlLongitude.value;

    const routePath = [];
    // routePath.push({
    //     id: "ambulance-1",
    //     vertexType: "ambulance",
    //     latitude: lat,
    //     longitude: lon,
    //     neighbors: [result[0]]
    // });

    // make array  to object
    for (let i = 0; i < result.length - 1; i++) {
        const currentNode = findNode(result[i]);
        const nextNode = findNode(result[i + 1]);

        // check curent node and next node not null
        if (currentNode && nextNode) {
            if (!currentNode.neighbors) {
                currentNode.neighbors = [];
            }
            currentNode.neighbors.push(nextNode.id);

            if (!nextNode.neighbors) {
                nextNode.neighbors = [];
            }
            nextNode.neighbors.push(currentNode.id);

            routePath.push(currentNode);
        }
    }

    // Log route object
    console.log(routePath);

    // make roue line
    routePath.forEach(node => {
        node.neighbors.forEach(neighborId => {
            const neighbor = intersections_data.find(i => i.id === neighborId);
            if (neighbor) {
                const latlngs = [
                    [node.latitude, node.longitude],
                    [neighbor.latitude, neighbor.longitude]
                ];
                const line = L.polyline(latlngs, { color: 'green', weight: 5 }).addTo(map);
                drawnLines.push(line);
            }
        });
    });
});




