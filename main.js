import "./style.css"
import Phaser from 'phaser'
const sizes ={
  width: 500,
  height: 500
}

const speedDown = 300;
const jellyfishSpeed = speedDown / 3; // Adjust this fraction as needed

const gameStartDiv = document.querySelector("#gameStartDiv")
const gameStartBtn = document.querySelector("#gameStartBtn")
const gameEndDiv = document.querySelector("#gameEndDiv")
const gamewinlosespan = document.querySelector("#gamewinlosespan")
const gameendscorespain = document.querySelector("#gameendscorespain")

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
    this.emitter
    this.jellyfish; // Add this line
    this.jellyfishSpeed = jellyfishSpeed;
    this.speedIncreaseInterval = 10000; // Increase speed every 10 seconds
    this.speedMultiplier = 1.1; // Increase speed by 10% each time
    this.baseScore = 1; // Base score for catching a jellyfish
  }

  preload(){
    this.load.image("bg", "/bg.png");
    this.load.image("fishnet", "/fishnet.png"); // Fixed image path
    this.load.image("jellyfish", "/jellyfish.png");
    console.log("Preload completed");
  }
  
  create(){
    console.log("Create method started");
  
    // Stretch the background image to fill the entire game area
    this.add.image(sizes.width / 2, sizes.height / 2, "bg")
      .setOrigin(0.5, 0.5)
      .setDisplaySize(sizes.width, sizes.height);

    // Adjust player position to be closer to the bottom
    this.player = this.physics.add.image(sizes.width / 2, sizes.height - 20, "fishnet");
    this.player.setOrigin(0.5, 1);
    this.player.setDisplaySize(100, 100);
    this.player.setImmovable(true);
    this.player.body.allowGravity = false;
    this.player.setCollideWorldBounds(true);

    // Extend the world bounds vertically
    this.physics.world.setBounds(0, -100, sizes.width, sizes.height + 200);

    // Modify the jellyfish creation
    this.jellyfish = this.physics.add.image(this.getRandomX(), 0, "jellyfish");
    this.jellyfish.setDisplaySize(50, 50); // Adjust size as needed
    this.jellyfish.setVelocityY(jellyfishSpeed);
    this.jellyfish.body.allowGravity = false; // Disable gravity for the jellyfish

    // Replace the existing target creation with this:
    this.target = this.jellyfish;
    this.physics.add.overlap(this.target, this.player, this.targethit, null, this);

    this.cursor = this.input.keyboard.createCursorKeys()

    this.textscore = this.add.text(sizes.width - 120,10, "Score:0",{
      font: "25px Arial",
      fill: "#000000",
    });
    this.textTime = this.add.text(10,10, "Remaining Time: 00",{
      font: "25px Arial",
      fill: "#000000",
    });

    this.timedevent = this.time.delayedCall(30000, this.gameover, [], this);

    this.emitter = this.add.particles(0, 0, "money", {
      speed: 100,
      gravityY: speedDown-200,
      scale:0.04,
      duration:100,
      emitting:false
    });
    this.emitter.startFollow(this.player, this.player.width / 2, this.player.height / 2, true);
    console.log("Create method completed");
  }
  
  update() {
    console.log("Update running");
    this.remainingTime = this.timedevent.getRemainingSeconds();
    this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)
    if (this.jellyfish.y >= sizes.height) {
      this.resetJellyfish();
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
  
  resetJellyfish() {
    this.jellyfish.setY(0);
    this.jellyfish.setX(this.getRandomX());
    this.jellyfish.setVelocityY(jellyfishSpeed);
  }

  targethit(){
    this.emitter.start();
    this.resetJellyfish();
    
    // Calculate score based on current speed
    const scoreIncrease = Math.round(this.baseScore * (this.jellyfishSpeed / jellyfishSpeed));
    this.points += scoreIncrease;
    
    this.textscore.setText(`Score: ${this.points}`);
    
    // Use true for isScoreText parameter to get seaweed green color
    this.showFloatingText(`+${scoreIncrease}`, this.player.x, this.player.y - 50, true);
  }

  showFloatingText(message, x, y, isScoreText = true) {
    const textColor = isScoreText ? '#97ed3c' : '#ffffff'; // Need to workshop this color, not quite seaweed green
    const text = this.add.text(x, y, message, {
      font: '24px Arial',
      fill: textColor
    }).setOrigin(0.5);

    this.tweens.add({
      targets: text,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => text.destroy()
    });
  }

  increaseSpeed() {
    this.jellyfishSpeed *= this.speedMultiplier;
    this.jellyfish.setVelocityY(this.jellyfishSpeed);
    console.log("Jellyfish speed increased to:", this.jellyfishSpeed);

    // Use false for isScoreText parameter to keep "Speed Up!" white
    this.showFloatingText('Speed Up!', sizes.width / 2, sizes.height / 2, false);

    this.tweens.add({
      targets: this.jellyfish,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      repeat: 1
    });
  }

  gameover(){
    this.sys.game.destroy(true)
    if(this.remainingtime == 0){
      "Game Over!"
    }

    gameEndDiv.style.display = "flex"
  }

  getRandomX() {
    return Math.random() * (sizes.width - 50);
  }
}

const DEBUG_PHYSICS = false;  // Set this to false to turn off debug lines

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: DEBUG_PHYSICS
    }
  },
  scene: [GameScene]
}

const game = new Phaser.Game(config);

gameStartBtn.addEventListener("click", () => {
  console.log("Start button clicked");
  gameStartDiv.style.display = "none";
  game.scene.resume("scene-game");
  console.log("Scene resumed");
});

// Start the scene immediately
game.scene.start("scene-game");
console.log("Scene started");