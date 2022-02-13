import * as THREE from "./THREE/Three.js";
import Planet from "./Planet.mjs";


export default class Renderer{
  constructor(){
    this.Renderer = new THREE.WebGLRenderer;
    this.Renderer.domElement.style.position = "absolute";
    document.getElementsByTagName("body")[0].appendChild(this.Renderer.domElement);

    this.Scene = new THREE.Scene;
    this.Camera = new THREE.PerspectiveCamera(45, 1.7, 0.1, 1500);
    this.Light = new THREE.SpotLight(0xffffff, 1, 0, 10, 2);
    this.AmbientLight = new THREE.AmbientLight(0xffffff, .4);
    this.TextureLoader = new THREE.TextureLoader();
    this.Planet = this.CreatePlanet();
    this.ExternalRotation = [0., 0.];
    this.Distance = 2.;
    this.Points = [];

    this.BackgroundGeometry = new THREE.SphereGeometry(100, 32, 32);
    this.BackgroundMaterial = new THREE.MeshBasicMaterial;
    this.BackgroundMaterial.side = THREE.BackSide;
    this.BackgroundMesh = new THREE.Mesh(this.BackgroundGeometry, this.BackgroundMaterial);
    this.LoadTexture(this.BackgroundMaterial, "map", 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/starfield.png');

    this.Scene.add(this.Camera);
    this.Scene.add(this.Light);
    this.Scene.add(this.AmbientLight);
    this.Scene.add(this.Planet);
    this.Scene.add(this.BackgroundMesh);


    void function Render() {
      window.requestAnimationFrame(Render.bind(this));
      const iTime = window.performance.now() / 1000.;
      this.Camera.aspect = window.innerWidth / window.innerHeight;
      this.Camera.updateProjectionMatrix();
      this.Renderer.setSize(window.innerWidth, window.innerHeight);

      for(const PointMesh of this.Points){
        const Scale = this.Distance;
        PointMesh.scale.set(Scale, Scale, Scale);
      }

      this.Planet.getObjectByName('Atmosphere').rotation.set(0., -iTime / 90., 0.);
      this.Camera.position.set(Math.sin(this.ExternalRotation[0]), Math.tan(this.ExternalRotation[1]), Math.cos(this.ExternalRotation[0])).normalize().multiplyScalar(this.Distance);
      this.Light.position.set(2. * Math.sin(iTime / 10.), .5 * Math.sin(iTime / 10.), Math.cos(iTime / 10.));
      this.Camera.lookAt(this.Planet.position);
      this.Renderer.render(this.Scene, this.Camera);

      document.getElementById("Mogus").style.transform = "scale(" + window.innerWidth / (5000. + iTime * 100.) + ") translate(" + (-3000 + iTime * 220) + "px, " + (-300 + iTime * 100) + "px) rotate(" + iTime * 150. + "deg)";
    }.bind(this)();
  }
  CreatePlanet(){
    // Create the planet's Surface
    const SurfaceGeometry = new THREE.SphereGeometry(.5, 32, 32);
    const SurfaceMaterial = new THREE.MeshPhongMaterial;
    SurfaceMaterial.bumpScale = .05;
    SurfaceMaterial.specular = new THREE.Color(.5, .5, .5);
    SurfaceMaterial.shininess = 5;

    const SurfaceMesh = new THREE.Mesh(SurfaceGeometry, SurfaceMaterial);

    // Create the planet's Atmosphere
    const AtmosphereGeometry = new THREE.SphereGeometry(.505, 32, 32);

    const AtmosphereMaterial = new THREE.MeshPhongMaterial;
    AtmosphereMaterial.side = THREE.FrontSide;
    AtmosphereMaterial.transparent = true;
    const AtmosphereMesh = new THREE.Mesh(AtmosphereGeometry, AtmosphereMaterial);

    // Nest the planet's Surface and Atmosphere into a planet object
    const Planet = new THREE.Object3D();
    SurfaceMesh.name = 'Surface';
    AtmosphereMesh.name = 'Atmosphere';
    Planet.add(SurfaceMesh);
    Planet.add(AtmosphereMesh);

    // Load the Surface's textures
    for(const [Property, TextureURL] of Object.entries({
      map: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthmap1k.jpg',
      bumpMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthbump1k.jpg',
      specularMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthspec1k.jpg'
    })) this.LoadTexture(SurfaceMaterial, Property, TextureURL);

    // Load the Atmosphere's texture
    for (const [Property, TextureURL] of Object.entries({
      map: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmap.jpg',
      alphaMap: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/141228/earthcloudmaptrans.jpg'
    })) this.LoadTexture(AtmosphereMaterial, Property, TextureURL);

    Planet.receiveShadow = true;
    Planet.castShadow = true;
    SurfaceGeometry.center();

    return Planet;
  }
  AddPointMesh(){
    const PointGeometry = new THREE.SphereGeometry(.01, 10, 10);
    const PointMaterial = new THREE.MeshBasicMaterial({
      "transparent": true,
      "opacity": .65
    });
    const PointMesh = new THREE.Mesh(PointGeometry, PointMaterial);
    this.Points.push(PointMesh);
    return PointMesh;
  }
  LoadTexture(Material, Property, TextureURL){
    this.TextureLoader.crossOrigin = true;
    this.TextureLoader.load(TextureURL, function(LoadedTexture) {
      Material[Property] = LoadedTexture;
      Material.needsUpdate = true;
    });
  }
};