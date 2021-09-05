import 'phaser';
import Button from '../Objects/Button';

export default class HowToScene extends Phaser.Scene {
  constructor () {
    super('HowTo');
  }

  preload () {
    this.load.image('jumpIncrease', '../../assets/Objects/JumpIncrease.png');
    this.load.image('jumpDecrease', '../../assets/Objects/JumpDecrease.png');
    this.load.image('unlock', '../../assets/Objects/unlock.png');
    this.load.image('teleport', '../../assets/Objects/teleport.png');
  }

  create () {

    this.text = this.add.text(580, 100, 'How to Play', { fontSize: 40 });

    this.image = this.add.image(440, 300, 'jumpIncrease')
    this.text = this.add.text(380, 350, 'Powerups', { fontSize: 25 });
    this.image = this.add.image(620, 300, 'jumpDecrease')
    this.text = this.add.text(540, 350, 'Powerdowns', { fontSize: 25 });
    this.image = this.add.image(800, 300, 'teleport')
    this.text = this.add.text(730, 350, 'Teleports', { fontSize: 25 });
    this.image = this.add.image(980, 300, 'unlock')
    this.text = this.add.text(900, 350, 'Unlockables', { fontSize: 25 });
    
    this.menuButton = new Button(this, 720, 500, 'blueButton1', 'blueButton2', 'Menu', 'Title');

  }
};
