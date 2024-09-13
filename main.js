import './style.css'
import Phaser from 'phaser'

const sizes ={
  width: 500,
  height: 500
}

const config = {
  type: Phaser.WEBGL,
  width: 500,
  height: 500,
  canvas:gameCanvas
}

const game = new Phaser.Game(config);