let player = Player();
console.log(player);
let cake1, cake2;
let collisionRadius = 40;
let score = 0;

let gameState = 0;

let kirbyIdleSprite;
let cakeSprite, cakeEaten;
let backgroundImage;
let startButton, intructionButton;
let intructionScreen;

let backgroundMusic, collectSound;

function preload() {
  kirbyIdleSprite = loadImage("sprites/kirby_walk.gif");
  cakeSprite = loadImage("sprites/cake.gif");
  backgroundImage = loadImage("sprites/backgroundImage.png");
  cakeEaten = loadImage("sprites/cakeEaten.gif");

  startButton = loadImage("sprites/startbutton.png");
  intructionButton = loadImage("sprites/guide.png");
  intructionScreen = loadImage("sprites/");

  backgroundMusic = loadSound("audio/8-bit-retro-game-music-233964.mp3");
  collectSound = loadSound("audio/8-bit-powerup-6768.mp3");
}

function setup() {
  createCanvas(400, 400);

  imageMode(CENTER);

  cake1 = Cake();
  cake2 = Cake();

  startButton = Button(100, 300, startButton);
  intructionButton = Button(200, 300, intructionButton);

  //backgroundMusic.play();
  backgroundMusic.loop(true);
  backgroundMusic.setVolume(0.3);
}

function draw() {
  background(220);

  if (gameState == 0) {
    backgroundImage();
  } else if (gameState == 1) {
    intructionMenu();
  } else if (gameState == 2) {
    game();
  }
}

function startMenu() {
  image(backgroundImage, width / 2, height / 2);
  startButton.display();
  intructionButton.display();

  if (startButton.clicked) {
    gameState = 2;
  }

  if (instructionsButton.clicked) {
    gameState = 1;
  }
}

function Button(x, y, img) {
  let w = 64;
  let h = 32;

  let isClicked = false;

  function display() {
    image(img, x, y);
  }

  return display;
}

function clicked() {
  if (mouseIsPressed) {
    if (
      mouseX > x - w / 2 &&
      mouseX < x + w / 2 &&
      mouseY > y - h / 2 &&
      mouseY < y + h / 2
    ) {
      if (!isClicked) {
        isClicked = true;
        return true;
      }
    }
  } else if (isClicked) {
    isClicked = false;
  }
  return false;
}
//return { display, clicked };

function game() {
  player.move();
  player.display();

  cake1.move();
  cake1.display();

  cake2.move();
  cake2.display();

  let cake1Collide = dectectCollision(player, cake1);

  let cakeEaten = false;

  if (cake1Collide) {
    player.eat();
    cake1.eaten();

    if (!collectSound.isPlaying) {
      collectSound.play();
    }
  }

  let cake2Collide = dectectCollision(player, cake2);

  if (cake2Collide) {
    player.eat();
    cake2.eaten();

    if (!collectSound.isPlaying) {
      collectSound.play();
    }
    if (!cakeEaten) {
      score = score + 1;
      cakeEaten = true;
    }

    textSize(30);
    image(cakeSprite, 40, 40);
    fill("pink");
    text(score, 20, 40);
  }
}

function Player() {
  let x = 200;
  let y = 300;

  function move() {
    if (keyIsDown(RIGHT_ARROW)) {
      x = x + 5;
    }

    if (keyIsDown(LEFT_ARROW)) {
      x = x - 5;
    }
  }

  function display() {
    image(kirbyIdleSprite, x, y);
  }

  function getPosition() {
    return { x, y };
  }

  function eat() {}

  return { move, display, getPosition, eat };
}

function Cake() {
  let x = random(0, width);
  let y = 0;
  let speed = random(2, 8);

  let animationState = 0;

  function move() {
    y = y + speed;
    if (y > height) {
      y = 0;
      x = random(0, width);
      speed = random(2, 8);
      animationState = 0;
    }
  }

  function display() {
    if (animationState == 0) {
      image(cakeSprite, x, y);
    } else if (animationState == 1) {
      image(cakeEaten, x, y);
    }
  }

  function getPosition() {
    return { x, y };
  }

  function eaten() {
    animationState = 0;
  }
  return { move, display, getPosition, eaten };
}

function dectectCollision(objA, objB) {
  let aPosition = objA.getPosition();
  let bPosition = objB.getPosition();

  let d = dist(aPosition.x, aPosition.y, bPosition.x, bPosition.y);
  let isColliding = d < collisionRadius;
  return isColliding;
}
