import Renderer from "./Renderer.mjs";
import * as THREE from "./THREE/Three.js";
import Controls from "./Controls.mjs";
import InfoPanel from "./InfoPanel.mjs";
console.log("hi");
class Main{
  static Initialise(){
    Main.Renderer = new Renderer;
    Main.Controls = new Controls;
    Main.InfoPanel = new InfoPanel;
  }
}
self.Main = Main;
self.THREE = THREE;
Main.Initialise();