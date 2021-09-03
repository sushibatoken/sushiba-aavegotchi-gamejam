import 'phaser';
import config from '../Config/config';

export default class StoryScene extends Phaser.Scene {
  constructor () {
    super('Story');
  }

  create () {
    this.titleText = this.add.text(0, 0, 'One Blockchain to Rule them All', { fontSize: '32px', fill: '#fff' });
    this.storyText = this.add.text(config.width/2, config.height/2, '\n\nIn the far distant future \n\n\n Blockchain took over the world. \n\n\n Human beings are no longer inhabitants of Earth. \n\n\n Their consciousness has been uploaded to the Blockchain \n\n\n They took the form of Aavegotchis. \n\n\n They now reside in the empty vacuum of space \n\n\nwandering around platforms in search of a purpose.',
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

    this.storyText.setY(1000);

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
      y: -300,
      ease: 'Power1',
      duration: 8000,
      delay: 1000,
      onComplete: function () {
        this.madeByTween.destroy;
        this.scene.start('Game');
      }.bind(this)
    });
  }
};