import * as THREE from "./THREE/Three.js";
export default class SphereMath{
  static LatLonToCoordinates(LatLon){
    for(let i = 0; i < 2; ++i) LatLon[i] /= 180. / Math.PI;
    return new THREE.Vector3(
      Math.cos(LatLon[0]) * Math.cos(LatLon[1]),
      Math.sin(LatLon[0]),
      -Math.cos(LatLon[0]) * Math.sin(LatLon[1])
    );
  }
  static CoordinatesToLatLon(Coordinates){
    return [
      90. - Math.acos(Coordinates.y) * 180. / Math.PI,
      (Math.atan2(Coordinates.x, Coordinates.z) * 180. / Math.PI + 450.) % 360. - 180.
    ];
  }
};