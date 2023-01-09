import Konva from  "konva";

export default class extends Konva.Layer {

  angle: number = 60;
  fov:number = 120;
  radius:number = 300;
  wedge:Konva.Wedge = null;
  radiusDown:number = 0;
  deltaDown:number = 0;
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
    this.wedge.radius(this.radius);
  };

  constructor(centerX:number, centerY:number)
  {
    super();
  
    this.wedge = new Konva.Wedge({
      x: centerX,
      y: centerY,
      radius: 300,
      fill: '#BBCCFF50',
      stroke: 'black',
      strokeWidth: 1,
      angle:0
    });

    this.wedge.on('pointerdown', ()=> {
      this.isWedgeDown = true;
      this.radiusDown = this.wedge.radius();
      this.downPt = this.getRelativePointerPosition();
    
      var x  = this.downPt.x - this.wedge.x();
      var y =  this.wedge.y() - this.downPt.y;
    
      this.deltaDown = Math.sqrt(x*x + y*y);
      this.fovDown = this.fov;
    });

    this.wedge.on('pointermove', ()=> {
      if(this.isWedgeDown)
      {
        var currentPoint = this.getRelativePointerPosition();
        // new angle between center and point
        var x  = currentPoint.x - this.wedge.x();
        var y =  this.wedge.y() - currentPoint.y;
        var rad  = Math.atan(y/x);
//        writeMessage(" x " + x + " y " + y + " rad " + rad + " angle " + angle );
        if( x < 0 ) rad += Math.PI;
        var newDelta = Math.sqrt(x*x + y*y);
    
        if(this.isShiftDown)
        {
          this.fov = Math.min( 160, Math.max(30, this.fovDown + newDelta - this.deltaDown));
        }
        else
        {
          this.angle = -rad * 180 / Math.PI;
          this.radius = this.radiusDown + newDelta - this.deltaDown;
        }
        this.update();
      }
    });

    this.wedge.on('pointerleave', () =>{this.isWedgeDown = false; });
    this.wedge.on('pointerup', () =>{this.isWedgeDown = false; });

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


