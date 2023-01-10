import Konva from  "konva";

export default class extends Konva.Layer {
  gridSize: number;

  getLineColor(value:number)
  {
    var step = value / this.gridSize;
    if(step % 10 === 0 ) return "#8CB";
    else if( step % 5 === 0 ) return "#BEB";
    return "#CFC";
  }

  constructor(width: number, height: number, size: number)
  {
    super();
    this.gridSize = size;
    var background = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: "#EFE",
      listening: false,
    });
    this.add(background);

    var x = 0;
    while(x < width)
    {
      this.add( new Konva.Line({
        points: [x, 0, x, height],
        stroke: this.getLineColor(x),
        strokeWidth: 1,
        listening: false,
      }));
      x += this.gridSize;
    }

    var y = 0;
    while(y < height)
    {
      this.add( new Konva.Line({
        points: [0, y, width, y],
        stroke: this.getLineColor(y),
        strokeWidth: 1,
        listening: false,
      }));
      y += this.gridSize;
    }
  }
};

