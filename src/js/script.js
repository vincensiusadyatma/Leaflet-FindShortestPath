// import other modules
import Vertex from "./classes/Vertex.js";
import Graph from "./classes/Graph.js";
import Result from "./classes/Result.js";
import PERSIMPANGAN from "../simpang.js";
import RUMAH_SAKIT from "../rumahsakit.js";

const defaultLatLong = [-7.753881231082619, 110.42189287890972];

// declaration of object html ELEMENTS
const controlLatitude = document.getElementById("latitude");
const controlLongitude = document.getElementById("longitude");
const crashAudio = document.getElementById('crashAudio');
const clickSound = document.getElementById("click-sound");
const clickSoundAccident = document.getElementById("click-sound-crash");
const clickAmbulanceSound = document.getElementById('ambulanceAudio');
const animatePathCheckbox = document.getElementById("animatePath");
const findHospitalButton = document.getElementById("findHospitalButton");
const graphButton = document.getElementById("showGraphButton");
const symbolsButton = document.getElementById("showSymbolsButton");
const resetButton = document.getElementById("resetButton");
const copyLatLongButton = document.getElementById("copyLatLongButton");
const startPointInput = document.getElementById("startPoint");
const goalPointInput = document.getElementById("goalPoint");
const fillStartButton = document.getElementById("fillStartButton");
const fillGoalButton = document.getElementById("fillGoalButton");
const selectAlgorithm = document.getElementById("algorithmSelect");
const notification = document.getElementById("notification");
const distanceText = document.getElementById("distance")
const useAllAlgorithmButton = document.getElementById("useAllAlgorithm");

// create marker icons
var hospitalIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/6395/6395229.png",
    iconSize: [25, 25],
    iconAnchor: [12.5, 25],
    popupAnchor: [-12.5, -25],
});
var intersectionIcon = L.icon({
    iconUrl: "src/public/intersection.png",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
});

var ambulanceIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/2894/2894975.png",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -30],
});

var goalIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/304/304465.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

var defaultIcon = L.icon({
    iconUrl: "https://www.pinclipart.com/picdir/big/79-798120_push-pin-clipart.png",
    iconSize: [15, 25],
    iconAnchor: [7.5, 25],
    popupAnchor: [0, -25],
});


// INITIALIZE MARKER 

// ====CREATE HOSPITAL MARKER===

const HOSPITALS = RUMAH_SAKIT;
const INTERSECTIONS = PERSIMPANGAN;
var hospital_markers = [];
var intersection_markers = [];
var allMarkers = [];

function initializeMarkers() {
    // Initialize the hospital markers
    HOSPITALS.forEach(function (hospital) {
        const marker = L.marker([hospital.latitude, hospital.longitude], {
            type: "hospital",
            icon: hospitalIcon
        }).bindPopup(hospital.id);

        marker.on("click", function () {
            handleMarkerClick(marker, hospital.id);
        });

        hospital_markers.push(marker);
    });

    // Initialize the intersection markers
    INTERSECTIONS.forEach(function (intersection) {
        const marker = L.marker([intersection.latitude, intersection.longitude], {
            type: "intersection",
            icon: intersectionIcon,
            id: intersection.id
        }).bindPopup(intersection.id);

        marker.on("click", function () {
            handleMarkerClick(marker, intersection.id);
        });

        intersection_markers.push(marker);
    });

    allMarkers = hospital_markers.concat(intersection_markers);
}
initializeMarkers();

// Initialize the last clicked marker and ID
let lastClickedMarker = null;
let lastClickedMarkerId = null;

// INITIALIZE VERTEX CLASS
// make hospital data to vertex class
const hospital_vertices = [];
for (const data of HOSPITALS) {
    const vertex = new Vertex(
        true,
        data.latitude,
        data.longitude,
        data.label,
        data.id
    );
    hospital_vertices.push(vertex);
}

// make hospital data to intersection class
const intersection_vertices = [];
for (const data of INTERSECTIONS) {
    const vertex = new Vertex(
        false,
        data.latitude,
        data.longitude,
        data.label,
        data.id
    );
    intersection_vertices.push(vertex);
}

// Initialize map object
var map = L.map("map").setView([defaultLatLong[0], defaultLatLong[1]], 16);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

// Add initial markers to the map
hospital_markers.forEach(function (marker) {
    marker.on("click", function (e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        setCurrentLocation(lat, lon);
    });
    marker.addTo(map);
});
intersection_markers.forEach(function (marker) {
    marker.on("click", function (e) {
        const lat = e.latlng.lat;
        const lon = e.latlng.lng;
        setCurrentLocation(lat, lon);
    });
    marker.addTo(map);
});

///////////////////////////////////// FUNCTIONS /////////////////////////////////////

function setCurrentLocation(lat, lon) {
    controlLatitude.value = lat;
    controlLongitude.value = lon;
}

// Reset Button
resetButton.addEventListener("click", function () {
    console.log("click");

    // Reset lines and markers related to routing and searching
    linesDrawn = false;
    drawnLines.forEach((line) => map.removeLayer(line));
    drawnLines = [];

    // Remove existing ambulance marker
    if (existingAmbulanceMarker) {
        map.removeLayer(existingAmbulanceMarker);
        existingAmbulanceMarker = null;
    }

    // Clear route-related input fields and buttons
    controlLatitude.value = "";
    controlLongitude.value = "";
    startPointInput.value = "";
    goalPointInput.value = "Nearest Hospital";
    distanceText.textContent = "0 KM";
    fillStartPressed = false;
    fillGoalPressed = false;
    fillStartButton.style.backgroundColor = "#007bff";
    fillGoalButton.style.backgroundColor = "#007bff";
    startPointInput.disabled = true;
    goalPointInput.disabled = true;

    hospital_markers.forEach((marker) => {
        marker.setIcon(hospitalIcon);
    });
    intersection_markers.forEach((marker) => {
        marker.setIcon(intersectionIcon);
    });

    // Reset variabel marker terakhir
    lastClickedMarker = null;
    lastClickedMarkerId = null;
    // Reset algorithm selection
    selectAlgorithm.selectedIndex = 0;

    // Hapus jalur rute
    currentRouteLines.forEach((line) => map.removeLayer(line));
    currentRouteLines = [];

});

//COPY LATLONG BUTTON
copyLatLongButton.addEventListener("click", function () {
    navigator.clipboard.writeText(
        `${'latitude: ' + controlLatitude.value}, ${'longitude: ' + controlLongitude.value}`
    );
});

// CREATE SHOW GRAPH BUTTON
let linesDrawn = false;
let drawnLines = [];

graphButton.addEventListener("click", function () {
    if (linesDrawn) {
        // Remove only graph lines from map
        drawnLines.forEach((line) => {
            if (line.options.type === "graph") {
                map.removeLayer(line);
            }
        });
    } else {
        // Draw graph lines on map
        HOSPITALS.forEach((hospital) => {
            hospital.neighborIds.forEach((neighborId) => {
                const neighbor = INTERSECTIONS.find((i) => i.id === neighborId);
                if (neighbor) {
                    const latlngs = [
                        [hospital.latitude, hospital.longitude],
                        [neighbor.latitude, neighbor.longitude],
                    ];
                    const line = L.polyline(latlngs, { color: "purple", weight: 2, opacity: 0.75, type: "graph" }).addTo(
                        map
                    );
                    drawnLines.push(line);
                }
            });
        });
        INTERSECTIONS.forEach((intersection) => {
            intersection.neighborIds.forEach((neighborId) => {
                const neighbor = INTERSECTIONS.find((i) => i.id === neighborId);
                if (neighbor) {
                    const latlngs = [
                        [intersection.latitude, intersection.longitude],
                        [neighbor.latitude, neighbor.longitude],
                    ];
                    const line = L.polyline(latlngs, { color: "black", weight: 4, opacity: 0.75, type: "graph" }).addTo(
                        map
                    );
                    drawnLines.push(line);
                }
            });
        });
    }
    linesDrawn = !linesDrawn;
});

let symbolsDrawn = true;

symbolsButton.addEventListener("click", function () {
    if (symbolsDrawn) {
        console.log("Removing markers");
        allMarkers.forEach((marker) => map.removeLayer(marker));
    } else {
        console.log("Adding markers");
        allMarkers.forEach((marker) => map.addLayer(marker));
    }
    symbolsDrawn = !symbolsDrawn;
});

// Default is on since the start point is the first to be filled
let fillStartPressed = true;
let fillGoalPressed = false;

// Update the click event listener for the Fill Start button
fillStartButton.addEventListener("click", () => {
    fillStartPressed = true;
    fillGoalPressed = false;
    fillStartButton.style.backgroundColor = "#3a3a3a";
    fillGoalButton.style.backgroundColor = "#007bff";
    startPointInput.disabled = true;
    goalPointInput.disabled = true;
});

// Update the click event listener for the Fill Goal button
fillGoalButton.addEventListener("click", () => {
    fillStartPressed = false;
    fillGoalPressed = true;
    fillGoalButton.style.backgroundColor = "#3a3a3a";
    fillStartButton.style.backgroundColor = "#007bff";
    startPointInput.disabled = true;
    goalPointInput.disabled = true;
});

// ON MAP CLICK EVENT FUNCTION

let existingAmbulanceMarker = null;

// SET DEFAULT MARKER FUNCTION
function setDefaultMarker() {
    L.marker([defaultLatLong[0], defaultLatLong[1]], {
        icon: L.icon({
            iconUrl:
                "https://www.pinclipart.com/picdir/big/79-798120_push-pin-clipart.png",
            iconSize: [30, 50],
            iconAnchor: [15, 50],
            popupAnchor: [0, -50],
        }),
    }).addTo(map);
}

// FIND HOSPUITAL FUNCTION AND PROCDURE ALGORITHM
const graph = new Graph();
const full_vertex = PERSIMPANGAN.concat(RUMAH_SAKIT);

const findNode = (id) => {
    return full_vertex.find((intersection) => intersection.id === id);
};

// Variable to store reference to the current route lines
let currentRouteLines = [];

findHospitalButton.addEventListener("click", function () {

    if (clickAmbulanceSound.checked) {
        clickSound.play();
    }

    let algorithm = selectAlgorithm.value
    let goalPoint;
    // Remove existing route lines from map
    currentRouteLines.forEach((line) => map.removeLayer(line));
    currentRouteLines = [];

    // Check if a starting point has been selected
    if (goalPointInput.value !== "Nearest Hospital") {
        goalPoint = goalPointInput.value
        lastClickedMarkerId = startPointInput.value;
    } else {
        goalPoint = null
        lastClickedMarkerId = startPointInput.value;
    }

    if (lastClickedMarkerId !== "" || startPointInput.value !== "") {
        const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);
        fullVertices.forEach((vertexData) => {
            graph.createVertex(
                vertexData.id,
                vertexData.vertexType,
                vertexData.latitude,
                vertexData.longitude,
                vertexData.label,
                vertexData.neighborIds,
                true
            );
        });


        let result = null;
        let routePathResult = null;
        let status = null;
        let distance;

        switch (algorithm) {
            case "greedy":
                result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "greedy")
                routePathResult = result.getRouteIds()
                status = result.getStatus();
                distance = result.getTotalDistance();
                makeRouteLine(routePathResult, "blue");
                break;
            case "dijkstra":
                result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "dijkstra")
                routePathResult = result.getRouteIds()
                status = result.getStatus();
                distance = result.getTotalDistance();
                makeRouteLine(routePathResult, "green");
                break;
            case "astar":
                result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "astar")
                routePathResult = result.getRouteIds()
                status = result.getStatus();
                distance = result.getTotalDistance();
                makeRouteLine(routePathResult, "red");
                break;
            case "bfs":
                result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "bfs")
                routePathResult = result.getRouteIds()
                status = result.getStatus();
                distance = result.getTotalDistance();
                makeRouteLine(routePathResult, "orange");
                break;
            default:
                console.error("Invalid algorithm selected");
                return;
        }

        distanceText.textContent = distance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + " KM"


        // Show the notification if the path is successfully formed
        if (status.startsWith("success")) {
            showNotification("Successfully formed the route path.", status.split(":")[0]);
        } else {
            showNotification("Failed to form the route path.", status.split(":")[0]);
        }

    } else {
        alert("Pilih titik awal untuk mencari rute");
    }
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// USE ALL ALGORITHM BUTTON
useAllAlgorithmButton.addEventListener("click", async function () {
    if (clickAmbulanceSound.checked) {
        clickSound.play();
    }

    let goalPoint;
    // Remove existing route lines from map
    currentRouteLines.forEach((line) => map.removeLayer(line));
    currentRouteLines = [];

    // Check if a starting point has been selected
    if (goalPointInput.value !== "Nearest Hospital") {
        goalPoint = goalPointInput.value
        lastClickedMarkerId = startPointInput.value;
    } else {
        goalPoint = null
        lastClickedMarkerId = startPointInput.value;
    }

    if (lastClickedMarkerId !== "" || startPointInput.value !== "") {
        const fullVertices = PERSIMPANGAN.concat(RUMAH_SAKIT);
        fullVertices.forEach((vertexData) => {
            graph.createVertex(
                vertexData.id,
                vertexData.vertexType,
                vertexData.latitude,
                vertexData.longitude,
                vertexData.label,
                vertexData.neighborIds,
                true
            );
        });

        let result = null;
        let routePathResult = null;
        let status = null;
        let distance;

        result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "greedy")
        routePathResult = result.getRouteIds()
        status = result.getStatus();
        distance = result.getTotalDistance();
        makeRouteLine(routePathResult, "blue", 8, 1);

        await delay(1000);

        result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "bfs")
        routePathResult = result.getRouteIds()
        status = result.getStatus();
        distance = result.getTotalDistance();
        makeRouteLine(routePathResult, "orange", 10, 1, "10, 20");

        await delay(1000);

        result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "dijkstra")
        routePathResult = result.getRouteIds()
        status = result.getStatus();
        distance = result.getTotalDistance();
        makeRouteLine(routePathResult, "green", 4, 1);

        await delay(1000);

        result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "astar")
        routePathResult = result.getRouteIds()
        status = result.getStatus();
        distance = result.getTotalDistance();
        makeRouteLine(routePathResult, "red", 6, 1, "10, 20", "-20");

        distanceText.textContent = distance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 3 }) + " KM"

        // Show the notification if the path is successfully formed
        if (status.startsWith("success")) {
            showNotification("Successfully formed the route path.", status.split(":")[0]);
        }
    } else {
        alert("Pilih titik awal untuk mencari rute");
    }
});

//MAKE ROUTE LINE FUNCTION
async function makeRouteLine(result, color, weight = 8, opacity = 1, dashArray = "0", dashOffset = "0") {
    let routePath = [];

    // Create an object array for the route path
    for (let i = 0; i < result.length; i++) {
        const node = findNode(result[i]);
        if (node) {
            routePath.push(node);
        }
    }

    // Create route line between nodes
    for (let i = 0; i < routePath.length - 1; i++) {
        const currentNode = routePath[i];
        const nextNode = routePath[i + 1];

        // Check if both current and next nodes are valid
        if (currentNode && nextNode) {
            const latlngs = [
                [currentNode.latitude, currentNode.longitude],
                [nextNode.latitude, nextNode.longitude],
            ];

            if (animatePathCheckbox.checked) {
                await delay(200);
            }

            const line = L.polyline(latlngs, {
                color: color,
                weight: weight,
                opacity: opacity,
                dashArray: dashArray,
                dashOffset: dashOffset
            }).addTo(map);
            currentRouteLines.push(line);
        }
    }
}

// HANDLE MARKER CLICK EVENT

// Initialize the previous start marker
let previousStartMarker = null;
let previousGoalMarker = null;

// Define variables to track the previous markers
let previousMarker = null;
let previousMarkerIcon = null;

// ON MAP CLICK EVENT FUNCTION
map.on("click", function (e) {
    // Play click sound
    if (crashAudio.checked) {
        console.log(crashAudio.checked);
        clickSoundAccident.play();
    }

    // Reset the icon of the previous marker if it exists
    if (previousMarker) {
        previousMarker.setIcon(previousMarkerIcon);
        previousMarker = null;
        previousMarkerIcon = null;
    }

    // Remove existing ambulance marker if present
    if (existingAmbulanceMarker) {
        map.removeLayer(existingAmbulanceMarker);
    }

    // Set new marker at clicked location
    existingAmbulanceMarker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: defaultIcon,
    }).addTo(map);

    // Update control values
    controlLatitude.value = e.latlng.lat;
    controlLongitude.value = e.latlng.lng;
});

// HANDLE MARKER CLICK EVENT FUNCTION
function handleMarkerClick(marker, id) {
    if (fillStartPressed) {
        // Set the start point input and update marker icon
        if (id !== null) {
            startPointInput.value = id;
        }
        fillStartPressed = false;
        fillStartButton.style.backgroundColor = "#007bff";

        // Reset the icon of the previous start marker if it exists
        if (previousStartMarker) {
            previousStartMarker.setIcon(intersectionIcon);
        }

        // Set the icon of the current marker to the ambulance icon
        marker.setIcon(ambulanceIcon);

        // Update the previous start marker reference
        previousStartMarker = marker;
    } else if (fillGoalPressed) {
        // Set the goal point input and update marker icon
        goalPointInput.value = id;
        fillGoalPressed = false;
        fillGoalButton.style.backgroundColor = "#007bff";

        // Reset the icon of the previous goal marker if it exists
        if (previousGoalMarker) {
            previousGoalMarker.setIcon(intersectionIcon);
        }

        // Set the icon of the current marker to the goal icon
        marker.setIcon(goalIcon);

        // Update the previous goal marker reference
        previousGoalMarker = marker;
    } else {
        // Reset the icon of the last clicked marker if it exists
        if (lastClickedMarker) {
            if (lastClickedMarker.options.type == "hospital") {
                lastClickedMarker.setIcon(hospitalIcon);
            } else if (lastClickedMarker.options.type == "intersection") {
                lastClickedMarker.setIcon(intersectionIcon);
            }
        }

        // Set the icon of the current marker to the ambulance icon
        marker.setIcon(ambulanceIcon);

        // Update the last clicked marker and ID
        lastClickedMarker = marker;
        lastClickedMarkerId = id;
    }

    // Track the clicked marker and its original icon to reset later
    previousMarker = marker;
    previousMarkerIcon = (marker.options.type == "hospital") ? hospitalIcon : intersectionIcon;

    // Update control values
    setCurrentLocation(marker.getLatLng().lat, marker.getLatLng().lng);
}

// HANDLE SHOW NOTIFICATION
function showNotification(message, status) {
    notification.textContent = message;
    notification.classList.remove('hide');
    notification.classList.add('show');
    if (status === "success") {
        notification.style.backgroundColor = "#00c200";
    } else {
        notification.style.backgroundColor = "#f00000";
    }
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
    }, 10000);
}