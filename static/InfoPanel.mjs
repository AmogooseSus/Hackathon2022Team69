import * as THREE from "./THREE/Three.js";
import SphereMath from "./SphereMath.mjs";
import * as API from "./API.js";
export default class InfoPanel{
  constructor(){
    this.DivElement = document.getElementById("InfoPanel");
    this.MakeDraggable(this.DivElement);
    this.MakeDraggable(document.getElementById("Sidebar"));
    this.LineSVG = document.getElementById("LineSVG");
    this.Line = document.getElementById("Line");
    this.DivElement.style.display = "none";
    this.LineSVG.style.display = "none";

    window.addEventListener("resize", this.Resize.bind(this));
    this.Resize();

    this.SelectedPoint = null;
    this.PointMeshes = new THREE.Object3D;
    Main.Renderer.Scene.add(this.PointMeshes);

    const MembersListElement = document.getElementById("MembersList");
    this.SelectedElement = null;
    MembersListElement.addEventListener("click", function(Event){
      if(Event.path[0].dataset.Name === undefined) return; //Has clicked somewhere inbetween that is not a valid element
      if(this.SelectedElement !== null) this.SelectedElement.className = "";
      Event.path[0].className = "Selected";
      this.SelectedElement = Event.path[0];
      this.SelectPoint(this.SelectedElement.dataset.Name);

      const LatLon = SphereMath.CoordinatesToLatLon(this.SelectedPoint.position.clone().multiplyScalar(2));

      //Start animation cycle
      Main.Renderer.ExternalRotation[0] %= Math.PI * 2;
      Main.Renderer.ExternalRotation[1] %= Math.PI * 2;

      const NewRotation = [
        LatLon[1] / 180. * Math.PI + Math.PI / 2.,
        LatLon[0] / 180. * Math.PI
      ];
      //Main.Renderer.ExternalRotation[0] = NewRotation[0];
      //Main.Renderer.ExternalRotation[1] = NewRotation[1];

      const Difference = [
        Main.Renderer.ExternalRotation[0] - NewRotation[0],
        Main.Renderer.ExternalRotation[1] - NewRotation[1]
      ];
      const InitialRotation = [...Main.Renderer.ExternalRotation];
      let AnimationFrame = 0;
      void function Animate(){
        if(++AnimationFrame < 30) window.requestAnimationFrame(Animate);
        const Time = AnimationFrame / 30.;
        for(let i = 0; i < 2; ++i) Main.Renderer.ExternalRotation[i] = InitialRotation[i] + (NewRotation[i] - InitialRotation[i]) * (Time ** 2. * (3. - 2. * Time));

      }();


      /**/
      /*
      Main.Renderer.ExternalRotation[0] = (LatLon[1] + 90.) * Math.PI / 180.;
      Main.Renderer.ExternalRotation[1] = LatLon[0] * Math.PI / 180.;*/
    }.bind(this));

    this.CountryCodeToName = {
      "gb": "United Kingdom",
      "de": "Germany",
      "gr": "Greece",
      "us": "United States",
      "ru": "Russia",
      "au": "Australia"
    };

    this.Locations = [
      {"City": "Glasgow", "Name": "Luka", "LatLon": [56., -3.],"Country":"gb"},
      {"City": "Frankfurt", "Name": "Marcus", "LatLon": [50., 8.],"Country":"de"},
      {"City": "Athens", "Name": "Matthew", "LatLon": [38., 21.],"Country":"gr"},
      {"City": "Salt Lake City", "Name": "Lincoln", "LatLon": [41., -110.],"Country":"us"},
      {"City": "Petropavlovsk", "Name": "Tom", "LatLon": [54., 162.],"Country":"ru"},
      {"City": "Melbourne", "Name": "Paul", "LatLon": [-35, 160.],"Country":"au"}
    ];

    for(const Info of this.Locations){
      const PointMesh = Main.Renderer.AddPointMesh();
      PointMesh.name = Info.Name;
      this.PointMeshes.add(PointMesh);
      const SphereCoordinates = SphereMath.LatLonToCoordinates([...Info.LatLon]).multiplyScalar(.5);
      for(const Axis of ["x", "y", "z"]) PointMesh.position[Axis] = SphereCoordinates[Axis];

      const DivElement = document.createElement("div");
      DivElement.innerText = Info.Name;
      DivElement.dataset.Name = Info.Name;
      MembersListElement.appendChild(DivElement);
    }

    void function Update(){
      window.requestAnimationFrame(Update.bind(this));
      if(this.SelectedPoint !== null) {
        const UnitPosition = this.SelectedPoint.position.clone().project(Main.Renderer.Camera);
        const PositionX = (UnitPosition.x + 1.) / 2. * window.innerWidth;
        const PositionY = (1. - UnitPosition.y) / 2. * window.innerHeight;

        const Rect = this.DivElement.getBoundingClientRect();
        const EPositionX = Rect.left;
        const EPositionY = Rect.top;

        this.Line.setAttributeNS(null, "x1", EPositionX);
        this.Line.setAttributeNS(null, "y1", EPositionY);

        this.Line.setAttributeNS(null, "x2", PositionX);
        this.Line.setAttributeNS(null, "y2", PositionY);
      }
    }.bind(this)();
  }
  Resize(){
    const Width = window.innerWidth;
    const Height = window.innerHeight;
    this.LineSVG.setAttributeNS(null, "viewBox", "0 0 " + Width + " " + Height);
    this.LineSVG.setAttributeNS(null, "width", Width);
    this.LineSVG.setAttributeNS(null, "height", Height);
  }
  MakeDraggable(Element){
    let Moving = false;
    let Previous = [null, null];
    window.addEventListener("mousemove", function(Event){
      if(!Moving) return;
      const Difference = [Previous[0] - Event.clientX, Previous[1] - Event.clientY];
      Element.style.left = (Element.offsetLeft - Difference[0]) + "px";
      Element.style.top = (Element.offsetTop - Difference[1]) + "px";
      Previous = [Event.clientX, Event.clientY];
    });
    Element.addEventListener("mousedown", function(Event){
      Moving = true;
      Previous = [Event.clientX, Event.clientY];
      window.addEventListener("mouseup", function(){
        Moving = false;
      }, {"once": true});
    })
  }
  async SelectPoint(Name){
    this.SelectedPoint = this.PointMeshes.getObjectByName(Name);
    this.DivElement.style.display = "block";
    this.LineSVG.style.display = "block";
    let Location;
    for(const SearchLocation of this.Locations){
      if(Name === SearchLocation.Name){
        Location = SearchLocation;
        break;
      }
    }
    if(!Location) throw new Error("Not found");

    document.getElementById("InfoCity").innerText = Location.City;
    document.getElementById("InfoCountry").innerText = this.CountryCodeToName[Location.Country];
    document.getElementById("UserName").innerText = Location.Name;

    document.getElementById("InfoTemperature").innerText = "";
    document.getElementById("InfoWind").innerText = "";
    document.getElementById("InfoRain").innerText = "";

    document.querySelectorAll("#NewsPanel > *:not(#NewsHeader)").forEach(function(Element){
      Element.remove();
    });

    const WeatherPromise = API.get_weather(Location.LatLon[0], Location.LatLon[1]);
    const NewsPromise = API.get_headlines(Location.Country);
    Promise.all([WeatherPromise,NewsPromise]).then(function(Values){
      const Weather = Values[0];
      const News = Values[1];
      document.getElementById("InfoWind").innerText = Weather.current.wind_kph + "km/h";
      document.getElementById("InfoRain").innerText = Weather.current.precip_mm + "mm";
      document.getElementById("InfoTemperature").innerText = Math.round(Weather.current.temp_c * 10.) / 10. + "°C";
      document.getElementById("WeatherIcon").src = Weather.current.condition.icon.replace("64x64", "128x128");

      const NewsPanelElement = document.getElementById("NewsPanel");
      for(let i = 0; i < 3; ++i){
        const Element = document.createElement("div");
        Element.innerText = News.articles[i].title;
        Element.classList.add("NewsTitles");
        NewsPanelElement.appendChild(Element);
      }

    });


  }
  Deselect(){
    this.SelectedPoint = null;
    this.DivElement.style.display = "none";
    this.LineSVG.style.display = "none";
  }
};