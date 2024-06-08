// import another js files
import Vertex from "./classes/Vertex.js";
import Graph from "./classes/Graph.js";
import Result from "./classes/Result.js";
import PERSIMPANGAN from "../persimpangan.js";
import RUMAH_SAKIT from "../rumahsakit.js";

const defaultLatLong = [-7.753881231082619, 110.42189287890972];

// declaration of object html ELEMENTS
const controlLatitude = document.getElementById("latitude");
const controlLongitude = document.getElementById("longitude");
const clickSound = document.getElementById("click-sound");
const clickSoundAccident = document.getElementById("click-sound-crash");
const findHosp = document.getElementById("findHospitalButton");
const graphButton = document.getElementById("showGraphButton");
const resetButton = document.getElementById("resetButton");
const copyLatLongButton = document.getElementById("copyLatLongButton");
const startPointInput = document.getElementById("startPoint");
const goalPointInput = document.getElementById("goalPoint");
const fillStartButton = document.getElementById("fillStartButton");
const fillGoalButton = document.getElementById("fillGoalButton");
const selectAlgorithm = document.getElementById("algorithmSelect");
const notification = document.getElementById("notification");
const distanceText = document.getElementById("distance")

// create marker icons
var hospitalIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/6395/6395229.png",
    iconSize: [25, 25],
    iconAnchor: [25, 25],
    popupAnchor: [-12.5, -25],
});
var intersectionIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/1946/1946345.png",
    iconSize: [25, 25],
    iconAnchor: [25, 25],
    popupAnchor: [-7.5, -15],
  });
  
var ambulanceIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/2894/2894975.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});

var goalIcon = L.icon({
    iconUrl: "https://cdn-icons-png.freepik.com/512/304/304465.png",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
});


// INITIALIZE MARKER 

    // ====CREATE HOSPITAL MARKER===

    // take hospital json data
    const hospital_data = RUMAH_SAKIT;

    // create hospital array of of object
    var hospital_markers = [];

    // Initialize the hospital markers
    hospital_data.forEach(function (hospital) {
        const marker = L.marker([hospital.latitude, hospital.longitude], {
            icon: hospitalIcon
        }).bindPopup(hospital.id);

        marker.on("click", function () {
            handleMarkerClick(marker, hospital.id);
        });

        hospital_markers.push(marker);
    });

    //  ===CREATE INTERSECTION MARKER===

    // take intersection json data
    var intersections_data = PERSIMPANGAN;

    let lastClickedMarker = null;
    let lastClickedMarkerId = null;

    // make intersection marker
    var intersection_markers = [];
// Update the click event listener for the intersection markers
// Initialize the intersection markers
    intersections_data.forEach(function (intersection) {
        const marker = L.marker([intersection.latitude, intersection.longitude], {
            icon: intersectionIcon,
            id: intersection.id
        }).bindPopup(intersection.id);

        marker.on("click", function () {
            handleMarkerClick(marker, intersection.id);
        });

        intersection_markers.push(marker);
    });




// INITIALIZE VERTEX CLASS
    // make hospital data to vertex class
    const hospital_vertices = [];
    for (const data of hospital_data) {
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
    for (const data of intersections_data) {
    const vertex = new Vertex(
        false,
        data.latitude,
        data.longitude,
        data.label,
        data.id
    );
    intersection_vertices.push(vertex);
    }





// INITIALIZE THE MAP
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


    
// INITIALIZE FUNCTION

    function setCurrentLocation(lat, lon) {
        controlLatitude.value = lat;
        controlLongitude.value = lon;
    }


    //RESET BUTTON
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
        goalPointInput.value = "";
        fillStartPressed = false;
        fillGoalPressed = false;
        fillStartButton.style.backgroundColor = "#0056b3";
        fillGoalButton.style.backgroundColor = "#0056b3";
        startPointInput.disabled = false;
        goalPointInput.disabled = false;
      
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
          `${controlLatitude.value}, ${controlLongitude.value}`
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
        hospital_data.forEach((hospital) => {
            hospital.neighborIds.forEach((neighborId) => {
            const neighbor = intersections_data.find((i) => i.id === neighborId);
            if (neighbor) {
                const latlngs = [
                [hospital.latitude, hospital.longitude],
                [neighbor.latitude, neighbor.longitude],
                ];
                const line = L.polyline(latlngs, { color: "red", weight: 5, type: "graph" }).addTo(
                map
                );
                drawnLines.push(line);
            }
            });
        });
        intersections_data.forEach((intersection) => {
            intersection.neighborIds.forEach((neighborId) => {
            const neighbor = intersections_data.find((i) => i.id === neighborId);
            if (neighbor) {
                const latlngs = [
                [intersection.latitude, intersection.longitude],
                [neighbor.latitude, neighbor.longitude],
                ];
                const line = L.polyline(latlngs, { color: "blue", weight: 5, type: "graph" }).addTo(
                map
                );
                drawnLines.push(line);
            }
            });
        });
        }
        linesDrawn = !linesDrawn;
    });
    



    let fillStartPressed = false;
    let fillGoalPressed = false;
    
    // Update the click event listener for the Fill Start button
    fillStartButton.addEventListener("click", () => {
        fillStartPressed = true;
        fillGoalPressed = false;
        fillStartButton.style.backgroundColor = "#3a3a3a";
        fillGoalButton.style.backgroundColor = "#0056b3";
        startPointInput.disabled = true;
        goalPointInput.disabled = true;
    });
    
    // Update the click event listener for the Fill Goal button
    fillGoalButton.addEventListener("click", () => {
        fillStartPressed = false;
        fillGoalPressed = true;
        fillGoalButton.style.backgroundColor = "#3a3a3a";
        fillStartButton.style.backgroundColor = "#0056b3";
        startPointInput.disabled = true;
        goalPointInput.disabled = true;
    });
    

 


    // ON MAP CLICK EVENT FUNCTION

    let existingAmbulanceMarker = null;

   
    map.on("click", function (e) {
    // Play click sound
    clickSoundAccident.play();

    // Remove existing marker if present and if it's a Marker instance
    if (existingAmbulanceMarker && existingAmbulanceMarker instanceof L.Marker) {
        map.removeLayer(existingAmbulanceMarker);
    }

    // Set new marker at clicked location
    existingAmbulanceMarker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: ambulanceIcon,
    }).addTo(map);

    // Update control values
    controlLatitude.value = e.latlng.lat;
    controlLongitude.value = e.latlng.lng;
    });

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

    console.log(findNode("itc-15"))

    // Variable to store reference to the current route lines
    let currentRouteLines = [];

    findHosp.addEventListener("click", function () {
        clickSound.play();
        let algorithm = selectAlgorithm.value
        // Remove existing route lines from map
        currentRouteLines.forEach((line) => map.removeLayer(line));
        currentRouteLines = [];

        // Check if a starting point has been selected
        if (goalPointInput.value) {
            var goalPoint = goalPointInput.value
            lastClickedMarkerId = startPointInput.value;
        }else{
            var goalPoint = null
        }
      
        if (lastClickedMarkerId !== null) {
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
            let routePathResult = null ;
            let status = null;
            let distance;
            
            switch (algorithm) {
                case "greedy":
                    result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "greedy")
                    routePathResult = result.getRouteIds()
                    status = result.getStatus();
                    distance = result.getTotalDistance();
                    console.log(distance)
                    makeRouteLine(routePathResult, "green");
                    break;
                case "dijkstra":
                    result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "dijkstra")
                    routePathResult = result.getRouteIds()
                    status = result.getStatus();
                    distance = result.getTotalDistance();
                    makeRouteLine(routePathResult, "red");
                    break;
                case "astar":
                    result = graph.computeShortestRoute(lastClickedMarkerId, goalPoint, "astar")
                    routePathResult = result.getRouteIds()
                    status = result.getStatus();
                    distance = result.getTotalDistance();
                    makeRouteLine(routePathResult, "yellow");
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

            distanceText.textContent = distance
       

            // Show the notification if the path is successfully formed
            if (status) {
                showNotification("Route path successfully founded");
            } else {
                showNotification("Failed to form the route path.");
            }

        } else {
                alert("Pilih titik intersection untuk mencari rute");
        }
    });

     

    //MAKE ROUTE LINE FUNCTION
    function makeRouteLine(result, color) {
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
            const line = L.polyline(latlngs, { color: color, weight: 5 }).addTo(map);
            currentRouteLines.push(line);
          }
        }
      }
    


    // HANDLE MARKER CLICK EVENT

        // Initialize the previous start marker
        let previousStartMarker = null;
        let previousGoalMarker = null;
        function handleMarkerClick(marker, id) {
            if (fillStartPressed) {
                // Set the start point input and update marker icon
                startPointInput.value = id;
                fillStartPressed = false;
                fillStartButton.style.backgroundColor = "#0056b3";
                startPointInput.disabled = false;

                // Change icon of previous start marker back to intersection icon
                if (previousStartMarker) {
                    previousStartMarker.setIcon(intersectionIcon);
                }

                // Set the icon of the current marker to the ambulance icon
                marker.setIcon(ambulanceIcon);
                
                // Update the previous start marker reference
                previousStartMarker = marker;
            } else if (fillGoalPressed) {
                // Set the goal point input and update marker icon to goal icon
                goalPointInput.value = id;
                fillGoalPressed = false;
                fillGoalButton.style.backgroundColor = "#0056b3";
                goalPointInput.disabled = false;

                // Change icon of previous goal marker back to intersection icon
                if (previousGoalMarker) {
                    previousGoalMarker.setIcon(intersectionIcon);
                }

                // Set the icon of the current marker to the goal icon
                marker.setIcon(goalIcon);

                // Update the previous goal marker reference
                previousGoalMarker = marker;
            } else {
                //  reset the icon of the last clicked marker
                if (lastClickedMarker) {
                    lastClickedMarker.setIcon(intersectionIcon);
                }

                // Set the icon of the current marker to the ambulance icon
                marker.setIcon(ambulanceIcon);

                // Update the last clicked marker and ID
                lastClickedMarker = marker;
                lastClickedMarkerId = id;
            }

            // Update control values
            setCurrentLocation(marker.getLatLng().lat, marker.getLatLng().lng);
        }

    // HANDLE SHOW NOTIFICATION
    function showNotification(message) {
            notification.textContent = message;
            notification.classList.remove('hide');
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
                notification.classList.add('hide');
        }, 3000);
    }



















