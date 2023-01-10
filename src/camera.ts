import Konva from  "konva";
import { stages } from "konva/lib/Stage";

export default class extends Konva.Layer {

  angle: number = 180;
  fov:number = 120;
  radius:number = 300;

  wedge:Konva.Wedge = null;
  wedge2:Konva.Wedge = null;
  wedge3:Konva.Wedge = null;
  camera:Konva.Rect = null;
  group:Konva.Group = null;

  radiusDown:number = 0;
  deltaDown:number = 0;
  angleDown:number = 0;
  fovDown:number = 0;
  isWedgeDown:boolean = false;
  downPt:any = {};
  isShiftDown:boolean = false;

  setShiftDown(isShiftDown:boolean)
  {
    this.isShiftDown = isShiftDown;
    this.downPt = this.getRelativePointerPosition();

    var x  = this.downPt.x - this.wedge.x();
    var y =  this.wedge.y() - this.downPt.y;
  
    this.deltaDown = Math.sqrt(x*x + y*y);
    this.fovDown = this.fov;
  }

  update()
  {
    this.wedge.angle(this.fov);
    this.wedge.rotation(this.angle - this.fov/2);
    this.wedge.radius(this.radius*1.5);

    this.wedge2.angle(this.fov);
    this.wedge2.rotation(this.angle - this.fov/2);
    this.wedge2.radius(this.radius);

    this.wedge3.angle(this.fov);
    this.wedge3.rotation(this.angle - this.fov/2);
    this.wedge3.radius(this.radius *.5);
  };

  calcAngle(centerX:number, centerY: number, ptX:number, ptY:number)
  {
    var x  = ptX - centerX;
    var y =  centerY - ptY;
    var rad  = Math.atan(y/x);
    if( x < 0 ) rad += Math.PI;
    return -rad * 180 / Math.PI    
  }

  getMousePoint()
  {
    var pt = this.getRelativePointerPosition();
    var x  = pt.x - this.group.x() - this.wedge.x();
    var y =  pt.y - this.group.y() - this.wedge.y();
    return { x: x, y: y};
  }
  constructor(centerX:number, centerY:number)
  {
    super();

    this.group  = new Konva.Group();
    this.add(this.group);

    this.camera = new Konva.Rect({
      x:centerX, 
      y:centerY - 12,
      width: 24,
      height: 24,
      fill: "lightgray",
      stroke: "black",
      strokeWidth: 1,
      draggable: true,
    });

    this.camera.className = "crosshair";

    this.camera.on('pointerenter', ()=>{
      this.getStage().container().className = 'grab';
    });

    this.camera.on('pointerleave', ()=>{
      this.getStage().container().className = '';
    });


    this.camera.on('dragstart', () => {
      this.camera.stopDrag();
      this.group.startDrag();
    });    

    this.group.add(this.camera);

  
    this.wedge = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#FFCCBB20',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.wedge.on('pointerenter', (evt)=> {
      this.getStage().container().className = 'crosshair';
    });

    this.wedge.on('pointerdown', (evt)=> {
//      evt.cancelBubble = true;
      this.isWedgeDown = true;
      this.radiusDown = this.radius;
      this.angleDown = this.angle;
      this.fovDown = this.fov;
      this.downPt = this.getMousePoint();
      console.log("downpt %f, %f", this.downPt.x, this.downPt.y);
      this.deltaDown = Math.sqrt(this.downPt.x*this.downPt.x + this.downPt.y*this.downPt.y);
    });

    this.wedge.on('pointermove', (evt)=> {
//      evt.cancelBubble = true;
      if(this.isWedgeDown)
      {
        var currentPoint = this.getMousePoint();
        console.log("currentPoint %f, %f", currentPoint.x, currentPoint.y);
        var newDelta = Math.sqrt(currentPoint.x*currentPoint.x + currentPoint.y*currentPoint.y);
        if(this.isShiftDown)
        {
          this.fov = Math.min( 160, Math.max(30, this.fovDown + newDelta - this.deltaDown));
        }
        else
        {
          var downAngle = this.calcAngle(0, 0, this.downPt.x, this.downPt.y);
          var currentAngle = this.calcAngle(0, 0, currentPoint.x, currentPoint.y);
          this.angle = this.angleDown + currentAngle - downAngle;
          this.radius = this.radiusDown + ( newDelta - this.deltaDown );
        }
        this.update();
      }
    });

    this.wedge.on('pointerleave', (evt) =>{
      this.getStage().container().className = '';
      this.isWedgeDown = false; 
//      evt.cancelBubble = true; 
    });
    this.wedge.on('pointerup', (evt) =>{
      this.isWedgeDown = false; 
//      evt.cancelBubble = true; 
    });

    this.wedge2 = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#BBCCFF50',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.group.add(this.wedge2);

    this.wedge3 = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#AAEEFF50',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.group.add(this.wedge3);


    // add the shape to the layer
    this.group.add(this.wedge);
    
    this.update();

    window.addEventListener("keydown", (event) =>{
      if(event.code == "ShiftLeft" ) {
        this.setShiftDown(true);
      }
    });
    
    window.addEventListener("keyup", (event) =>{
      if(event.code == "ShiftLeft" ) {
        this.setShiftDown(false);
      }
    });
    
  }
}


