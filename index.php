<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
            integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
            crossorigin=""></script>
            <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
            <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
            <script src="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js"></script>
            <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    <link rel="stylesheet" href="src/css/style.css">
    <title>Greedy Ambulance</title>
</head>
<body>
    <div id="map"></div>

    <div class="card">
        <h1>Greedy Ambulance</h1>
        <div class="control-container">
            <table>
                <tr>
                    <td style="text-align: right;"><label for="latitude">Latitude</label></td>
                    <td><input type="text" id="latitude" disabled/></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><label for="longitude">Longitude</label></td>
                    <td><input type="text" id="longitude" disabled/></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><label for="shouldBigHospital">Big Hospital</label></td>
                    <td><input type="checkbox" id="shouldBigHospital"></td>
                </tr>
            </table>
            <input type="button" value="reset" onclick="resetLocation()"/>
            <input type="button" value="copyLatLong" onclick="copyLatLong()"/>
            <input type="button" value="findHospital" id="findHospitalButton" onclick="findHospital()"/>
        </div>
    </div>
    
    <audio id="click-sound" src="src/public/ambulance_sound.mp3" preload="auto"></audio>
    <audio id="click-sound-crash" src="src/public/car-accident__sound.mp3" preload="auto"></audio>

    <script type="module" src="src/js/script.js"></script>
   
</body>
</html>