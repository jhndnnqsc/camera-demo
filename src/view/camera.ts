import Konva from  "konva";
import { NC12x80, Camera } from "../model/camera";
import { Util } from "../util";
export default class extends Konva.Layer {

  angle: number = 0;

  limits:any;

  wedge:Konva.Wedge = null;
  camera:Konva.Group = null;
  group:Konva.Group = null;

  fovRect:Konva.Rect = null;
  fovGroup:Konva.Group = null;

  infoText:Konva.Text = null;

  fovDown:number = 0;
  angleDown:number = 0;
  dofDown:number = 0;


  deltaDown:number = 0;
  isWedgeDown:boolean = false;
  downPt:any = {};
  isShiftDown:boolean = false;

  _cam:Camera = new NC12x80();
  public get cam():Camera { return this._cam; }

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
    this.wedge.radius(10000);

    this.fovRect.offsetX(Util.mmToPx(-this.cam.nearDOF));
    this.fovRect.width(Util.mmToPx(this.cam.DOF));

    this.infoText.text(`FOV : ${this.cam.fov}
Near DOF : ${(this.cam.nearDOF/1000).toPrecision(3)}m
Far DOD : ${(this.cam.farDOF/1000).toPrecision(3)}m
DOF : ${(this.cam.DOF/1000).toPrecision(3)}m`);
  };

  clipFOV(ctx:Konva.Context)
  {
    if(this.cam)
    {
      var dof = this.cam.farDOF;
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

    this.infoText = new Konva.Text({
      offsetX: 200,
      offsetY: 400,
      text: ""
    });


    this.add(this.infoText);

    var camSize:number =  24;


    this.camera = new Konva.Group({ draggable: true });
    this.camera.add(new Konva.Circle({
      width: camSize,
      height: camSize,
      fill: "lightgray",
      stroke: "black",
      strokeWidth: 1,
    }));
    this.camera.add(new Konva.Rect({
      x: -camSize/2,
      y: -camSize/4,
      width: camSize,
      height: camSize/2,
      fill: "lightgray",
      stroke: "black",
      strokeWidth: 1,
    }));



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

    this.group.on('dragmove', () => {
      // limit so camera is always in 
      this.group.x(Math.max(this.limits.left + this.offsetX() + this.camera.width()/2, this.group.x()));
      this.group.x(Math.min(this.limits.right + this.offsetX() - this.camera.width()/2, this.group.x()));
      this.group.y(Math.max(this.limits.top + this.offsetY() + this.camera.height()/2, this.group.y()));
      this.group.y(Math.min(this.limits.bottom + this.offsetY() - this.camera.height()/2, this.group.y()));
    });    




    this.group.add(this.camera);

  
    this.wedge = new Konva.Wedge({
      radius: 300,
      fill: '#FFCCBB20',
      stroke: 'black',
      strokeWidth: 1,
      angle:0,
      x: 12,
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
          this.cam.nearDOF =  this.dofDown +  Util.pxToMM(newDelta - this.deltaDown);
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

    this.fovGroup = new Konva.Group({ clipFunc: (cts)=> this.clipFOV(cts), x: 12 });
    this.group.add(this.fovGroup);


    this.fovRect = new Konva.Rect({
      fill: '#44CCFF50',
      stroke: 'black',
      strokeWidth: 1,
      width:600,
      height:6000,
      offsetY: 3000
    })

    this.fovGroup.add(this.fovRect);

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


