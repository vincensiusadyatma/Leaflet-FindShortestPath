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
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.css" />
    <link rel="stylesheet" href="src/css/style.css">
    <title>Greedy Ambulance</title>
    <style>
        .button-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px; 
        }
        .button-container input {
            margin-right: 10px; 
        }
        .button-container input:last-child {
            margin-right: 0; 
        }
        .highlight {
            border: 2px solid #0056b3;
        }
        .pilih-algoritma {
            margin-top: 10px;
        }
        .pilih-algoritma label {
            margin-right: 10px;
        }

        .pilih-algoritma select {
            
            padding: 5px; 
            border-radius: 5px; 
            border: 1px solid #ccc; 
            background-color: #fff; 
            font-size: 16px; 
        }




    </style>
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
                    <td style="text-align: right;"><label for="startPoint">Start Point</label></td>
                    <td><input type="text" id="startPoint" disabled/></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><label for="goalPoint">Goal Point</label></td>
                    <td><input type="text" id="goalPoint" disabled/></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><label for="shouldBigHospital">Big Hospital</label></td>
                    <td><input type="checkbox" id="shouldBigHospital"></td>
                </tr>
            </table>
            <input type="button" value="reset" id="resetButton"/>
            <input type="button" value="copyLatLong" id="copyLatLongButton"/>
            <input type="button" value="show graph" id="showGraphButton" />
            <div class="button-container">
                <input type="button" value="fill start" id="fillStartButton" />
                <input type="button" value="fill goal" id="fillGoalButton"/>
            </div>
            <input type="button" value="findHospital" id="findHospitalButton"/>
            <div class="button-container">
            <div class="pilih-algoritma">
                <label for="algorithmSelect">Select Algorithm:</label>
                <select id="algorithmSelect">
                    <option value="greedy">Greedy</option>
                    <option value="dijkstra">Dijkstra</option>
                    <option value="astar">A*</option>
                    <option value="bfs">BFS</option>
                </select>
            </div>
        </div>

        </div>
    </div>
    
    <audio id="click-sound" src="src/public/ambulance_sound.mp3" preload="auto"></audio>
    <audio id="click-sound-crash" src="src/public/car-accident__sound.mp3" preload="auto"></audio>

    <script type="module" src="src/js/script.js"></script>
   
</body>
</html>
