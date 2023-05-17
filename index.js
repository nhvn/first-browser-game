// BACKGROUND
const background = (document.querySelector(".myImg").src = "./img/4_game_background.png");
const platform = (document.querySelector(".myImg").src = "./img/platform.png");
const spider = (document.querySelector(".myImg").src = "./img/Spider2.png");
const boo = (document.querySelector(".myImg").src = "./img/BooSign.png");
const pumpkin = (document.querySelector(".myImg").src = "./img/Pumpkin3.png");
const findpumpkin = (document.querySelector(".myImg").src = "./img/findpumpkin.png");
const sparkle = (document.querySelector(".myImg").src = "./img/sparkle.png");
const canvas = document.querySelector("canvas");
const chaser = (document.querySelector(".myImg").src = "./img/chaser.png");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// SPRITE
const spriteStandRight = (document.querySelector(".myImg").src = "./img/idleRight.png");
const spriteRunRight = (document.querySelector(".myImg").src = "./img/walkRight.png");
const spriteRunLeft = (document.querySelector(".myImg").src = "./img/walkLeft.png");
const spriteStandLeft = (document.querySelector(".myImg").src = "./img/idleLeft.png");

const gravity = 0.2; // Gravity (similar to line 270 and 286)

// PROPERTIES OF CHARACTER
class Player {
  constructor() {
    this.speed = 5;
    this.position = { // Starting position
      x: 30,
      y: 420,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.width = 50;
    this.height = 50;
    this.frames = 0;
    this.frameDelay = 10; // update frames every 10 game updates
    this.frameDelayCount = 0; // counter for frame delay
    this.sprites = {
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft)
      },
      run: {
        right: createImage(spriteRunRight), // Displays running left & right
        left: createImage(spriteRunLeft)
      }
    };
    this.currentSprite = this.sprites.stand.right;
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      32 * this.frames,
      0,
      32, // Adds player width from image
      32, // Adds player height from image
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frameDelayCount++; // increment frameDelayCount
    if (this.frameDelayCount >= this.frameDelay) { 
      // reset frameDelayCount
      this.frameDelayCount = 0;
      // increment frames
      this.frames++;
    }
  
    if (this.frames > 1 && this.currentSprite === this.sprites.stand.right)
      this.frames = 0; 
    else if (this.frames > 4 && this.currentSprite === this.sprites.run.right)
      this.frames = 0;
  
    this.draw();
    this.position.y += this.velocity.y; // Added to for control movement
    this.position.x += this.velocity.x;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) // Ground to stop velocity
      this.velocity.y += gravity; // Adds velocity to gravity
  }
}

// PLATFORM & GENERAL OBJECT
class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

let platformImage = createImage(platform);
let player = new Player();
let platforms = [];
let genericObjects = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

let chaserDistance = 0; // New variable to track chaser's relative movement

function init() {
  platformImage = createImage(platform);
  player = new Player();

  platforms = [
    new Platform({ x: 0, y: 470, image: platformImage }), // Sets up first platform
    new Platform({ x: 700, y: -300, image: platformImage }),
    new Platform({ x: 1500, y: 300, image: platformImage }),
    new Platform({ x: 2000, y: 200, image: platformImage }),
    new Platform({ x: 2700, y: -250, image: platformImage }),
    new Platform({ x: 3500, y: 400, image: platformImage }),
    new Platform({ x: 3990, y: -100, image: platformImage }),
    new Platform({ x: 4500, y: 300, image: platformImage }),
    new Platform({ x: 5200, y: -190, image: platformImage }),
    new Platform({ x: 6000, y: 200, image: platformImage }),
    new Platform({ x: 6700, y: -210, image: platformImage }),
    new Platform({ x: 7200, y: 150, image: platformImage }),
    new Platform({ x: 8000, y: 300, image: platformImage }),
    new Platform({ x: 8700, y: -200, image: platformImage }),
    new Platform({ x: 9100, y: -250, image: platformImage }),
    new Platform({ x: 9900, y: 200, image: platformImage }),
    new Platform({ x: 11000, y: 400, image: platformImage }),
  ];

  genericObjects = [
    new GenericObject({ x: 0, y: 0, image: createImage(background) }),
    new GenericObject({ x: 1800, y: 0, image: createImage(background) }),
    new GenericObject({ x: 3600, y: 0, image: createImage(background) }),
    new GenericObject({ x: 5400, y: 0, image: createImage(background) }),
    new GenericObject({ x: 7200, y: 0, image: createImage(background) }),
    new GenericObject({ x: 50, y: 100, image: createImage(spider) }),
    new GenericObject({ x: 1200, y: 245, image: createImage(boo) }),
    new GenericObject({ x: 5000, y: 300, image: createImage(boo) }),
    new GenericObject({ x: 7500, y: 200, image: createImage(boo) }),
    new GenericObject({ x: 7450, y: 150, image: createImage(sparkle) }),
    new GenericObject({ x: 7650, y: 370, image: createImage(pumpkin) }),
    new GenericObject({ x: 200, y: 300, image: createImage(findpumpkin) }),
  ];

  // CHASER 1
  movingObject = new MovingObject({
    x: -100,  // Initial x position outside the canvas on the left
    y: 0,     // Starting y position
    image: createImage(chaser),
    speed: 1, // Adjust the speed as needed
  });
  
  scrollOffset = 0;
  keys.right.pressed = false;
  chaserDistance = 0;
}

// CHASER 2
class MovingObject {
  constructor({ x, y, image, speed }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = canvas.height; // Cover the entire height of the canvas
    this.speed = speed;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.position.x += this.speed; // Move towards the right at a fixed speed
  }  
}

let movingObjectImage = createImage(chaser);
let movingObject = new MovingObject({
  x: canvas.width,
  y: 420,
  image: movingObjectImage,
  speed: 1,
});

// ALLOWS TO MAINTAIN SHAPE
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });
  platforms.forEach((platform) => {
    platform.draw();
  });

  player.update();
  movingObject.update();
  movingObject.draw();

  // CHASER 3
  if (keys.right.pressed) {
    movingObject.position.x -= player.speed;
  } else if (keys.left.pressed && scrollOffset > 0) {
    movingObject.position.x -= player.speed;
  }

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }
    if (scrollOffset > 11000) {
      alert("You Win!");
      init();
    }
  
    if (player.position.y > canvas.height || player.position.y < -50) {
      init();
    }
  }

  // PLATFORM COLLISION DETECTION
  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y && // Allows to stay onto platform 
      player.position.y + player.height + player.velocity.y >= platform.position.y && // Allows to jump over platform then land
      player.position.x + player.width >= platform.position.x && // Allows falling left
      player.position.x <= platform.position.x + platform.width // Allows falling right
    ) {
      player.velocity.y = 0; // Allows you you to stand on platforms
    }
    else if ( // HORIZONTAL BARRIERS
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width &&
      player.position.y + player.height >= platform.position.y &&
      player.position.y + player.height <= platform.position.y + platform.height
      ) {
      player.velocity.x = 0;
      init()
    }
  })

  // MOVING OBJECT COLLISION DETECTION
  if (
    player.position.x < movingObject.position.x + movingObject.width &&
    player.position.x + player.width > movingObject.position.x &&
    player.position.y < movingObject.position.y + movingObject.height &&
    player.position.y + player.height > movingObject.position.y
  ) {
    // collision detected!  
    init();
  }

  // WIN CONDITION
  if (scrollOffset > 11000) {
    alert("You Win!");
    init()
  }

  // LOSE CONDITION
  if (
    player.position.y > canvas.height ||
    player.position.y < -50
    ) {
    init();
  }
}

init();
animate();

// CHARACTER MOVEMENT
addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 68: // d key
      console.log("right");
      keys.right.pressed = true;
      player.currentSprite = player.sprites.run.right;
      break;
    case 65: // a key
      console.log("left");
      keys.left.pressed = true;
      player.currentSprite = player.sprites.run.left;
      break;
    case 87: // w key
      console.log("up");
      player.velocity.y -= 0.5; // How high character jumps
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  // This allows endless gravity to stop
  switch (keyCode) {
    case 68: // d key
      console.log("right");
      keys.right.pressed = false;
      player.currentSprite = player.sprites.stand.right;
      break;
    case 65: // a key
      console.log("left");
      keys.left.pressed = false;
      player.currentSprite = player.sprites.stand.left;
      break;
    case 87: // w key
      console.log("up");
      player.velocity.y -= 5;
      break;
  }
});

