import "./style.css"
import Phaser from 'phaser'
const sizes ={
  width: 500,
  height: 500
}

const speedDown = 150;

class GameScene extends Phaser.Scene{
  constructor(){
    super("scene-game")
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50
    this.target;
    this.points = 0;
    this.textscore
    this.textTime;
    this.timedEvent
    this.remainingtime
    this.coinMusic
    this.bgMusic
    this.emitter
  }

  preload(){
    this.load.image("bg", "/assets/bg.png");
    this.load.image("basket", "/assets/basket.png"); // Fixed image path
    this.load.image("apple", "/assets/target.png");
    this.load.image("money","/assets/money.png");
    this.load.audio("coin", "/assets/gameover.mp3");
    this.load.audio("bigmusic", "/assets/bigmusic.mp3");
  }
  
  create(){

    this.coinMusic = this.sound.add("coin")
    this.bgMusic = this.sound.add("bigmusic")
    this.bgMusic.play()
    this.bgMusic.play()

  
    this.add.image(0, 0, "bg").setOrigin(0, 0)
    this.player = this.physics.add.image(0, sizes.height - 100, "basket").setOrigin(0, 0)
    this.player.setImmovable(true) // Fixed typo
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);
    this.player.setSize(80,15).setOffset(10,70)
    this.player.setSize(this.player.width-this.player.width/4, this.player.height/6).
    setOffset(this.player.width/10, this.player.height - this.player.height/10)
    
    this.target = this.physics.add.image(0,0,"apple").setOrigin(0,0);    
    this.target.setMaxVelocity(0,speedDown)
    this.physics.add.overlap(this.target,this.player,this.targethit,null,this)
    this.cursor = this.input.keyboard.createCursorKeys()

    this.textscore = this.add.text(sizes.width - 120,10, "Score:0",{
      font: "25px Arial",
      fill: "#000000",
    });
    this.textTime = this.add.text(10,10, "Remaining Time: 00",{
      font: "25px Arial",
      fill: "#000000",
    });

    this.timedevent = this.time.delayedCall(3000, this.gameover, [], this);

    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown-200,
      scale:0.04,
      duration:100,
      emitting:false
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
  }
  
  update() {
    this.remainingTime = this.timedevent.getRemainingSeconds();
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)
    if (this.target.y >= sizes.height){
      this.target.setY(0);
      this.target.setX(this.getRandomX())
    }
    
    const { left, right } = this.cursor; 

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed); // Fixed sign and typo
    } else {
      this.player.setVelocityX(0);
    }
  }
  getRandomX(){
    return Math.floor(Math.random() * 480);
  };

  targethit(){
    this.coinMusic.play()
    this.emitter.start()
    this.target.setY(0);
    this.target.setX(this.getRandomX())
    this.points++;
    this.textscore.setText('Score: ${this.points}')
  }

  gameover(){
    console.log("Game Over")
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics:{
    default:'arcade',
    arcade:{
      gravity:{y:speedDown},
      debug:true
    }
  },scene:[GameScene]
}

const game = new Phaser.Game(config);