import 'phaser';

var platforms;
var player;
var cursors;

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');

  }  

  async preload ()
  {
    this.load.image('background', '../../assets/BG.png');
    this.load.image('ground', '../../assets/Tiles/Tile (2).png');
    this.load.image('ground-right', '../../assets/Tiles/Tile (3).png');
    this.load.image('competitor', '../../assets/player.png');

    // fetch player SVG
    const numericTraits = [1, 5, 99, 29, 1, 1]; // UI to change the traits
    const equippedWearables = [82,8,4,4,4,5,7,1,0,1,1,3,7,0,0,0];

    const rawSVG = await Moralis.Cloud.run("getSVG",{numericTraits:numericTraits,equippedWearables:equippedWearables})
    
    const svgBlob = new Blob([rawSVG], {type:"image/svg+xml;charset=utf-8"})
    const url = URL.createObjectURL(svgBlob)
    
    this.load.image('player',url);

    this.load.on('filecomplete', function(){

      this.initPlayer();
    }, this);

    this.load.start()
  }

    async initPlayer(){
      player = this.physics.add.sprite(30, 540, "player").setScale(0.5).refreshBody();
      player.setBounce(0.3);
      this.physics.add.collider(player, platforms);
    }

  async create ()
  {
    this.add.image(700, 400, 'background').setScale(0.8);

    platforms = this.physics.add.staticGroup();

    platforms.create(30,690, "ground").setScale(0.5).refreshBody();
    platforms.create(95,690, "ground").setScale(0.5).refreshBody();
    platforms.create(160,690, "ground").setScale(0.5).refreshBody();
    platforms.create(225,690, "ground").setScale(0.5).refreshBody();
    platforms.create(290,690, "ground").setScale(0.5).refreshBody();
    platforms.create(355,690, "ground").setScale(0.5).refreshBody();
    platforms.create(420,690, "ground-right").setScale(0.5).refreshBody();
    
    cursors = this.input.keyboard.createCursorKeys()


  }

  // 60 times per second  - 60 frames per second
  update()
  {
    if(!player)
    return;

  // LOGIC
  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);
  }
  else
  {
      player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-300);
  }
    

  }
};

