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

    // Looad the tileset
    this.load.image('tiles', '../../assets/Tilesets/platformPack_tilesheet.png');
    
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map', '../../assets/Tilemaps/map.json');


    // fetch player SVG
    const numericTraits = [1, 5, 99, 29, 1, 1]; // UI to change the traits
    const equippedWearables = [82,8,4,4,4,5,7,1,0,1,1,3,7,0,0,0];

    const rawSVG = await Moralis.Cloud.run("getSVG",{numericTraits:numericTraits,equippedWearables:equippedWearables})
    const svg = rawSVG.replace("<style>", "<style>.gotchi-bg,.wearable-bg{display: none}");
    const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"})
    const url = URL.createObjectURL(svgBlob)
    
    this.load.image('player',url);

    this.load.on('filecomplete', function(){

      this.initPlayer();
    }, this);

    this.load.start()
  }

    async initPlayer(){
      player = this.physics.add.sprite(30, 250, "player").setScale(0.5).refreshBody();
      player.setBounce(0.3);
      this.physics.add.collider(player, platforms);
      // Camera movements go here
      this.cameras.main.startFollow(player)
    }

  create ()
  {
    // Set Background
    this.add.image(700, 400, 'background').setScale(0.8);

    // The key matches the name given in the preload function when we loaded the Tiled JSON
    const map = this.make.tilemap({ key: 'map' });

    //  The first argument of addTilesetImage is the name of the tileset we used in Tiled. 
    // The second argument is the key of the image we loaded in the preload function.
    const tileset = map.addTilesetImage('platformPack_tilesheet', 'tiles');

    // Add platform layer
    platforms = map.createLayer('Platform', tileset, 0, 200);
    
    // Every tile in our map was given an index by Tiled to reference what should be shown there. 
    // An index of our platform can only be greater than 0. setCollisionByExclusion tells Phaser to 
    // enable collisions for every tile whose index isn't -1, therefore, all tiles
    platforms.setCollisionByExclusion(-1, true);
    
    // Set cursor Movement
    this.cursors = this.input.keyboard.createCursorKeys()
  }

  // 60 times per second  - 60 frames per second
  update()
  {
    if(!player)
    return;

  // LOGIC
      if (this.cursors.left.isDown)
        {
            player.setVelocityX(-160);
        }
      else if (this.cursors.right.isDown)
        {
            player.setVelocityX(200);
        }
      else
        {
            player.setVelocityX(0);
        }

      // Important change
      if ((this.cursors.space.isDown || this.cursors.up.isDown) && player.body.onFloor()) 
        {
            player.setVelocityY(-300);
        }
  }
};

