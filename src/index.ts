import Konva from  "konva";
import Grid from "./grid";
import Camera from "./view/camera"
import Images from "./view/images"
import {Util} from "./util";
import Room from "./model/room";
import RoomView from "./view/room";
import "./style.css";

function component() {

  const input = document.createElement("INPUT") as HTMLInputElement;
  input.type = "file";
  input.accept = "image/jpeg, image/png, image/jpg";

  const crap = document.createElement("div");

  const element = document.createElement('container');
  var width = window.innerWidth;
  var height = window.innerHeight;

  var stage = new Konva.Stage({
    container: element as any,
    width: width,
    height: height,
  });


  // grid every 10cm 
  var foo = Util.mmToPx(100);
  stage.add(new Grid(width, height, Util.mmToPx(100)));

  var layer = new Konva.Layer();

  var room = new Room();
  var roomView = new RoomView({
    x: 200,
    y: 200,
  });
  roomView.room = room;
  layer.add(roomView);
  
  stage.add(layer);

  var imgs = new Images();
  imgs.limits = { left : 200, top : 200, right: 200 + Util.mmToPx(room.widthMM), bottom: 200 + Util.mmToPx(room.depthMM)};
  layer.add(imgs);
  var cam = new Camera(width/2, height/2);
  cam.limits = imgs.limits;
  stage.add(cam);

  input.addEventListener("change", () =>
  {
    imgs.addImageWithFile(input.files[0]);
  });

  stage.on('click tap', function (e) {
    // if click on empty area - remove all selections
    if (e.target === stage) {
      imgs.select(null);
      return;
    }
    if( e.target.className === "Image") {
      imgs.select(e.target as Konva.Image);
    }
    
  });


  var asdf = document.createElement("div");
  asdf.innerText = "YO!!!";
  crap.appendChild(asdf);

  crap.appendChild(input);
  crap.appendChild(element);

  return crap;
}

document.body.appendChild(component());