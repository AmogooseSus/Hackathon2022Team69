import * as THREE from "./THREE/Three.js";
import SphereMath from "./SphereMath.mjs";
export default class Controls{
  constructor(){
    this.CanvasElement = Main.Renderer.Renderer.domElement;
    this.IsMouseDown = false;
    this.HasMovedMouse = 0;
    this.PreviousCoords = [null, null];
    this.ApplyRotation = [0., 0.];
    this.SphereLatLon = [0., 0.];

    this.CanvasElement.addEventListener("wheel", function(Event){
      Main.Renderer.Distance *= 1. + Math.sign(Event.deltaY) / 10.;
      Main.Renderer.Distance = Math.max(1., Math.min(5., Main.Renderer.Distance));
    });

    this.CanvasElement.addEventListener("mousedown", function(Event){
      this.IsMouseDown = true;
      this.HasMovedMouse = 0;
      this.PreviousCoords = [Event.clientX, Event.clientY];
    }.bind(this));

    window.addEventListener("mousemove", function(Event){
      if(!this.IsMouseDown) return;
      this.HasMovedMouse++;
      const ChangeX = this.PreviousCoords[0] - Event.clientX;
      const ChangeY = this.PreviousCoords[1] - Event.clientY;
      this.PreviousCoords = [Event.clientX, Event.clientY];

      this.RotateCamera(ChangeX, ChangeY);
    }.bind(this));

    window.addEventListener("mouseup", function(Event){
      if(this.HasMovedMouse < 10 && this.IsMouseDown) this.Raycast(Event.clientX / window.innerWidth * 2. - 1., -Event.clientY / window.innerHeight * 2. + 1.);
      this.HasMovedMouse = 0;
      this.IsMouseDown = false;
    }.bind(this));


    void function Update(){
      window.requestAnimationFrame(Update.bind(this));
      for(let i = 0; i < 2; ++i){
        Main.Renderer.ExternalRotation[i] += this.ApplyRotation[i];
        this.ApplyRotation[i] = this.ApplyRotation[i] * 0.75;// + Math.sign(ApplyRotation[i])
      }
      Main.Renderer.ExternalRotation[1] = Math.max(-Math.PI / 2., Math.min(Math.PI / 2., Main.Renderer.ExternalRotation[1]));
    }.bind(this)();
  }
  Raycast(X, Y){
    const Raycaster = new THREE.Raycaster;
    Raycaster.setFromCamera(new THREE.Vector2(X, Y), Main.Renderer.Camera);
    const Intersection = Raycaster.intersectObject(Main.InfoPanel.PointMeshes)[0];
    if(Intersection === undefined) return void Main.InfoPanel.Deselect();
    const Position = Intersection.point;
    const PosClone = Position.clone().normalize();
    this.SphereLatLon = SphereMath.CoordinatesToLatLon(PosClone);
    //document.getElementById("InfoPanel").innerText = this.SphereLatLon + "";
    Main.InfoPanel.SelectPoint(Intersection.object.name);
  }
  RotateCamera(ChangeX, ChangeY){
    this.ApplyRotation[0] += ChangeX / 800. * Main.Renderer.Distance;
    this.ApplyRotation[1] -= ChangeY / 800. * Main.Renderer.Distance;
  }
};