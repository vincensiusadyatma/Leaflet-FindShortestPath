const defaultLatLong = [-7.753881231082619, 110.42189287890972];

    const controlLatitude = document.getElementById('latitude');
    const controlLongitude = document.getElementById('longitude');
    const clickSound = document.getElementById('click-sound');
    const clickSoundAccident = document.getElementById("click-sound-crash");
    const findHosp = document.getElementById("findHospitalButton");

    controlLatitude.value = defaultLatLong[0];
    controlLongitude.value = defaultLatLong[1];

    // The map
    var map = L.map('map').setView([defaultLatLong[0], defaultLatLong[1]], 16);


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    setDefaultMarker();

    // find hospital button function event
    findHosp.addEventListener('click',function(){
        clickSound.play();
    
    })
        

    // On map click
    map.on('click', function(e) {
        // Play click sound
        clickSoundAccident.play();

        // Remove previous marker
        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Set marker
        L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
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
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        setDefaultMarker();
    }

    function copyLatLong() {
        navigator.clipboard.writeText(`${controlLatitude.value}, ${controlLongitude.value}`);
    }

    function findHospital() {
        const startLat = controlLatitude.value;
        const startLong = controlLongitude.value;
        const shouldBigHospital = document.getElementById('shouldBigHospital').checked;

        // Asynchronous alert
        setTimeout(() => {
            alert(`Finding nearest ${shouldBigHospital ? 'big hospital' : 'small hospital'} hospital from [${startLat}, ${startLong}]`);
        }, 0);

        // Call greedy method to find nearest hospital
    }