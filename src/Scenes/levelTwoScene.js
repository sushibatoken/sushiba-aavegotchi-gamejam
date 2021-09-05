import 'phaser';

var platforms;
var player;
var playerStartX = 2550;
var playerStartY = 300;
var cursors;
var playerSpeedLeft = -200;
var playerSpeedRight = 200;
var playerJump = -300;
var powerUpCoordinates;
var powerUp2Coordinates;
var powerDownCoordinates;
var powerDown2Coordinates;
var unlockElementCoordinates;
var teleportCoordinates;
var teleport2Coordinates;
var teleport3Coordinates;

function playerHit(player, spike) {
  this.playerHitSound.play()
  player.setVelocity(0, 0);
  player.setX(playerStartX);
  player.setY(playerStartY);

  // reset collisions
  playerJump = -300

  this.jumpIncreases.setX(powerUpCoordinates[0])
  this.jumpIncreases.setAlpha(1);
  this.jumpIncreases2.setX(powerUp2Coordinates[0])
  this.jumpIncreases2.setAlpha(1);

  this.jumpDecreases.setX(powerDownCoordinates[0])
  this.jumpDecreases.setAlpha(1);
  this.jumpDecreases2.setX(powerDown2Coordinates[0])
  this.jumpDecreases2.setAlpha(1);
  
  this.unlockElement.setX(unlockElementCoordinates[0])
  this.unlockElement.setAlpha(1);

  this.teleport.setX(teleportCoordinates[0])
  this.teleport.setAlpha(1);
  this.teleport2.setX(teleport2Coordinates[0])
  this.teleport2.setAlpha(1);
  this.teleport3.setX(teleport3Coordinates[0])
  this.teleport3.setAlpha(1);

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
  playerJump -= 150;
  powerup.setX(-10000)
  powerup.setAlpha(0);
}

function resetJump(player, powerup) {
  this.powerUpSound.play()
  playerJump = -300;
  powerup.setX(-10000)
  powerup.setAlpha(0);
}

function nextLevel (player, platform) {
  this.nextLevelSound.play()
  this.scene.start('endGame');
}

function decreaseJump(player, powerdown) {
  this.powerDownSound.play()
  playerJump += 250;
  powerdown.setX(-10000)
  powerdown.setAlpha(0);
}

function collide(one,two) {
  // Just Collide
}

function teleportPlayer(player, powerup) {
  this.teleportSound.play()
    powerup.setX(-10000)
    powerup.setAlpha(0);
    player.setVelocity(0, 0);
    player.setX(2050);
    player.setY(1000);
}

function teleportPlayer2(player, powerup) {
  this.teleportSound.play()
    powerup.setX(-10000)
    powerup.setAlpha(0);
    player.setVelocity(0, 0);
    player.setX(4800);
    player.setY(300);
}

function teleportPlayer3(player, powerup) {
  this.teleportSound.play()
    powerup.setX(-10000)
    powerup.setAlpha(0);
    player.setVelocity(0, 0);
    player.setX(2700);
    player.setY(800);
}

export default class levelTwoScene extends Phaser.Scene {
  constructor () {
    super('LevelTwo');

  }  

  async preload ()
  {
    // Load static assets
    this.load.image('background-2', '../../assets/BG/background2.jpg');
    this.load.image("sushiba-1", "../../assets/logo_sushiba.png")
    this.load.image("moralis", "../../assets/Moralis-Glass-Favicon.svg")

    // Load sound
    this.load.audio("powerUpSound", "../../assets/Sound/success.mp3")
    this.load.audio("playerHitSound", "../../assets/Sound/oops.mp3")
    this.load.audio("teleportSound", "../../assets/Sound/sending.mp3")
    this.load.audio("powerDownSound", "../../assets/Sound/send.mp3")
    this.load.audio("nextLevelSound", "../../assets/Sound/aavegotchisprite.mp3")

    // Load the tileset
    this.load.image('tiles-1', '../../assets/Tilesets/space_tilesheet1.png');
    
    // Load the Spikes
    this.load.image('spike', '../../assets/Objects/spike.png');

    // Load the Powerups
    this.load.image('jumpIncrease', '../../assets/Objects/JumpIncrease.png');
    this.load.image('jumpIncrease2', '../../assets/Objects/JumpIncrease.png');
    this.load.image('jumpDecrease', '../../assets/Objects/JumpDecrease.png');
    this.load.image('jumpDecrease2', '../../assets/Objects/JumpDecrease.png');
    this.load.image('unlock', '../../assets/Objects/unlock.png');
    this.load.image('teleport', '../../assets/Objects/teleport.png');
    this.load.image('teleport2', '../../assets/Objects/teleport.png');
    this.load.image('teleport3', '../../assets/Objects/teleport.png');
    this.load.image('movingPlatform', '../../assets/Objects/movingPlatform.png');
    this.load.image('movingPlatform2', '../../assets/Objects/movingPlatform.png');
    this.load.image('movingPlatform3', '../../assets/Objects/movingPlatform.png');
    this.load.image('movingPlatform4', '../../assets/Objects/movingPlatform.png');

    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map-2', '../../assets/Tilemaps/levelTwo.json');


    // fetch player SVG
    const numericTraits = [1, 5, 99, 29, 1, 1]; // UI to change the traits
    const equippedWearables = [82,8,4,4,4,5,7,1,0,1,1,3,7,0,0,0];

    const rawSVG = await Moralis.Cloud.run("getSVG",{numericTraits:numericTraits,equippedWearables:equippedWearables})
    const svg = rawSVG.replace("<style>", "<style>.gotchi-bg,.wearable-bg{display: none}");
    const svgBlob = new Blob([svg], {type:"image/svg+xml;charset=utf-8"})
    const url = URL.createObjectURL(svgBlob)
    
    this.load.image('player-2',url);

    this.load.on('filecomplete', function(){

      this.initPlayer();
    }, this);

    this.load.start()
  }

    async initPlayer(){
      player = this.physics.add.sprite(playerStartX, playerStartY, "player-2").setScale(0.5).refreshBody();
      player.setBounce(0.2);
      this.physics.add.collider(player, platforms);
      // Camera movements go here
      this.cameras.main.startFollow(player)

      // Collision with Spikes
      this.physics.add.collider(player, this.spikes, playerHit, null, this);

      // Collision with Powerups
      this.physics.add.collider(player, this.jumpIncreases, resetJump, null, this);
      this.physics.add.collider(player, this.jumpIncreases2, increaseJump, null, this);
      
      // Collision with Powerdowns
      this.physics.add.collider(player, this.jumpDecreases, decreaseJump, null, this);
      this.physics.add.collider(player, this.jumpDecreases2, decreaseJump, null, this);

      // Collision with Unlock
      this.physics.add.collider(player, this.unlockElement, nextLevel, null, this);

      // Collision with Moving Platform
      this.physics.add.collider(player, this.movingPlatform, collide, null, this);
      this.physics.add.collider(player, this.movingPlatform2, collide, null, this);
      this.physics.add.collider(player, this.movingPlatform3, collide, null, this);
      this.physics.add.collider(player, this.movingPlatform4, collide, null, this);

      // Collision with Teleport
      this.physics.add.collider(player, this.teleport, teleportPlayer, null, this);
      this.physics.add.collider(player, this.teleport2, teleportPlayer2, null, this);
      this.physics.add.collider(player, this.teleport3, teleportPlayer3, null, this);

    }

  create ()
  {
    // Set Background
    this.add.image(700, 400, 'background-2').setScale(1.5);

    // Set Static Images
    this.add.image(2700, 750, "sushiba-1").setScale(0.8);
    this.add.image(2400, 750, "moralis").setScale(0.2);

    // create sound
    this.powerUpSound = this.sound.add("powerUpSound")
    this.playerHitSound = this.sound.add("playerHitSound")
    this.teleportSound = this.sound.add("teleportSound")
    this.powerDownSound = this.sound.add("powerDownSound")
    this.nextLevelSound = this.sound.add("nextLevelSound")

    // The key matches the name given in the preload function when we loaded the Tiled JSON
    const map = this.make.tilemap({ key: 'map-2' });

    // The first argument of addTilesetImage is the name of the tileset we used in Tiled. 
    // The second argument is the key of the image we loaded in the preload function.
    const tileset = map.addTilesetImage('space_tilesheet1', 'tiles-1');

    // Add platform layer
    platforms = map.createLayer('Platform1', tileset, 0, 200);
    
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
    const spikeObjects = map.getObjectLayer('Spikes1')['objects'];

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
    const jumpIncreaseObjects = map.getObjectLayer('Powerups1')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    jumpIncreaseObjects.forEach(jumpIncreaseObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const jumpIncreasePowerup = this.jumpIncreases.create(jumpIncreaseObject.x, jumpIncreaseObject.y + 200 - jumpIncreaseObject.height, 'jumpIncrease').setOrigin(0, 0);
    jumpIncreasePowerup.body.setSize(jumpIncreasePowerup.width, jumpIncreasePowerup.height - 20).setOffset(0, 20);

    powerUpCoordinates = [jumpIncreaseObject.x, jumpIncreaseObject.y]
  });

  this.jumpIncreases2 = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  // Let's get the spike objects, these are NOT sprites
  const jumpIncrease2Objects = map.getObjectLayer('Powerups2')['objects'];

  // Now we create powerups in our sprite group for each object in our map
  jumpIncrease2Objects.forEach(jumpIncrease2Object => {

  // Add new powerups to our sprite group, change the start y position to meet the platform
  const jumpIncrease2Powerup = this.jumpIncreases2.create(jumpIncrease2Object.x, jumpIncrease2Object.y + 200 - jumpIncrease2Object.height, 'jumpIncrease2').setOrigin(0, 0);
  jumpIncrease2Powerup.body.setSize(jumpIncrease2Powerup.width, jumpIncrease2Powerup.height - 20).setOffset(0, 20);

  powerUp2Coordinates = [jumpIncrease2Object.x, jumpIncrease2Object.y]
});

    // POWERDOWNS

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.jumpDecreases = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Let's get the spike objects, these are NOT sprites
    const jumpDecreaseObjects = map.getObjectLayer('Powerdowns1')['objects'];
 
    // Now we create powerups in our sprite group for each object in our map
    jumpDecreaseObjects.forEach(jumpDecreaseObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const jumpDecreasePowerup = this.jumpDecreases.create(jumpDecreaseObject.x, jumpDecreaseObject.y + 200 - jumpDecreaseObject.height, 'jumpDecrease').setOrigin(0, 0);
    jumpDecreasePowerup.body.setSize(jumpDecreasePowerup.width, jumpDecreasePowerup.height - 20).setOffset(0, 20);

    powerDownCoordinates = [jumpDecreaseObject.x, jumpDecreaseObject.y]
  });

  this.jumpDecreases2 = this.physics.add.group({
    allowGravity: false,
    immovable: true
  });

  // Let's get the spike objects, these are NOT sprites
  const jumpDecrease2Objects = map.getObjectLayer('Powerdowns2')['objects'];

  // Now we create powerups in our sprite group for each object in our map
  jumpDecrease2Objects.forEach(jumpDecrease2Object => {

  // Add new powerups to our sprite group, change the start y position to meet the platform
  const jumpDecrease2Powerup = this.jumpDecreases2.create(jumpDecrease2Object.x, jumpDecrease2Object.y + 200 - jumpDecrease2Object.height, 'jumpDecrease2').setOrigin(0, 0);
  jumpDecrease2Powerup.body.setSize(jumpDecrease2Powerup.width, jumpDecrease2Powerup.height - 20).setOffset(0, 20);

  powerDown2Coordinates = [jumpDecrease2Object.x, jumpDecrease2Object.y]
});





  // Unlock

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.unlockElement = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    // Let's get the spike objects, these are NOT sprites
    const unlockElementObjects = map.getObjectLayer('Unlock')['objects'];

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
    const movingPlatformObjects = map.getObjectLayer('MovingPlatform1')['objects'];

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

  // Moving Platform 2

    // Create a sprite group for all jumpIncrease Objects, set common properties to ensure that
    // sprites in the group don't move via gravity or by player collisions
    this.movingPlatform2 = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });

    // Let's get the spike objects, these are NOT sprites
    const movingPlatform2Objects = map.getObjectLayer('MovingPlatform2')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    movingPlatform2Objects.forEach(movingPlatform2Object => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const movingPlatform2Powerup = this.movingPlatform2.create(movingPlatform2Object.x, movingPlatform2Object.y + 200 - movingPlatform2Object.height, 'movingPlatform2').setOrigin(0, 0);
    movingPlatform2Powerup.body.setSize(movingPlatform2Powerup.width, movingPlatform2Powerup.height - 20).setOffset(0, 20);

    this.tweens.timeline({
      targets: movingPlatform2Powerup.body.velocity,
      loop: -1,
      tweens: [
        { x:    0, y: -100, duration: 8000, ease: 'Stepped' },
        { x:    0, y: +100, duration: 8000, ease: 'Stepped' },
      ]
    });
  });

  this.movingPlatform3 = this.physics.add.group({
    allowGravity: false,
    immovable: true,
  });

  // Let's get the spike objects, these are NOT sprites
  const movingPlatform3Objects = map.getObjectLayer('MovingPlatform3')['objects'];

  // Now we create powerups in our sprite group for each object in our map
  movingPlatform3Objects.forEach(movingPlatform3Object => {

  // Add new powerups to our sprite group, change the start y position to meet the platform
  const movingPlatform3Powerup = this.movingPlatform3.create(movingPlatform3Object.x, movingPlatform3Object.y + 200 - movingPlatform3Object.height, 'movingPlatform3').setOrigin(0, 0);
  movingPlatform3Powerup.body.setSize(movingPlatform3Powerup.width, movingPlatform3Powerup.height - 20).setOffset(0, 20);
  
  this.tweens.timeline({
    targets: movingPlatform3Powerup.body.velocity,
    loop: -1,
    tweens: [
      { x:    0, y: -100, duration: 8000, ease: 'Stepped' },
      { x:    0, y: +100, duration: 8000, ease: 'Stepped' },
    ]
  });
});

this.movingPlatform4 = this.physics.add.group({
  allowGravity: false,
  immovable: true,
});

// Let's get the spike objects, these are NOT sprites
const movingPlatform4Objects = map.getObjectLayer('MovingPlatform4')['objects'];

// Now we create powerups in our sprite group for each object in our map
movingPlatform4Objects.forEach(movingPlatform4Object => {

// Add new powerups to our sprite group, change the start y position to meet the platform
const movingPlatform4Powerup = this.movingPlatform4.create(movingPlatform4Object.x, movingPlatform4Object.y + 200 - movingPlatform4Object.height, 'movingPlatform4').setOrigin(0, 0);
movingPlatform4Powerup.body.setSize(movingPlatform4Powerup.width, movingPlatform4Powerup.height - 20).setOffset(0, 20);

this.tweens.timeline({
  targets: movingPlatform4Powerup.body.velocity,
  loop: -1,
  tweens: [
    { x:    0, y: -100, duration: 4000, ease: 'Stepped' },
    { x:    0, y: +100, duration: 4000, ease: 'Stepped' },
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
    const teleportObjects = map.getObjectLayer('Teleport')['objects'];

    // Now we create powerups in our sprite group for each object in our map
    teleportObjects.forEach(teleportObject => {

    // Add new powerups to our sprite group, change the start y position to meet the platform
    const teleportPowerup = this.teleport.create(teleportObject.x, teleportObject.y + 200 - teleportObject.height, 'teleport').setOrigin(0, 0);
    teleportPowerup.body.setSize(teleportPowerup.width, teleportPowerup.height - 20).setOffset(0, 20);
    

    teleportCoordinates = [teleportObject.x, teleportObject.y]
  });

  this.teleport2 = this.physics.add.group({
    allowGravity: false,
    immovable: true,
  });

  // Let's get the spike objects, these are NOT sprites
  const teleport2Objects = map.getObjectLayer('Teleport2')['objects'];

  // Now we create powerups in our sprite group for each object in our map
  teleport2Objects.forEach(teleport2Object => {

  // Add new powerups to our sprite group, change the start y position to meet the platform
  const teleport2Powerup = this.teleport2.create(teleport2Object.x, teleport2Object.y + 200 - teleport2Object.height, 'teleport2').setOrigin(0, 0);
  teleport2Powerup.body.setSize(teleport2Powerup.width, teleport2Powerup.height - 20).setOffset(0, 20);
  

  teleport2Coordinates = [teleport2Object.x, teleport2Object.y]
});

this.teleport3 = this.physics.add.group({
  allowGravity: false,
  immovable: true,
});

// Let's get the spike objects, these are NOT sprites
const teleport3Objects = map.getObjectLayer('Teleport3')['objects'];

// Now we create powerups in our sprite group for each object in our map
teleport3Objects.forEach(teleport3Object => {

// Add new powerups to our sprite group, change the start y position to meet the platform
const teleport3Powerup = this.teleport3.create(teleport3Object.x, teleport3Object.y + 200 - teleport3Object.height, 'teleport3').setOrigin(0, 0);
teleport3Powerup.body.setSize(teleport3Powerup.width, teleport3Powerup.height - 20).setOffset(0, 20);


teleport3Coordinates = [teleport3Object.x, teleport3Object.y]
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

