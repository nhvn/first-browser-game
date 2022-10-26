const background = document.querySelector('.myImg').src = './img/4_game_background.png'
const platform = document.querySelector('.myImg').src = './img/platform.png'
const ghosts = document.querySelector('.myImg').src = './img/Ghost1.png'

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
            x: 100,
            y: 100
        }
        this.velocity = { // This gives gravity
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
            32 * this.frames, // Adds Idle bouncing (too fast)
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
            this.frames = 0 // Adds Idle bouncing (too fast) pt.2
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
        new Platform({ x: platformImage.width * 2 + 300, y: 100, image: platformImage}),
        new Platform({ x: platformImage.width * 3 + 500, y: 200, image: platformImage}),
        new Platform({ x: platformImage.width * 4 + 300, y: 600, image: platformImage}),
        new Platform({ x: platformImage.width * 5 + 200, y: 300, image: platformImage}),
        new Platform({ x: platformImage.width * 8 + 100, y: 200, image: platformImage },

    )]

    genericObjects = [
        new GenericObject({
            x: 0,
            y: 0,
            image: createImage(background) // Extra backgrounds for longer map
        }),
        new GenericObject({
            x: 1800,
            y: 0,
            image: createImage(background)
        }),
        new GenericObject({
            x: 3600,
            y: 0,
            image: createImage(background)
        }),
        new GenericObject({
            x: 5400,
            y: 0,
            image: createImage(background)
        }),
        new GenericObject({
            x: 7200,
            y: 0,
            image: createImage(background)
        }),
        new GenericObject({
            x: 50,
            y: 100,
            image: createImage(ghosts)
        })
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
        player.position.y + player.height <= platform.position.y && 
        player.position.y + 
        player.height + 
        player.velocity.y >= 
        platform.position.y && 
        player.position.x + // Allows falling on left side
        player.width >= 
        platform.position.x &&
        player.position.x <= 
        platform.position.x + // Allows falling on right side
        platform.width
    ){
    player.velocity.y = 0
    }
    })

// Win condition
    if (scrollOffset > 2000) {
        console.log('You win!')
    }

// Lose condition
if (player.position.y > canvas.height) {
    init()
}
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => { // This creates character movement
    // console.log(keyCode)
    switch (keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            break

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