
// BUGS INCLUDE... 
// not displaying character moving left --> remove left function (FINISHED)
// character moves through black barriers --> fix collision detection for x coordinates
// character restart causes character to fly off --> add key up for right key???


const background = document.querySelector('.myImg').src = './img/4_game_background.png'
const platform = document.querySelector('.myImg').src = './img/platform.png'
const spider = document.querySelector('.myImg').src = './img/Spider2.png'
const boo = document.querySelector('.myImg').src = './img/BooSign.png'
const pumpkin = document.querySelector('.myImg').src = './img/Pumpkin3.png'
const findpumpkin = document.querySelector('.myImg').src = './img/findpumpkin.png'
const sparkle = document.querySelector('.myImg').src = './img/sparkle.png'

const spriteStandRight = document.querySelector('.myImg').src = './img/Owlet_Monster_Idle_4.png'
const spriteRunRight = document.querySelector('.myImg').src = './img/Owlet_Monster_Walk_6.png'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = screen.width // Sets window width from left to right
canvas.height = 700 // Sets window height from top to bottom

const gravity = 0.5
class Player {
    constructor() { // Sets all the properties associated with player
        this.speed = 10
        this.position = {
            x: 30,
            y: 100
        }
        this.velocity = { // Gives gravity
            x: 0,
            y: 0
        }
        this.width = 50
        this.height = 50

        this.image = createImage(spriteStandRight)
        this.frames = 0
        this.sprites = {
            stand: {
                right: createImage(spriteStandRight)
            },
            run: {
                right: createImage(spriteRunRight)
            }
        }
        this.currentSprite = this.sprites.stand.right
    }

    draw() {
        c.drawImage(
            this.currentSprite,
            32 * this.frames, // Adds Idle bouncing (but too fast)
            0,
            32, // Adds player width from image
            32, // Adds player height from image
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height)
    }
    
    update() {
        this.frames++
        if (this.frames > 1 && this.currentSprite === 
            this.sprites.stand.right) 
            this.frames = 0 // Adds Idle bouncing (but too fast) pt.2
        else if (this.frames > 4 && this.currentSprite === 
            this.sprites.run.right)
            this.frames = 0
        this.draw()
        this.position.y += this.velocity.y // These 2 are used to be added to for control movement
        this.position.x += this.velocity.x
        if (this.position.y + this.height +
            this.velocity.y <= canvas.height) // This adds a ground to stop velocity
            this.velocity.y += gravity // This adds velocity to gravity
    }
}

class Platform {
    constructor({x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw () { // Draws rectangle
        c.drawImage(this.image, 
            this.position.x, 
            this.position.y)
    }
}

class GenericObject { // This is for objects that we can walk by
    constructor({x, y, image }) {
        this.position = {
            x,
            y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    }
    draw () { // Draws rectangle
        c.drawImage(this.image, 
            this.position.x, 
            this.position.y)
    }
}

function createImage(imageSrc) { // This code allows creation for new images rather than making a new const everytime
    const image = new Image()
    image.src = imageSrc
    return image
}

let platformImage = createImage(platform)
    let player = new Player() 
    let platforms = []
    let genericObjects = []

    const keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    let scrollOffset = 0

function init() {
    platformImage = createImage(platform)

    player = new Player() 
    platforms = [
        new Platform({ x: 0, y: 470, image: platformImage}), // Sets up first platform
        new Platform({ x: 700, y: -300, image: platformImage}),
        new Platform({ x: 1500, y: 300, image: platformImage}),
        new Platform({ x: 2000, y: 200, image: platformImage}),
        new Platform({ x: 2700, y: -250, image: platformImage}),
        new Platform({ x: 3500, y: 400, image: platformImage}),
        new Platform({ x: 3990, y: -100, image: platformImage}),
        new Platform({ x: 4500, y: 300, image: platformImage}),
        new Platform({ x: 5200, y: -190, image: platformImage}),
        new Platform({ x: 6000, y: 200, image: platformImage}),
        new Platform({ x: 6700, y: -210, image: platformImage}),
        new Platform({ x: 7200, y: 150, image: platformImage}),
        new Platform({ x: 8000, y: 300, image: platformImage}),
        new Platform({ x: 8700, y: -200, image: platformImage}),
        new Platform({ x: 9100, y: -250, image: platformImage}),
        new Platform({ x: 9900, y: 200, image: platformImage}),
        new Platform({ x: 11000, y: 400, image: platformImage})
    ]

    genericObjects = [
        new GenericObject({ x: 0, y: 0, image: createImage(background)}),
        new GenericObject({ x: 1800, y: 0, image: createImage(background)}),
        new GenericObject({ x: 3600, y: 0, image: createImage(background)}),
        new GenericObject({ x: 5400, y: 0, image: createImage(background)}),
        new GenericObject({ x: 7200, y: 0, image: createImage(background)}),
        new GenericObject({ x: 50, y: 100, image: createImage(spider)}),
        new GenericObject({ x: 1200, y: 245, image: createImage(boo)}),
        new GenericObject({ x: 5000, y: 300, image: createImage(boo)}),
        new GenericObject({ x: 7500, y: 200, image: createImage(boo)}),
        new GenericObject({ x: 7450, y: 150, image: createImage(sparkle)}),
        new GenericObject({ x: 7650, y: 370, image: createImage(pumpkin)}),
        new GenericObject({ x: 200, y: 300, image: createImage(findpumpkin)})
    ]

    scrollOffset = 0
} 

// Allows to maintain character shape
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height) 

genericObjects.forEach(genericObject => {
    genericObject.draw()
})
    platforms.forEach((platform) => {
        platform.draw()
    })
    player.update()

    if (keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if (
        (keys.left.pressed && player.position.x > 100) || 
        (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
       )   {
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0
        if (keys.right.pressed) {
            scrollOffset += player.speed
        platforms.forEach((platform) => {
            platform.position.x -= player.speed   // Allows platform to move as same rate as character
        })
        genericObjects.forEach(genericObject => {
            genericObject.position.x -= player.speed * 0.66
        })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach((platform) => {
            platform.position.x += player.speed  // Same as above but for left side
        })

        genericObjects.forEach(genericObject => {
            genericObject.position.x += player.speed * 0.66
        })
        
        }
    }

// Platform collision detection
platforms.forEach((platform) => {
    if ( 
        player.position.y + player.height <= 
        platform.position.y && player.position.y + player.height + player.velocity.y >= 
        platform.position.y && player.position.x + player.width >= // Allows falling on left side
        platform.position.x && player.position.x <= // Allows falling on right side
        platform.position.x + platform.width
    ){
    player.velocity.y = 0
    }
    // if (
    //     player.position.y + player.height <=
    //     platform.position.x && player.position.y + player.height + player.velocity.x >=
    //     platform.position.x && player.position.x + player.width >=
    //     platform.position. // TRYING TO CREATE X COLLISION DETECTION
    // )
    })

// Win condition
    if (scrollOffset > 11000) {
        alert('You Win!')
        init()
        
    }

// Lose condition
if (player.position.y > canvas.height) {
    init()
}
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => { // This creates character movement
    switch (keyCode) {
        // DISABLED LEFT KEY
        // case 65:
        //     console.log('left')
        //     keys.left.pressed = true
        //     break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = true
            player.currentSprite = player.sprites.run.right
            break

        case 87:
            console.log('up')
            player.velocity.y -= 1
            break
    }
})

addEventListener('keyup', ({ keyCode }) => { // This allows endless gravity to stop 
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            break

        case 83:
            console.log('down')
            break

        case 68:
            console.log('right')
            keys.right.pressed = false
            player.currentSprite = player.sprites.stand.right
            break

        case 87:
            console.log('up')
            player.velocity.y -= 10
            break
    }
})