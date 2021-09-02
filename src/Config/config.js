import 'phaser';

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: 1440,
  height: 726,
  physics: {
    default: 'arcade',
    arcade: {
        gravity: { y: 450 },
        debug: true
    }
},
};
