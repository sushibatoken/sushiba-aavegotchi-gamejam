import 'phaser';
import config from '../Config/config';
import Button from '../Objects/Button';

export default class EndGameScene extends Phaser.Scene {
  constructor () {
    super('endGame');
  }

  create () {
    
    this.titleText = this.add.text(0, 0, 'Congratulations on Finishing the Game!', { fontSize: '32px', fill: '#fff' });
    this.storyText = this.add.text(config.width/2, config.height/2, '\n\n\n You just helped unite Human Beings with Blockchain and AI! \n\n\n A big Thank You to Moralis for sponsoring the event \n\n\n and to Aavegotchi for having hosted the event! \n\n\n You can visit the official website of Sushiba \n\n\n to learn more about Blockchain and AI!',
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
        this.scene.start('Credits');
      }.bind(this)
    });
  }
};