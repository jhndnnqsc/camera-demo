export class Util {
  
  // we want 1cm to be 15 px
  protected static mmPerPixel:number = 15/100;
  
  public static mmToPx(mm:number):number { return mm * Util.mmPerPixel; }
  public static pxToMM(mm:number):number { return mm / Util.mmPerPixel; }

  public static rads(deg:number):number
  {
    return deg*Math.PI/180;
  }

  public static degs(rads:number):number
  {
    return rads*Math.PI/180;
  }

  
};
