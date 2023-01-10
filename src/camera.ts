
export class Camera {
  protected sensorDiagMM:number = 0;
  protected sensorWidthMM:number = 0;
  protected minFOV:number = 0;
  protected maxFOV:number = 0;
  protected minFocalLength:number = 0;
  protected minDOF:number = 0;
  protected hPixels:number = 3840;

  rads(deg:number)
  {
    return deg*Math.PI/180;

  }

  _fStop:number = 1.8;

  _fov:number = 33.3;
  public get fov() { return this._fov;}
  public set fov(val:number)
  {
    this._fov = Math.max(this.minFOV, Math.min(this.maxFOV, val));
  }

  _nearDOF:number = 1234;
  public get nearDOF():number { return this._nearDOF; }
  public set nearDOF(val:number) { this._nearDOF = Math.max(this.minDOF, val);}


  // public get sensorWidthMM():number {
  //   return 2*this.minFocalLength * Math.tan(this.rads(80.8/2));
  // }

  public get focalLength():number {
    return ( this.sensorWidthMM / 2 ) / ( Math.tan(this.rads(this.fov/2)))
  }

  public get circleOfConfusionLimit():number {
    return this.sensorDiagMM / this.hPixels;
  }
   
  public get focusDistance():number {
    return  ( this.hyperFocalDistance - this.focalLength) / (( this.hyperFocalDistance/this.nearDOF)-1);
  } 

  public get hyperFocalDistance():number {
    return this.focalLength + ( this.focalLength * this.focalLength / ( this._fStop * this.circleOfConfusionLimit ))
  }

  public get farDOF():number {
    return ( this.hyperFocalDistance * this.focusDistance ) / ( this.hyperFocalDistance - this.focusDistance + this.focalLength )
  }

  public get DOF():number{ return this.farDOF - this.nearDOF; }
};

export class NC12x80 extends Camera{

  constructor()
  {
    super();
    this.sensorDiagMM = (1/2.8)*25.4;
    this.sensorWidthMM = 5.906;
    this.minFOV = 7.5;
    this.maxFOV = 80.8;
    this.minFocalLength = 3.47;
    this.minDOF = 1000;

    var crap = this.farDOF;
  }
};
