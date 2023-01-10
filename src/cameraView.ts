import Konva from  "konva";
import { stages } from "konva/lib/Stage";
import * as _ from "lodash";
import { NC12x80, Camera } from "./camera";

export default class extends Konva.Layer {

  thescale:number =  4;

  angle: number = 0;

  fovRect:Konva.Rect = null;

  wedge:Konva.Wedge = null;
  // wedge2:Konva.Wedge = null;
  // wedge3:Konva.Wedge = null;
  camera:Konva.Rect = null;
  group:Konva.Group = null;

  fovGroup:Konva.Group = null;
  fovDown:number = 0;
  angleDown:number = 0;
  dofDown:number = 0;


  deltaDown:number = 0;
  isWedgeDown:boolean = false;
  downPt:any = {};
  isShiftDown:boolean = false;

  cam:Camera = new NC12x80();

  getLength(pt:any)
  {
    return Math.sqrt(pt.x*pt.x + pt.y*pt.y);
  }

  setShiftDown(isShiftDown:boolean)
  {
    this.isShiftDown = isShiftDown;
    this.downPt = this.getMousePoint();

    var x  = this.downPt.x - this.wedge.x();
    var y =  this.wedge.y() - this.downPt.y;
  
    this.deltaDown = this.getLength({x:x,y:y});
    this.fovDown = this.cam.fov;
  }

  update()
  {
    this.group.rotation(this.angle);

    // adjust wedge angle
    this.wedge.angle(this.cam.fov);
    this.wedge.rotation(-this.cam.fov/2);
    this.wedge.radius(1000);

    // this.wedge2.angle(this.cam.fov);
    // this.wedge2.rotation(-this.cam.fov/2);
    // this.wedge2.radius(this.cam.nearDOF/this.thescale);

    // this.wedge3.angle(this.cam.fov);
    // this.wedge3.rotation(-this.cam.fov/2);
    // this.wedge3.radius(this.cam.farDOF/this.thescale);

    this.fovRect.offsetX(-this.cam.nearDOF/this.thescale);
    this.fovRect.width(this.cam.DOF/this.thescale);
  };

  clipFOV(ctx:Konva.Context)
  {
    if(this.cam)
    {
      var dof = this.cam.farDOF/this.thescale;
      var y = Math.tan(this.cam.fov*Math.PI/360) * dof;
      ctx.lineTo(dof, y);
      ctx.lineTo(dof, -y);
      ctx.lineTo(0,0);
      ctx.closePath();
    }
  }

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
  constructor(x:number, y:number)
  {
    super();
    this.offsetX(-x);
    this.offsetY(-y);
    this.group  = new Konva.Group();
    
    this.add(this.group);

    this.camera = new Konva.Rect({
      offsetX: 24,
      offsetY: 12,
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
      this.isWedgeDown = true;
      this.dofDown = this.cam.nearDOF;
      this.angleDown = this.angle;
      this.fovDown = this.cam.fov;
      this.downPt = this.getMousePoint();
      console.log("downpt %f, %f", this.downPt.x, this.downPt.y);
      this.deltaDown = Math.sqrt(this.downPt.x*this.downPt.x + this.downPt.y*this.downPt.y);
    });

    this.wedge.on('pointermove', (evt)=> {
      if(this.isWedgeDown)
      {
        var currentPoint = this.getMousePoint();
        console.log("currentPoint %f, %f", currentPoint.x, currentPoint.y);
        var newDelta = Math.sqrt(currentPoint.x*currentPoint.x + currentPoint.y*currentPoint.y);
        if(this.isShiftDown)
        {
          var downLen = this.getLength(this.downPt);
          var deltaLen = this.getLength(currentPoint);
          this.cam.fov = this.fovDown + deltaLen - downLen;
        }
        else
        {
          var downAngle = this.calcAngle(0, 0, this.downPt.x, this.downPt.y);
          var currentAngle = this.calcAngle(0, 0, currentPoint.x, currentPoint.y);
          this.angle = this.angleDown + currentAngle - downAngle;
          this.cam.nearDOF = this.dofDown + ( newDelta - this.deltaDown ) * this.thescale;
        }
        this.update();
      }
    });

    this.wedge.on('pointerleave', (evt) =>{
      this.getStage().container().className = '';
      this.isWedgeDown = false; 
    });
    this.wedge.on('pointerup', (evt) =>{
      this.isWedgeDown = false; 
    });

    this.fovGroup = new Konva.Group({ clipFunc: (cts)=> this.clipFOV(cts) });
    this.group.add(this.fovGroup);


    this.fovRect = new Konva.Rect({
      fill: '#BBCCFF50',
      stroke: 'black',
      strokeWidth: 1,
      width:600,
      height:6000,
      offsetY: 3000
    })

    this.fovGroup.add(this.fovRect);


    // this.wedge2 = new Konva.Wedge({
    //   radius: 300,
    //   fill: '#BBCCFF50',
    //   stroke: 'black',
    //   strokeWidth: 1,
    //   angle:0
    // });

    // this.group.add(this.wedge2);

    // this.wedge3 = new Konva.Wedge({
    //   radius: 300,
    //   fill: '#AAEEFF50',
    //   stroke: 'black',
    //   strokeWidth: 1,
    //   angle:0
    // });

    // this.group.add(this.wedge3);


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


