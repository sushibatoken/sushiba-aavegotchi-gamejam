import 'phaser';
import Model from './Model';
import config from './Config/config';
import GameScene from './Scenes/levelOneScene';
import GameSceneTwo from './Scenes/levelTwoScene';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import StoryScene from './Scenes/StoryScene';
import EndGameScene from './Scenes/EndGameScene';
import HowToScene from './Scenes/HowToScene';
import TransitionScene from './Scenes/TransitionScene';


Moralis.initialize("ppKsJ87zo59ln2WnmJm3n66TM9mq06I4GYGqLxRq");
Moralis.serverURL = "https://5naflsgtclgx.moralisweb3.com:2053/server";

var home = document.getElementById("home")

class Game extends Phaser.Game {
  constructor () {
    super(config);
    const model = new Model();
    this.globals = { model };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('HowTo', HowToScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);
    this.scene.add('Story', StoryScene);
    this.scene.add('Game', GameScene);
    this.scene.add('Transition', TransitionScene);
    this.scene.add('LevelTwo', GameSceneTwo);
    this.scene.add('endGame', EndGameScene);
    this.scene.start('Boot');
  }
}

function launch(){
  let user = Moralis.User.current();
  if (!user) {
    console.log("PLEASE LOG IN WITH METAMASK!!")
  }
  else{
    console.log(user.get("ethAddress") + " " + "logged in")
    home.style.display = "none";
    document.getElementById("btn-login").style.display = "none"
    window.game = new Game();
  }

}

launch();

async function login() {
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.Web3.authenticate();
    launch()
  }
  console.log("logged in user:", user);
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
  location.reload();
  home.style.display = "block";
}



document.getElementById("btn-login-home").onclick = login;
document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;

