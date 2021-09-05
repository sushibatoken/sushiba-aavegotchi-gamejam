import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class StoryScene extends Phaser.Scene {
  constructor () {
    super('Story');
  }

  create () {
    // SKIP
    this.gameButton = new Button(this, 1300, 680, 'blueButton1', 'blueButton2', 'Skip', 'Game');
    
    this.titleText = this.add.text(0, 0, 'How Blockchain Took Over the World', { fontSize: '32px', fill: '#fff' });
    this.storyText = this.add.text(config.width/2, config.height/2, '\n\nIn the distant future Blockchain took over the world. \n\n\n Human beings\' consciousness has been uploaded to the Blockchain. \n\n\n Only three Entities Survived: \n\n\n 1. Aavegotchis, the form human beings turned into. \n\n\n 2. Moralis, those who govern the laws of Blockchain. \n\n\n 3. Sushiba, those who control the Blockchain AI.\n\n\n Humans, now Aavegotchis, reside in space wandering around platforms \n\n\n in hopes of reuniting with Moralis and Sushiba. \n\n\n\n\n\n\n\n',
       { fontSize: '26px', fill: '#fff' });
    this.zone = this.add.zone(config.width/2, config.height/2, config.width, config.height);

    Phaser.Display.Align.In.Center(
      this.titleText,
      this.zone
    );

    Phaser.Display.Align.In.Center(
      this.storyText,
      this.zone
    );

    this.storyText.setY(680);

    this.creditsTween = this.tweens.add({
      targets: this.titleText,
      y: -100,
      ease: 'Power1',
      duration: 3000,
      delay: 1000,
      onComplete: function () {
        this.destroy;
      }
    });

    this.madeByTween = this.tweens.add({
      targets: this.storyText,
      y: -100,
      duration: 15000,
      delay: 1000,
      onComplete: function () {
        this.madeByTween.destroy;
        this.scene.start('Game');
      }.bind(this)
    });
  }
};