import Konva from  "konva";

export default class extends Konva.Layer {

  angle: number = 180;
  fov:number = 120;
  radius:number = 300;

  wedge:Konva.Wedge = null;
  wedge2:Konva.Wedge = null;
  wedge3:Konva.Wedge = null;

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


  constructor(centerX:number, centerY:number)
  {
    super();
  
    this.wedge = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#FFCCBB20',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.wedge.on('pointerdown', ()=> {
      this.isWedgeDown = true;
      this.radiusDown = this.radius;
      this.angleDown = this.angle;
      this.fovDown = this.fov;
      this.downPt = this.getRelativePointerPosition();
      var x  = this.downPt.x - this.wedge.x();
      var y =  this.wedge.y() - this.downPt.y;
      this.deltaDown = Math.sqrt(x*x + y*y);
    });

    this.wedge.on('pointermove', ()=> {
      if(this.isWedgeDown)
      {
        var currentPoint = this.getRelativePointerPosition();
        // new angle between center and point
        var x  = currentPoint.x - this.wedge.x();
        var y =  this.wedge.y() - currentPoint.y;
        var rad  = Math.atan(y/x);
        if( x < 0 ) rad += Math.PI;
        var newDelta = Math.sqrt(x*x + y*y);
    
        if(this.isShiftDown)
        {
          this.fov = Math.min( 160, Math.max(30, this.fovDown + newDelta - this.deltaDown));
        }
        else
        {
          var downAngle = this.calcAngle(this.wedge.x(), this.wedge.y(), this.downPt.x, this.downPt.y);
          var currentAngle = this.calcAngle(this.wedge.x(), this.wedge.y(), currentPoint.x, currentPoint.y);
          this.angle = this.angleDown + currentAngle - downAngle;
          this.radius = this.radiusDown + ( newDelta - this.deltaDown );
        }
        this.update();
      }
    });

    this.wedge.on('pointerleave', () =>{this.isWedgeDown = false; });
    this.wedge.on('pointerup', () =>{this.isWedgeDown = false; });

    this.wedge2 = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#BBCCFF50',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.add(this.wedge2);

    this.wedge3 = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#AAEEFF50',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.add(this.wedge3);


    // add the shape to the layer
    this.add(this.wedge);
    
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


