import Konva from  "konva";
import Grid from "./grid";
import Camera from "./camera"
import Images from "./images"
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

  stage.add(new Grid(width, height, 15));
  var imgs = new Images();
  stage.add(imgs);
  stage.add(new Camera(width/2, height/2));

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

  var layer = new Konva.Layer();

  var asdf = document.createElement("div");
  asdf.innerText = "YO!!!";
  crap.appendChild(asdf);

  crap.appendChild(input);
  crap.appendChild(element);

  return crap;
}

document.body.appendChild(component());