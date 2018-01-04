var carGame = {
  stage: new createjs.Stage('gameView'),
  container: new createjs.Container(),
  cvsWidth: 0,
  cvsHeight: 0,
  bgSpeed: 4,
  imgSpeed: 8,
  time: 1200,
  initRed: 0,
  queue: null,
  redText: null,
  tempImgArray: [],
  tempRedArray: [],
  image1: new createjs.Bitmap('./src/img/bg.png'),
  image2: new createjs.Bitmap('./src/img/bg.png'),
  init: function () {
    this.cvsWidth = this.stage.canvas.width;
    this.cvsHeight = this.stage.canvas.height;
    this.initStage();
  },
  initStage: function () {
    createjs.Touch.enable(this.stage);
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

    var redBitmap = new createjs.Bitmap('./src/img/red.png');
    var boomBitmap = new createjs.Bitmap('./src/img/boom.png');
    this.tempImgArray.push(redBitmap, boomBitmap);

    this.redText = new createjs.Text("已抢到红包个数：" + this.initRed, "28px Arial", "#ff7700");
    this.redText.x = 50;
    this.redText.y = 10;

    var self = this;
    this.queue = new createjs.LoadQueue();
    this.queue.loadManifest({
      id: 'boom',
      src: './src/mp3/boom.mp3'
    }, {
      id: 'bgm',
      src: './src/mp3/victory.mp3'
    }, {
      id: 'bg',
      src: './src/img/bg.png'
    });

    this.queue.addEventListener('complete', function () {
      self.container.addChild(self.image1);
      self.container.addChild(self.image2);
      self.container.addChild(self.car);
      self.container.addChild(self.roadDom);
      self.container.addChild(self.redText);
      self.stage.addChild(self.container);
      self.stage.update();

      self.createImg();

      createjs.Ticker.addEventListener('tick', function () {
        self.handleTick();
        self.stage.update();
      });
      createjs.Ticker.setFPS(60);
    });

    self.moveCar();
  },
  handleTick: function () {
    this.image1.y += this.bgSpeed;
    this.image2.y += this.bgSpeed;

    if (Math.abs(this.image1.y) >= this.cvsHeight) {
      this.image1.y = 0;
      this.image2.y = -this.cvsHeight;
    }
  },
  moveCar: function () {
    var self = this;
    var roadDom = document.getElementById('road');
    var minX = Math.ceil(roadDom.offsetLeft * (750 / document.body.clientWidth));
    var maxX = minX * 3;
    var minY = 1200;

    self.car.on("pressmove", function (evt) {
      //判断是否拖出了左右上下范围
      if (evt.stageX - self.car.getBounds().width / 2 < minX || evt.stageX + self.car.getBounds().width / 2 > maxX || evt.stageY < self.car.getBounds().height / 2 || evt.stageY > minY - self.car.getBounds().height / 2) {
        return;
      }
      evt.currentTarget.x = evt.stageX - 51;
      evt.currentTarget.y = evt.stageY - 108;
      // console.log(evt.currentTarget.x);
    });
  },
  createImg: function () {
    var roadDom = document.getElementById('road');
    var minX = Math.ceil(roadDom.offsetLeft * (750 / document.body.clientWidth));
    var maxX = minX * 3;
    var step = parseInt((maxX - minX) / 4);
    var index = Math.round(Math.random());
    var red = this.tempImgArray[index].clone();

    red.x = minX + Math.random() * 3 * step;
    red.y = -150;

    this.container.addChild(red);

    var self = this;
    createjs.Tween.get(red).to({
      y: self.cvsHeight
    }, 2500).addEventListener('change', function () {
      self.handleImg(red);
      if (red.y >= self.cvsHeight) {
        self.createImg();
      }
    });
  },
  arrAyUnique: function (arr) {//数组去重
    arr.sort(function (a, b) {
        return a - b;
    });
    var result = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        if (arr[i] !== result[result.length - 1]) {
            result.push(arr[i]);
        }
    }
    return result;
},
  handleImg: function (obj) {
    var pt = obj.localToLocal(Math.random() * 100, Math.random() * 100, this.car);

    if (this.car.hitTest(pt.x, pt.y)) {
      if (/red.png/.test(obj.image.src)) {
        this.tempRedArray.push(obj.id);
        var temp = this.arrAyUnique(this.tempRedArray);
        this.initRed = temp.length;
        this.redText.text = "已抢到红包个数：" + this.initRed;

      } else {
        this.container.removeChild(obj);
        createjs.Sound.play("sound");
        createjs.Sound.removeSound("victory");
        alert("GAME OVER!");
        createjs.Sound.stop(); //停止背景音乐播放
        createjs.Ticker.removeAllEventListeners();
      }
    }
  }
};

window.onload = function () {
  carGame.init();
}