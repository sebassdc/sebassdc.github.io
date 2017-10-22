class Vec {
  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
  get len() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
  set len(value) {
    const fact = value / this.len
    this.x *= fact
    this.y *= fact
  }
}

class Rect {
  constructor(width, height) {
    this.pos = new Vec
    this.size = new Vec(width, height)
  }
  get left() {
    return this.pos.x
  }
  get right() {
    return this.pos.x + this.size.x
  }
  get top() {
    return this.pos.y
  }
  get bottom() {
    return this.pos.y + this.size.y
  }
}

class Ball extends Rect {
  constructor() {
    super(10, 10)
    this.vel = new Vec
  }
}

class Player extends Rect {
  constructor() {
    super(20, 100)
    this.score = 0
  }
}

class Pong {
  constructor(canvas) {
    this._canvas = canvas
    this._context = canvas.getContext('2d')

    this.ball = new Ball

    this.players = [
      new Player,
      new Player
    ]
    this.players[0].pos.x = 40
    this.players[1].pos.x = this._canvas.width - this.players[1].size.x - 40
    
    this.PIXEL_W = 10

    this.CHARS = [
      '111101101101111',
      '010010010010010',
      '111001111100111',
      '111001111001111',
      '101101111001001',
      '111100111001111',
      '111100111101111',
      '111001001001001',
      '111101111101111',
      '111101111001001',
    ].map(str => {
      const canvas = document.createElement('canvas')
      canvas.height = this.PIXEL_W * 5
      canvas.width = this.PIXEL_W * 3
      const context = canvas.getContext('2d')
      context.fillStyle = '#FFF'
      str.split('').forEach((fill, i) => {
        if (fill === '1') {
          context.fillRect(
            (i % 3) * this.PIXEL_W,
            Math.floor(i / 3) * this.PIXEL_W,
            this.PIXEL_W, this.PIXEL_W
          )
        }
      })
      return canvas
    })
    
    let lastTime
    
    const callback = (millis) => {
      if (lastTime)
        this.update((millis - lastTime) / 1000)

      lastTime = millis;
      requestAnimationFrame(callback)
    }
    this.reset()
    callback()
  }
  collide(player, ball) {
    if (player.left < ball.right && player.right > ball.left &&
        player.top < ball.bottom && player.bottom > ball.top) {
      const len = ball.vel.len
      ball.vel.x = -ball.vel.x
      ball.vel.y = 300 * (Math.random() - 0.5)
      ball.vel.len = len * 1.05
    }
  }
  drawBackground() {
    this._context.fillStyle = '#000'
    this._context.fillRect(0, 0, this._canvas.width, this._canvas.height)
  }
  drawScore() {
    const align = this._canvas.width / 3
    const CHAR_W = this.PIXEL_W * 4
    this.players.forEach((p, i) => {
      const digits = p.score.toString().split('')
      const offset = align * (i + 1) - (CHAR_W * digits.length / 2) + this.PIXEL_W / 2
      digits.forEach((char, pos) => {
        this._context.drawImage(
          this.CHARS[parseInt(char)],
          offset + pos * CHAR_W,
          20
        )
      })

    })
  }
  drawRect({pos, size}) {
    this._context.fillStyle = '#FFF'
    this._context.fillRect(pos.x, pos.y, size.x, size.y)
  }
  draw() {
    this.drawBackground()
    this.drawRect(this.ball)
    this.players.forEach(p => this.drawRect(p))
    this.drawScore()
  }
  reset() {
    this.ball.pos.x = (this._canvas.width / 2) - (this.ball.size.x / 2)
    this.ball.pos.y = (this._canvas.height / 2) - (this.ball.size.y / 2)
    this.ball.vel.x = 0
    this.ball.vel.y = 0
  }
  start() {
    if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
      this.ball.vel.x = 300 * (Math.random() >= 0.5? 1 : -1)
      this.ball.vel.y = 300 * (Math.random() * 2 - 1)
      this.ball.vel.len = 300
    }
  }
  update(dt) {
    // movement
    this.ball.pos.x += this.ball.vel.x * dt
    this.ball.pos.y += this.ball.vel.y * dt
    
    // check collissions
    if (this.ball.left < 0 || this.ball.right > this._canvas.width) {
      let playerId = (this.ball.vel.x < 0) ? 1 : 0
      this.players[playerId].score++
      console.log(playerId)
      this.reset()
    }
    if (this.ball.top < 0 || this.ball.bottom > this._canvas.height) {
      this.ball.vel.y = -this.ball.vel.y
    }

    let ballCenter = this.ball.pos.y + this.ball.size.y / 2

    this.players[1].pos.y = ballCenter - this.players[1].size.y / 2
    this.players.forEach(p => this.collide(p, this.ball))

    this.draw()
  }
}



const canvas = document.getElementById('pong')
const pong = new Pong(canvas)

canvas.addEventListener('mousemove', event => {
  const offsetScaled = (event.offsetY / event.target.getBoundingClientRect().height)
    * canvas.height
  console.log(offsetScaled)
  pong.players[0].pos.y = (offsetScaled - pong.players[0].size.y / 2)
})

canvas.addEventListener('click', event => pong.start())