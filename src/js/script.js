
const defaultLatLong = [-7.753881231082619, 110.42189287890972];

const controlLatitude = document.getElementById('latitude');
const controlLongitude = document.getElementById('longitude');
const clickSound = document.getElementById('click-sound');
const clickSoundAccident = document.getElementById("click-sound-crash");
const findHosp = document.getElementById("findHospitalButton");

controlLatitude.value = defaultLatLong[0];
controlLongitude.value = defaultLatLong[1];

// =============================================== VERTEX CLASS =============================================
class Vertex {
    #id;                        // Vertex id    
    #vertexType;                // Vertex type (intersection or hospital)
    #lat;                       // Latitude
    #lon;                       // Longitude
    #label;                     // Label
    #neighborIds = new Set();   // Set of neighbor ids

    static #idCounter = 1;      // Counter to generate unique ids

    // Single constructor
    constructor(ishospital, lat, lon = null, label = null) {
        if (ishospital == true && typeof lat === 'number' && (lon === null || typeof lon === 'number')) {
            this.#id = 'rs-'+Vertex.#idCounter++;
            this.#vertexType = 'HOSPITAL';
            this.#lat = lat;
            this.#lon = lon;
            this.#label = label;
        } else if (ishospital === false && typeof lat === 'number') {
            this.#id = 'itc-'+Vertex.#idCounter++;
            this.#vertexType = 'INTERSECTION';
            this.#lat = lat;
            this.#lon = lon;
            this.#label = label;
        } else {
            throw new Error('Invalid constructor arguments');
        }
    }
    
    
    
    getId() {
        return this.#id;
    }

    getVertexType() {
        return this.#vertexType;
    }

    getLat() {
        return this.#lat;
    }

    getLon() {
        return this.#lon;
    }

    getLabel() {
        return this.#label;
    }

    getNeighbors() {
        return this.#neighborIds;
    }

    set({id, lat, lon, label}) {
        this.#id = id;
        this.#lat = lat;
        this.#lon = lon;
        this.#label = label;
    }

    addNeighbor(neighborId) {
        return this.#neighborIds.add(neighborId);
    }

    removeNeighbor(neighborId) {
        return this.#neighborIds.delete(neighborId);
    }

    hasNeighbor(neighborId) {
        return this.#neighborIds.has(neighborId);
    }

    /**
     * Method to return the distance to another vertex using euclidean distance formula.
     * @param vertex Vertex to compare
     * @returns float Distance to the vertex
     */
    distanceFrom(vertex) {
        if (!(vertex instanceof Vertex)) {
            throw new TypeError("The vertex must be an instance of Vertex class.");
        }
        return Math.sqrt(Math.pow(this.#lat - vertex.getLat(), 2) + Math.pow(this.#lon - vertex.getLon(), 2));
    }
}
// =============================================== AKHIR VERTEX CLASS =============================================

// =============================================== RESULT CLASS =============================================
class Result {
    #pathRoutes = Array();

    constructor(pathRoutes) {
        if (!(pathRoutes instanceof Array)) {
            throw new Error('Path routes must be an array');
        }
        this.#pathRoutes = pathRoutes;
    }

    getTotalDistance() {
        return this.#pathRoutes.reduce((total, route) => total + route.getDistance(), 0);
    }

    getPathRoutes() {
        return this.#pathRoutes;
    }

    /**
     * Returns a JSON containg the path total distance and ids of the routes.
     */
    toJSON() {
        return {
            totalDistance: this.getTotalDistance(),
            routes: this.#pathRoutes.map(route => route.getId())
        };
    }
}
// =============================================== AKHIR RESULT CLASS =============================================

// =============================================== GRAPH CLASS =============================================
const GraphSearchingAlgorithm = {
    DIJKSTRA: 'dijkstra',
    ASTAR: 'astar',
}

class Graph {
    #vertices
    
    constructor(initialVertex) {
        if (!(initialVertex instanceof Vertex)) {
            throw new Error('Initial vertex must be an instance of Vertex');
        }
        this.#vertices = new Map();
    }

    // Getters

    getVertex(id) {
        return this.#vertices.get(id);
    }

    getVertices() {
        return this.#vertices.values();
    }

    // General methods

    addVertex(vertex) {
        if (!(vertex instanceof Vertex)) {
            throw new Error('Vertex must be an instance of Vertex');
        }
        this.#vertices.set(vertex.getId(), vertex);
    }

    removeVertex(id) {
        this.#vertices.delete(id);

        // Remove all references to the vertex
        for (let vertex of this.getVertices()) {
            vertex.removeNeighbor(id);
        }
    }

    connectVertices(vertex1, vertex2) {
        if (!(vertex1 instanceof Vertex) || !(vertex2 instanceof Vertex)) {
            throw new Error('Both vertices must be instances of Vertex');
        }
        vertex1.addNeighbor(vertex2.getId());
        vertex2.addNeighbor(vertex1.getId());
    }

    connectVerticesById(id1, id2) {
        const vertex1 = this.getVertex(id1);
        const vertex2 = this.getVertex(id2);
        this.connectVertices(vertex1, vertex2);
    }

    disconnectVertices(vertex1, vertex2) {
        if (!(vertex1 instanceof Vertex) || !(vertex2 instanceof Vertex)) {
            throw new Error('Both vertices must be instances of Vertex');
        }
        vertex1.removeNeighbor(vertex2.getId());
        vertex2.removeNeighbor(vertex1.getId());
    }

    isConnected(vertex1, vertex2) {
        if (!(vertex1 instanceof Vertex) || !(vertex2 instanceof Vertex)) {
            throw new Error('Both vertices must be instances of Vertex');
        }
        return vertex1.hasNeighbor(vertex2.getId()) && vertex2.hasNeighbor(vertex1.getId());
    }

    isConnectedById(id1, id2) {
        const vertex1 = this.getVertex(id1);
        const vertex2 = this.getVertex(id2);
        return this.isConnected(vertex1, vertex2);
    }

    // Shortest path finder caller
    
    computeShortestRoute(startId, goalId, algorithm) {
        if (!Object.values(SearchingAlgoirthm).includes(algorithm.toUpperCase())) {
            throw new Error(`Algorithm {algorithm} is not supported. Use any of the following: ${Object.values(SearchingAlgoirthm).join(', ')}.`);
        }
        const startVertex = this.getVertex(startId);
        const goalVertex = this.getVertex(goalId);

        switch (algorithm) {
            case GraphSearchingAlgorithm.DIJKSTRA:
                return this.dijkstra(startVertex, goalVertex);
            case GraphSearchingAlgorithm.ASTAR:
                return this.astar(startVertex, goalVertex);
        }
    }

    // Shortest path algorithms methods

    /**
     * Dijkstra's algorithm to find the shortest path between two vertices. (brute-force)
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex
     * @returns Ordered list of vertices id from start to goal
     */

    /**
     * A* algorithm to find the shortest path between two vertices. (greedy)
     * @param startVertex Starting vertex
     * @param goalVertex Goal vertex
     * @returns Ordered list of vertices id from start to goal
     */
}

// =============================================== AKHIR GRAPH CLASS =============================================

var hospitalIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/6395/6395229.png', 
    iconSize: [30,30], 
    iconAnchor: [15, 50], 
    popupAnchor: [0, -50] 
  });
  var interceptionIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.freepik.com/512/2554/2554922.png', 
    iconSize: [30,30], 
    iconAnchor: [15, 50], 
    popupAnchor: [0, -50] 
  });
  
// Create an HOSPITAL MARKER

const hospital_data = [
    {"nama": "JIH Hospital", "latitude": -7.75766276, "longitude": 110.403521},
    {"nama": "Panti Rapih", "latitude": -7.7773502, "longitude": 110.377592},
    {"nama": "Rumah Sakit Universitas Amad Dahlan", "latitude": -7.7471329, "longitude": 110.424855},
    {"nama": "RSKIA Sadewa", "latitude": -7.77110765, "longitude": 110.41580},
    {"nama": "Rumah Sakit Medika Respati", "latitude": -7.7483661, "longitude": 110.433771},
    {"nama": "Rumah Sakit Hermina", "latitude": -7.770076, "longitude": 110.43256},
    {"nama": "Rumah Sakit Bethesda", "latitude": -7.7839063, "longitude": 110.377551},
    {"nama": "Rumah Sakit Dr Soetarto", "latitude": -7.78582, "longitude": 110.3769},
    {"nama": "RSUP Dr. Sardjito", "latitude": -7.768008, "longitude": 110.3729},
    {"nama": "Rumah Sakit Sakina Idaman", "latitude": -7.76755, "longitude": 110.3678},
    {"nama": "Rumah Sakit Condong Catur", "latitude": -7.754282209106126, "longitude": 110.40577948093416},
    {"nama": "Rumah Sakit Lempuyangwangi", "latitude": -7.796465483413756, "longitude": 110.3730431199074},
    {"nama": "Rumah Sakit Siloam Yogyakarta", "latitude": -7.783369536307395, "longitude": 110.39085298776628},
    {"nama": "RS Happy Land", "latitude": -7.793975477926447, "longitude": 110.39193391799928},
    {"nama": "RSPAU dr.S. Hardjolukito", "latitude": -7.797334457294952, "longitude": 110.41148185729982},
    {"nama": "RS THT Dr. Pomo", "latitude": -7.808434310398284, "longitude": 110.36851823329927}
];
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

var intersections_data = [
    {
        "persimpangan": "Jalan Tajem",
        "latitude": -7.748520314216934,
        "longitude": 110.43439865112306
    }, 
    {
        "persimpangan": "Jalan Tajem",
        "latitude": -7.751212574736011,
        "longitude": 110.43439865112306
    }, 
    {
        "persimpangan": "Jalan Tajem",
        "latitude": -7.761532304217272,
        "longitude": 110.43270349502565
    }, 
    {
        "persimpangan": "Jalan Sabo",
        "latitude": -7.760453302378131,
        "longitude": 110.42862653732301
    }, 
    {
        "persimpangan": "Jalan Stadion Maguwoharjo",
        "latitude": -7.751356090608056,
        "longitude": 110.4286399483681
    }, 
    {
        "persimpangan": "Jalan Raya Pringgondani 1",
        "latitude": -7.745033372738852,
        "longitude": 110.42766094207765
    }, 
    {
        "persimpangan": "Jalan Raya Pringgondani 2",
        "latitude": -7.745075896589286,
        "longitude": 110.42519330978395
    }, 
    {
        "persimpangan": "Jalan Cindelaras Jaya",
        "latitude": -7.746713061566767,
        "longitude": 110.42521476745607
    }, 
    {
        "persimpangan": "Gang Madukuro",
        "latitude": -7.746670537881606,
        "longitude": 110.42463541030885
    }, 
    {
        "persimpangan": "Gang Madukuro",
        "latitude": -7.746420711144629,
        "longitude": 110.42338818311693
    }, 
    {
        "persimpangan": "",
        "latitude": -7.747284473169568,
        "longitude": 110.42291074991228
    }, 
    {
        "persimpangan": "Patung Elang Jawa",
        "latitude": -7.7503275591105565,
        "longitude": 110.4224681854248
    }, 
    {
        "persimpangan": "Jalan Taman Cemara",
        "latitude": -7.759116505618583,
        "longitude": 110.42273640632631
    }, 
    {
        "persimpangan": "Jalan Tasura",
        "latitude": -7.756142582674628,
        "longitude": 110.42303681373598
    }, 
    {
        "persimpangan": "Jalan Kepuhsari",
        "latitude": -7.753301523156896,
        "longitude": 110.42330235242845
    }, 
    {
        "persimpangan": "Jalan Kepuhsari",
        "latitude": -7.752831112012443,
        "longitude": 110.41960358619691
    }, 
    {
        "persimpangan": "Jalan Raya Pringgondani",
        "latitude": -7.744972244696349,
        "longitude": 110.42408019304278
    }, 
    {
        "persimpangan": "Jalan Raya Tajem",
        "latitude": -7.745033372738852,
        "longitude": 110.43406873941423
    }, 
    {
        "persimpangan": "Jalan Padjajaran: Ring Road Utara",
        "latitude": -7.763956061796632,
        "longitude": 110.42223215103151
    }, 
    {
        "persimpangan": "Jalan Padjajaran: Ring Road Utara",
        "latitude": -7.759143082136332,
        "longitude": 110.40407091379167
    }, 
    {
        "persimpangan": "Jalan Selotomo",
        "latitude": -7.7573039831454285,
        "longitude": 110.40475755929948
    }, 
    {
        "persimpangan": "Jalan Padjajaran: Ring Road Utara",
        "latitude": -7.75952578380552,
        "longitude": 110.40528059005739
    }, 
    {
        "persimpangan": "Jalan Cempaka",
        "latitude": -7.757601641331072,
        "longitude": 110.40573924779895
    }, 
    {
        "persimpangan": "Jalan Alpukat",
        "latitude": -7.75617447472122,
        "longitude": 110.40608257055285
    }, 
    {
        "persimpangan": "Jalan Manggis",
        "latitude": -7.754811087571781,
        "longitude": 110.40643125772478
    }, 
    {
        "persimpangan": "Jalan Padjajaran: Ring Road Utara",
        "latitude": -7.766634935488672,
        "longitude": 110.43109416961671
    }, 
    {
        "persimpangan": "Simpang Tiga Maguwo",
        "latitude": -7.783388138795321,
        "longitude": 110.42972087860109
    }, 
    {
        "persimpangan": "Simpang Tiga Janti",
        "latitude": -7.783281838853151,
        "longitude": 110.41049480438234
    }, 
    {
        "persimpangan": "Jalan Laksda Adisucipto",
        "latitude": -7.783281838853151,
        "longitude": 110.41397094726564
    }, 
    {
        "persimpangan": "Jalan Babarsari",
        "latitude": -7.774166518585417,
        "longitude": 110.41586190462114
    }, 
    {
        "persimpangan": "Jalan Babarsari",
        "latitude": -7.770993383954635,
        "longitude": 110.4164841771126
    }, 
    {
        "persimpangan": "Jalan Urip Sumoharjo",
        "latitude": -7.783111758889569,
        "longitude": 110.38772821426393
    }, 
    {
        "persimpangan": "Simpang Empat Condongcatur",
        "latitude": -7.758425515567794,
        "longitude": 110.39569169282915
    }, 
    {
        "persimpangan": "Jalan Seturan",
        "latitude": -7.783218058874893,
        "longitude":110.40830075740816
    }, 
    {
        "persimpangan": "Jalan Kaliurang",
        "latitude": -7.754920052399183,
        "longitude": 110.38324356079103
    }, 
    {
        "persimpangan": "Jalan Jenderal Sudirman",
        "latitude": -7.783008116377931,
        "longitude": 110.37750095129016
    },
    {
        "persimpangan": "Jalan Affandi",
        "latitude": -7.769292531398373,
        "longitude": 110.39075374603273
    },
    {
        "persimpangan": "Jalan Argo",
        "latitude": -7.765784501246444,
        "longitude": 110.37856578826906
    },
    {
        "persimpangan": "Jalan Persatuan",
        "latitude": -7.771694983626846,
        "longitude": 110.37616252899171
    },
    {
        "persimpangan": "Jalan Kesehatan",
        "latitude": -7.768633449180834,
        "longitude": 110.37399262189868
    },
    {
        "persimpangan": "Jalan Padjajaran",
        "latitude": -7.761787437252218,
        "longitude": 110.41201829910278
    },
    {
        "persimpangan": "Jalan Colombo",
        "latitude": -7.777860506064949,
        "longitude": 110.3886079788208
    },
    {
        "persimpangan": "Jalan Urip Sumoharjo",
        "latitude": -7.783069238887897,
        "longitude": 110.37923097610474
    },
    {
        "persimpangan": "Jalan Colombo",
        "latitude": -7.776542367502168,
        "longitude": 110.37998199462892
    },
    {
        "persimpangan": "Jalan Terban",
        "latitude": -7.77611716063071,
        "longitude": 110.37431716918945
    },
    {
        "persimpangan": "Jalan Suroto",
        "latitude": -7.782941678857006,
        "longitude": 110.37485361099245
    },
    {
        "persimpangan": "Jalan Suroto",
        "latitude": -7.784684995919323,
        "longitude": 110.37468194961548
    },
    {
        "persimpangan": "Jalan Suroto",
        "latitude": -7.785896809605072,
        "longitude": 110.37451028823854
    },
    {
        "persimpangan": "Jalan Seturan Raya",
        "latitude": -7.764274976226991,
        "longitude": 110.4110097885132
    },
    {
        "persimpangan": "Jalan Laksda Adisucipto",
        "latitude": -7.783239318868718,
        "longitude": 110.4083275794983
    },
    {
        "persimpangan": "Jalan Mayor jenderal Bambang Sugeng",
        "latitude": -7.797260049816141,
        "longitude": 110.37766993045808
    },
    {
        "persimpangan": "Jalan Yos Sudarso",
        "latitude": -7.788533023763781,
        "longitude": 110.37395238876343
    },
    {
        "persimpangan": "Jalan Lempuyangan",
        "latitude": -7.790417162628816,
        "longitude": 110.37296265363696
    },
    {
        "persimpangan": "Jalann Lempuyangan",
        "latitude": -7.790496886230279,
        "longitude": 110.37409991025926
    },
    {
        "persimpangan": "Jalan Hayam Wuruk",
        "latitude": -7.796837521381965,
        "longitude": 110.37264347076417
    },
    {
        "persimpangan": "Jalan Dokter Sutomo",
        "latitude": -7.789999942200338,
        "longitude": 110.37820369005205
    },
    {
        "persimpangan": "jalan Inspeksi Selokan Mataram",
        "latitude": -7.769122445763837,
        "longitude": 110.40208339691164
    }, 
    {
        "persimpangan": "Janti",
        "latitude": -7.798570150990592,
        "longitude": 110.40987253189088
    },
    {
        "persimpangan": "Jalan Laksda Adisucipto",
        "latitude": -7.783281838853151,
        "longitude": 110.3950881958008
    },
    {
        "persimpangan": "",
        "latitude": -7.792551092460299,
        "longitude": 110.3930711746216
    }
]
// make intersection marker
var intersection_markers = [];
intersections_data.forEach(function(intersection) {
    const marker = L.marker([intersection.latitude, intersection.longitude]).bindPopup(intersection.nama);
    intersection_markers.push(marker);
});
// make hospital data to intersection class
const intersection_vertices = [];
for (const data of intersections_data) {
    const vertex = new Vertex(false,data.latitude, data.longitude, data.nama, Vertex.idCounter);
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



