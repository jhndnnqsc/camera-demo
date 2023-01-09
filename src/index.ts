import Konva from  "konva";
import Grid from "./grid";
import Camera from "./camera"
import Images from "./images"

function component() {
  const input = document.createElement("INPUT") as HTMLInputElement
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
    imgs.select(e.target as Konva.Image);
  });

  var layer = new Konva.Layer();

  var rect1 = new Konva.Rect({
    x: 20,
    y: 20,
    width: 100,
    height: 50,
    fill: 'green',
    stroke: 'black',
    strokeWidth: 4,
  });
  // add the shape to the layer
  layer.add(rect1);

  var rect2 = new Konva.Rect({
    x: 150,
    y: 40,
    width: 100,
    height: 50,
    fill: 'red',
    shadowBlur: 10,
    cornerRadius: 10,
  });
  layer.add(rect2);

  var rect3 = new Konva.Rect({
    x: 50,
    y: 120,
    width: 100,
    height: 100,
    fill: 'blue',
    cornerRadius: [0, 10, 20, 30],
  });
  layer.add(rect3);

  // add the layer to the stage
  stage.add(layer);

  crap.appendChild(input);
  crap.appendChild(element);

  return crap;
}

document.body.appendChild(component());