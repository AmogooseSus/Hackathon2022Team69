import * as THREE from "./THREE/Three.js";
export default class Planet{
  constructor(){
    this.SurfaceGeometry = new THREE.SphereGeometry(3, 20, 20);
    this.SurfaceMaterial = new THREE.MeshPhongMaterial;
    this.SurfaceMaterial.color = 0xff007f;
    this.SurfaceMesh = new THREE.Mesh(this.SurfaceGeometry, this.SurfaceMaterial);

    /*this.PlanetObject = new THREE.Object3D;
    this.PlanetObject.add(this.SurfaceMesh);

    this.TextureLoader = new THREE.TextureLoader;


    this.TextureLoader.load("./earthmap1k", function(Texture){
      this.SurfaceMaterial.map = Texture;
    }.bind(this));*/

  }
};
































