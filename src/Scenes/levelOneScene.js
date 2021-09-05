import 'phaser';

var platforms;
var player;
var playerStartX = 1000;
var playerStartY = 820;
var cursors;
var playerSpeedLeft = -200;
var playerSpeedRight = 200;
var playerJump = -300;
var powerUpCoordinates;
var powerDownCoordinates;
var unlockElementCoordinates;
var teleportCoordinates;

function playerHit(player, spike) {
  this.playerHitSound.play()
  player.setVelocity(0, 0);
  player.setX(playerStartX);
  player.setY(playerStartY);

  // reset collisions
  playerJump = -300
  this.jumpIncreases.setX(powerUpCoordinates[0])
  this.jumpIncreases.setAlpha(1);
  this.jumpDecreases.setX(powerDownCoordinates[0])
  this.jumpDecreases.setAlpha(1);
  this.unlockElement.setX(unlockElementCoordinates[0])
  this.unlockElement.setAlpha(1);
  this.teleport.setX(teleportCoordinates[0])
  this.teleport.setAlpha(1);

  player.play('idle', true);
  player.setAlpha(0);
  let tw = this.tweens.add({
    targets: player,
    alpha: 1,
    duration: 100,
    ease: 'Linear',
    repeat: 5,
  });
}

function increaseJump(player, powerup) {
  this.powerUpSound.play()
  playerJump -= 100;
  powerup.setX(-10000)
  powerup.setAlpha(0);
}

function nextLevel (player, platform) {
  this.nextLevelSound.play()
  this.scene.start('LevelTwo');
}

function decreaseJump(player, powerdown) {
  this.powerDownSound.play()
  playerJump += 250;
  powerdown.setX(-10000)
  powerdown.setAlpha(0);
}


function teleportPlayer(player, powerup) {
  this.teleportSound.play()
    powerup.setX(-10000)
    powerup.setAlpha(0);
    player.setVelocity(0, 0);
    player.setX(playerStartX);
    player.setY(playerStartY);
}

function collide(one, two) {
  // Just Collide
}

export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');

  }  

  async preload ()
  {
    this.load.image('background-1', '../../assets/BG/background3.jpg');

    // Load sound
    this.load.audio("powerUpSound", "../../assets/Sound/success.mp3")
    this.load.audio("playerHitSound", "../../assets/Sound/oops.mp3")
    this.load.audio("teleportSound", "../../assets/Sound/sending.mp3")
    this.load.audio("powerDownSound", "../../assets/Sound/send.mp3")
    this.load.audio("nextLevelSound", "../../assets/Sound/aavegotchisprite.mp3")

    // Load the tileset
    this.load.image('tiles', '../../assets/Tilesets/space_tilesheet1.png');
    
    // Load the Spikes
    this.load.image('spike', '../../assets/Objects/spike.png');

    // Load the Powerups
    this.load.image('jumpIncrease', '../../assets/Objects/JumpIncrease.png');
    this.load.image('jumpDecrease', '../../assets/Objects/JumpDecrease.png');
    this.load.image('unlock', '../../assets/Objects/unlock.png');
    this.load.image('teleport', '../../assets/Objects/teleport.png');
    this.load.image('movingPlatform', '../../assets/Objects/movingPlatform.png');

    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map', '../../assets/Tilemaps/levelOne.json');


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
      player = this.physics.add.sprite(playerStartX, playerStartY, "player").setScale(0.5).refreshBody();
      player.setBounce(0.2);
      this.physics.add.collider(player, platforms);
      // Camera movements go here
      this.cameras.main.startFollow(player)
      // Collision with Spikes
      this.physics.add.collider(player, this.spikes, playerHit, null, this);
      // Collision with Powerups
      this.physics.add.collider(player, this.jumpIncreases, increaseJump, null, this);
      // Collision with Powerdowns
      this.physics.add.collider(player, this.jumpDecreases, decreaseJump, null, this);
      // Collision with Unlock
      this.physics.add.collider(player, this.unlockElement, nextLevel, null, this);
      // Collision with Moving Platform
      this.physics.add.collider(player, this.movingPlatform, collide, null, this);
      // Collision with Teleport
      this.physics.add.collider(player, this.teleport, teleportPlayer, null, this);
    }

  create ()
  {
    // Set Background
    this.add.image(700, 400, 'background-1').setScale(1.5);

    // create sound
    this.powerUpSound = this.sound.add("powerUpSound")
    this.playerHitSound = this.sound.add("playerHitSound")
    this.teleportSound = this.sound.add("teleportSound")
    this.powerDownSound = this.sound.add("powerDownSound")
    this.nextLevelSound = this.sound.add("nextLevelSound")

    // The key matches the name given in the preload function when we loaded the Tiled JSON
    const map = this.make.tilemap({ key: 'map' });

    // The first argument of addTilesetImage is the name of the tileset we used in Tiled. 
    // The second argument is the key of the image we loaded in the preload function.
    const tileset = map.addTilesetImage('space_tilesheet1', 'tiles');

    // Add platform layer
    platforms = map.createLayer('Platform', tileset, 0, 200);
    
    // Every tile in our map was given an index by Tiled to reference what should be shown there. 
    // An index of our platform can only be greater than 0. setCollisionByExclusion tells Phaser to 
    // enable collisions for every tile whose index isn't -1, therefore, all tiles
    platforms.setCollisionByExclusion(-1, true);
    
    // Set cursor Movement
    this.cursors = this.input.keyboard.createCursorKeys()

    // SPIKES

    // Create a sprite group for all spikes, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.spikes = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Let's get the spike objects, these are NOT sprites
    const spikeObjects = map.getObjectLayer('Spikes')['objects'];

    // Now we create spikes in our sprite group for each object in our map
    spikeObjects.forEach(spikeObject => {
    // Add new spikes to our sprite group, change the start y position to meet the platform
    const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0, 0);
    spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
  });

    // POWERUPS

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.jumpIncreases = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Let's get the spike objects, these are NOT sprites
    const jumpIncreaseObjects = map.getObjectLayer('Powerups')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    jumpIncreaseObjects.forEach(jumpIncreaseObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const jumpIncreasePowerup = this.jumpIncreases.create(jumpIncreaseObject.x, jumpIncreaseObject.y + 200 - jumpIncreaseObject.height, 'jumpIncrease').setOrigin(0, 0);
    jumpIncreasePowerup.body.setSize(jumpIncreasePowerup.width, jumpIncreasePowerup.height - 20).setOffset(0, 20);

    powerUpCoordinates = [jumpIncreaseObject.x, jumpIncreaseObject.y]
  });

      // POWERDOWNS

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.jumpDecreases = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Let's get the spike objects, these are NOT sprites
    const jumpDecreaseObjects = map.getObjectLayer('Powerdowns')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    jumpDecreaseObjects.forEach(jumpDecreaseObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const jumpDecreasePowerup = this.jumpDecreases.create(jumpDecreaseObject.x, jumpDecreaseObject.y + 200 - jumpDecreaseObject.height, 'jumpDecrease').setOrigin(0, 0);
    jumpDecreasePowerup.body.setSize(jumpDecreasePowerup.width, jumpDecreasePowerup.height - 20).setOffset(0, 20);

    powerDownCoordinates = [jumpDecreaseObject.x, jumpDecreaseObject.y]
  });

  // Unlock

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.unlockElement = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Let's get the spike objects, these are NOT sprites
    const unlockElementObjects = map.getObjectLayer('Unlock1')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    unlockElementObjects.forEach(unlockElementObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const unlockElementPowerup = this.unlockElement.create(unlockElementObject.x, unlockElementObject.y + 200 - unlockElementObject.height, 'unlock').setOrigin(0, 0);
    unlockElementPowerup.body.setSize(unlockElementPowerup.width, unlockElementPowerup.height - 20).setOffset(0, 20);

    unlockElementCoordinates = [unlockElementObject.x, unlockElementObject.y]
  });

  // Moving Platform

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.movingPlatform = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Let's get the spike objects, these are NOT sprites
    const movingPlatformObjects = map.getObjectLayer('MovingPlatform')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    movingPlatformObjects.forEach(movingPlatformObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const movingPlatformPowerup = this.movingPlatform.create(movingPlatformObject.x, movingPlatformObject.y + 200 - movingPlatformObject.height, 'movingPlatform').setOrigin(0, 0);
    movingPlatformPowerup.body.setSize(movingPlatformPowerup.width, movingPlatformPowerup.height - 20).setOffset(0, 20);
    

    this.tweens.timeline({
      targets: movingPlatformPowerup.body.velocity,
      loop: -1,
      tweens: [
        { x:    -100, y: 0, duration: 8000, ease: 'Stepped' },
        { x:    100, y: 0, duration: 8000, ease: 'Stepped' },
      ]
    });
  });

    // Teleport

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.teleport = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Let's get the spike objects, these are NOT sprites
    const teleportObjects = map.getObjectLayer('Teleport1')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    teleportObjects.forEach(teleportObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const teleportPowerup = this.teleport.create(teleportObject.x, teleportObject.y + 200 - teleportObject.height, 'teleport').setOrigin(0, 0);
    teleportPowerup.body.setSize(teleportPowerup.width, teleportPowerup.height - 20).setOffset(0, 20);
    

    teleportCoordinates = [teleportObject.x, teleportObject.y]
  });

  
}

  // 60 times per second  - 60 frames per second
  update()
  {
    if(!player)
    return;

  // LOGIC
      if (this.cursors.left.isDown)
        {
            player.setVelocityX(playerSpeedLeft);
        }
      else if (this.cursors.right.isDown)
        {
            player.setVelocityX(playerSpeedRight);
        }
      else
        {
            player.setVelocityX(0);
        }

      // Important change
      if ((this.cursors.space.isDown || this.cursors.up.isDown) && player.body.onFloor()) 
        {
            player.setVelocityY(playerJump);
        }
  } 
};

