import Konva from  "konva";
export default class extends Konva.Layer {

  tx: Konva.Transformer;

  select(img:Konva.Image)
  {
    if(img === null) this.tx.nodes([]);
    else this.tx.nodes([img]);
  }

  constructor()
  {
    super();
    this.tx = new Konva.Transformer();
    this.add(this.tx);

    window.addEventListener("keyup", (event) =>{
      if(event.code == "Delete")
      {
        var sel = this.tx.nodes();
        (sel).forEach(element => {
          element.destroy();
        });
        this.tx.nodes([]);
      }
    });

    var img = new Image();
    img.onload = () =>
    {
      this.add(new Konva.Image({
        x: 400,
        y: 500,
        width: 1920/4,
        height: 880/ 4,
        image: img,
        draggable: true,
      }));
    };
    img.src = "./confroom.png";

   
  }

  addImageWithFile(file:File)
  {
    var img = new Image();
    img.onload = () =>
    {
      this.add(new Konva.Image({
        x: 0,
        y: 0,
        image: img,
        draggable: true,
      }));
    };
    img.src = URL.createObjectURL(file);
  }
}