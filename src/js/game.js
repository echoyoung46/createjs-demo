var carGame = {
  stage: new createjs.Stage('gameView'),
  container: new createjs.Container(),
  cvsWidth: 0,
  cvsHeight: 0,
  bgSpeed: 4,
  imgSpeed: 8,
  time: 1200,
  initRed: 0,
  image1: new createjs.Bitmap('./src/img/bg.png'),
  image2: new createjs.Bitmap('./src/img/bg.png'),
  init: function () {
    this.cvsWidth = this.stage.canvas.width;
    this.cvsHeight = this.stage.canvas.height;
    this.initStage();
  },
  initStage: function() {
    this.image1.y = 0;
    this.image2.y = -this.cvsHeight;
    
    this.car = new createjs.Bitmap('./src/img/player.png');
    this.car.x = 315;
    this.car.y = 940;
    this.carWidth = this.car.image.width;
    this.carHeight = this.car.image.height;

    var roadHtml = document.createElement('div');
    roadHtml.id = 'road';
    document.body.appendChild(roadHtml);
    var roadDom = new createjs.DOMElement(roadHtml);

    var self = this;
    this.queue = new createjs.LoadQueue();
    this.queue.loadManifest(
      {id: 'boom', src: './src/mp3/boom.mp3'},
      {id: 'bgm', src: './src/mp3/victory.mp3'},
      {id: 'bg', src: './src/img/bg.png'}
    );

    this.queue.addEventListener('complete', function() {
      self.container.addChild(self.image1);
      self.container.addChild(self.image2);
      self.container.addChild(self.car);
      self.container.addChild(self.roadDom);
      self.stage.addChild(self.container);
      self.stage.update();

      createjs.Ticker.addEventListener('tick', function() {
        self.handleTick();
        self.stage.update();
      });
      createjs.Ticker.setFPS(60);
    });

    self.moveCar();
  },
  handleTick: function() {
    this.image1.y += this.bgSpeed;
    this.image2.y += this.bgSpeed;
    
    if (Math.abs(this.image1.y) >= this.cvsHeight) {
      this.image1.y = 0;
      this.image2.y = -this.cvsHeight;
    }
  },
  moveCar: function() {
    var self = this;
    var roadDom = document.getElementById('road');
    console.log(roadDom.offsetLeft);

  }
};

window.onload = function () {
  carGame.init();
}