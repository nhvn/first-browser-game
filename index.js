const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = window.innerWidth // Sets window width from left to right
canvas.height = window.innerHeight // Sets window height from top to bottom

const gravity = 0.5
class Player {
    constructor() { // Sets all the properties associated with player
        this.position = {
            x: 100,
            y:100
        }
        this.velocity = { // This gives gravity
            x: 0,
            y: 0
        }
        this.width = 25
        this.height = 25
    }

    draw() {
        c.fillStyle = 'blue'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
    
    update() {
        this.draw()
        this.position.y += this.velocity.y // These 2 are used to be added to for control movement
        this.position.x += this.velocity.x
        if (this.position.y + this.height +
            this.velocity.y <= canvas.height) // This adds a ground to stop velocity
            this.velocity.y += gravity // This adds velocity to gravity
        else this.velocity.y = 0
    }
}

const player = new Player()
const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height) // Allows to maintain character shape
    player.update()

    if (keys.right.pressed) {
        player.velocity.x = 5
    } else if (keys.left.pressed) {
        player.velocity.x = -5
} else player.velocity.x = 0
}

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
            break

        case 87:
            console.log('up')
            player.velocity.y -= 20
            break
    }
})