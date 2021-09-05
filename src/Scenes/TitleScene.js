import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

var background;
var stargroup;

export default class TitleScene extends Phaser.Scene {
  constructor () {
    super('Title');
  }

  preload() {
    this.load.image('background', '../../assets/BG/background.jpg');
    this.load.image('stargroup', '../../assets/stargroup1.PNG');
    this.load.atlas('ava', '../../assets/alfredgotchi.png', '../../assets/ui/ava.json');
    this.load.atlas('sushiba', '../../assets/sushiba.PNG', '../../assets/ui/sushiba.json'); 
  }

  create () {

    this.add.image(700, 400, 'background').setScale(0.25);
    stargroup = this.add.tileSprite(700, 350, 1600, 780, "stargroup").setScale(0.9);

    this.anims.create({
        key: "fly",
        frameRate: 7,
        frames: this.anims.generateFrameNames("ava", {
            prefix: "alfredgotchi",
            suffix: ".png",
            start: 1,
            end: 3,
            zeroPad: 1
        }),
        repeat: -1
    });

    this.anims.create({
        key: "walk",
        frameRate: 7,
        frames: this.anims.generateFrameNames("sushiba", {
            prefix: "sushiba",
            suffix: ".PNG",
            start: 1,
            end: 3,
            zeroPad: 1
        }),
        repeat: -1
    });

    const ava = this.add.sprite(520, 560, "ava").setScale(0.5);
    ava.play("fly");

    const sushiba = this.add.sprite(640, 560, "sushiba").setScale(0.08);
    sushiba.play("walk");


    // Game
    this.gameButton = new Button(this, config.width/2, config.height/2 - 200, 'blueButton1', 'blueButton2', 'Play', 'Story');

    // How to Play
    this.optionsButton = new Button(this, config.width/2, config.height/2 -100, 'blueButton1', 'blueButton2', 'How To', 'HowTo');
 
    // Options
    this.optionsButton = new Button(this, config.width/2, config.height/2, 'blueButton1', 'blueButton2', 'Options', 'Options');

    // Credits
    this.creditsButton = new Button(this, config.width/2, config.height/2 + 100, 'blueButton1', 'blueButton2', 'Credits', 'Credits');

    this.model = this.sys.game.globals.model;
    if (this.model.musicOn === true && this.model.bgMusicPlaying === false) {
      this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });
      this.bgMusic.play();
      this.model.bgMusicPlaying = true;
      this.sys.game.globals.bgMusic = this.bgMusic;
    }
  }

  centerButton (gameObject, offset = 0) {
    Phaser.Display.Align.In.Center(
      gameObject,
      this.add.zone(config.width/2, config.height/2 - offset * 100, config.width, config.height)
    );
  }

  centerButtonText (gameText, gameButton) {
    Phaser.Display.Align.In.Center(
      gameText,
      gameButton
    );
  }

  update() {
    stargroup.tilePositionX += 0.3;
}
};
