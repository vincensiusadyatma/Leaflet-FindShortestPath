import Vertex from "../classes/Vertex.js";
import Graph from "../classes/Graph.js";
// import { strict as assert } from 'assert';

const vertex1 = new Vertex("loc1", "intersection", -7.745820063276957, 110.39869308471681, null, null, ["loc2", "loc3", "loc4", "loc5", "loc6", "loc7"]);
const vertex2 = new Vertex("loc2", "intersection", -7.754532031177765, 110.42155086994173, null, null, ["loc1", "loc3", "loc4", "loc5", "loc6", "loc7"]);
const vertex3 = new Vertex("loc3", "intersection", -7.754532031171231, 110.42155086992344, null, null, ["loc1", "loc2", "loc4", "loc5", "loc6", "loc7"]);
const vertex4 = new Vertex("loc4", "intersection", -7.754532031171231, 110.42155083992344, null, null, ["loc1", "loc2", "loc3", "loc5", "loc6", "loc7"]);
const vertex5 = new Vertex("loc5", "intersection", -7.754532031273231, 110.42155086792314, null, null, ["loc1", "loc2", "loc3", "loc4", "loc6", "loc7"]);
const vertex6 = new Vertex("loc6", "intersection", -7.754532031435541, 110.42155086992123, null, null, ["loc1", "loc2", "loc3", "loc4", "loc5", "loc7"]);
const vertex7 = new Vertex("loc7", "intersection", -7.754532031173244, 110.42155086912331, null, null, ["loc1", "loc2", "loc3", "loc4", "loc5", "loc6"]);

const haversineDist = vertex1.haversineDistanceFrom(vertex2);
// assert.equal(haversineDist, 2.70, `Haversine distance between loc1 and loc2 should be 2.7, it is ${haversineDist}`);

const graph = new Graph();

graph.addVertex(vertex1, vertex2, vertex3, vertex4, vertex5, vertex6, vertex7);

const result = graph.computeShortestRoute("loc1", "loc3", "greedy");

console.log(result.toJSON());