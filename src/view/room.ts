import Konva from  "konva";
import Room from "../model/room";
import { Util } from "../util";

export default class extends Konva.Group {
  _room:Room = null;
  _roomRect:Konva.Rect = null;

  public get room():Room { return this._room;}
  public set room(r:Room) { 
    this._room = r;
    this.redraw();
  }

  redraw():void
  {
    if(this._roomRect) this._roomRect.destroy();
    this._roomRect = new Konva.Rect({
      width: Util.mmToPx(this._room.widthMM),
      height: Util.mmToPx(this._room.depthMM),
      fill: "#EEE",
      stroke: "black",
      strokeWidth: 1,
    });
    this.add(this._roomRect);
   }

}
