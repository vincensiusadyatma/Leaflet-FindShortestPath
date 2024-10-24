# Greedy Ambulance

This is a project for "Algorithm Strategy Analysis" course.
The name itself came from the title of our paper, which analyzes how greedy algorithm works on closed graph map.
The application visualize how the four shortest path finder algorithms work. 
It uses object oriented approach using Graph and predefined Vertex points using JavaScript.
The graph lines are drawn over Yogyakarta, Indonesia using [Open Street Map](https://www.openstreetmap.org/).

## Features

- Four different algorithms:
  - Greedy (Cheapest Nearest Neighbors)
  - Best First Search (backtracking)
  - Dijkstra
  - A-star (heurstic approach)
- Latitude and Longitude viewer with clipboard copy
- Graph lines toggle buttons
- Start and Goal point input
- Start algorithm with selected algorithm and see total distance in kilometers

## Website Preview

If no goal point was specified, the website passes `null` to the algorithm and finds the nearest hospital vertex.

### Simple Application Demo

<img alt="Demo" src="assets/greedy-ambulance-demo.gif" style="width:100%">

### Feature Overview

- **Main page**<br>
  ![image](assets/main-page.png)
- **Toggling predefined graph**<br>
  ![image](assets/toggling-predefined-graph.png)
- **Select start/goal vertex**<br>
  ![image](assets/selecting-start-goal.png)
- **Algorithm selection**<br>
  ![image](assets/algorithm-selection.png)
- **Showing the shortest path**<br>
  ![image](assets/shortest-path.png)
- **Using All Algorithms**<br>
  ![image](assets/all-algo-path.png)

## Benchmark Results

can be seen on [src/js/tests/reading-results.ipynb](https://github.com/vianneynara/Leaflet-FindShortestPath/blob/main/src/js/tests/reading-results.ipynb)

## Installing

1. Clone the repository in htdocs (using XAMPP apache localserver)
2. Open the path to the project 

## Contributors

- [Nara](https://github.com/vianneynara)
- Revin ([NateNats](https://github.com/NateNats))
- [Vito](https://github.com/vincensiusadyatma)
