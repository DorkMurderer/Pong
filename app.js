const canvasEl = document.getElementById("canvas");
const scoreEl = document.getElementById("player1Score")
const scoreEl2 = document.getElementById("player2Score")
const ctx = canvasEl.getContext("2d");


var drawing = false;
var mousePos = { x:0, y:0 };
var lastPos = mousePos;
canvasEl.addEventListener("mousedown", function (e) {
        drawing = true;
  lastPos = getMousePos(canvas, e);
}, false);
canvasEl.addEventListener("mouseup", function (e) {
  drawing = false;
}, false);
canvasEl.addEventListener("mousemove", function (e) {
  mousePos = getMousePos(canvasEl, e);
}, false);


canvasEl.width = window.innerWidth
canvasEl.height = window.innerHeight

const keysPressed = []
const KEY_UP = 38
const KEY_DOWN = 40

window.addEventListener("keydown", function (e) {
 keysPressed[e.keyCode] = true
})



window.addEventListener("keyup", function (e) {
   keysPressed[e.keyCode] = false
  })


function vec2(x, y){
   return {x: x, y: y}
}

function Ball(pos, velocity, radius){
    this.pos = pos
    this.velocity = velocity
    this.radius = radius

    this.update = function () {
        this.pos.x += this.velocity.x
        this.pos.y += this.velocity.y

    }

    this.draw = function(){
    ctx.fillStyle = "white"
    ctx.strokeStyle = "white"
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    
    }

}

function Paddle(pos, velocity, width, height){
   this.pos = pos;
   this.velocity = velocity;
   this.width = width;
   this.height = height;
   this.score = 0

   this.update = function () {
      if (keysPressed[KEY_UP]){
         this.pos.y -= this.velocity.y
      }
      if (keysPressed[KEY_DOWN]){
         this.pos.y += this.velocity.y
      }
   }

   this.draw = function (){
      ctx.fillStyle = "white"
      ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height)
   }

   this.getHalfWidth = function (){
      return this.width / 2
    }
 
    this.getHalfHeight = function () {
       return this.height / 2
    }
 
    this.getCenter = function() {
      return vec2(
         this.pos.x + this.getHalfWidth(),
         this.pos.y + this.getHalfHeight()
      )      
    }
}

function paddleCollisionWithEdges(paddle){
   if (paddle.pos.y <= 0) {
      paddle.pos.y = 0
   }

   if (paddle.pos.y + paddle.height >= canvasEl.height){
      paddle.pos.y = canvasEl.height - paddle.height
   }
}

function ballCollisionWithTheEdges(ball){
     if (ball.pos.y + ball.radius >= canvasEl.height){
        ball.velocity.y *= -1
     }

     if (ball.pos.y - ball.radius <= 0) {
        ball.velocity.y *= -1
     }

   //   if (ball.pos.x + ball.radius >= canvasEl.width){
   //      ball.velocity.x *= -1
   //   }

   //   if(ball.pos.x - ball.radius <= 0) {
   //      ball.velocity.x *= -1
   //   }
}

function ballPaddleCollision(ball, paddle){
   let dx = Math.abs(ball.pos.x - paddle.getCenter().x)
   let dy = Math.abs(ball.pos.y - paddle.getCenter().y)

   if (dx <= (ball.radius + paddle.getHalfWidth()) && dy <= (paddle.getHalfHeight() + ball.radius)){
      ball.velocity.x *= -1
   }
}

function player2AI(ball, paddle){
   if (ball.velocity.x > 0) {
      if (ball.pos.y > paddle.pos.y){
         paddle.pos.y += paddle.velocity.y
         if(paddle.pos.y + paddle.height >= canvasEl.height) {
            paddle.pos.y = canvasEl.height - paddle.height
         }
      }

      if(ball.pos.y < paddle.pos.y) {
         paddle.pos.y -= paddle.velocity.y

         if (paddle.pos.y <= 0) {
            paddle.pos.y = 0
         }
      }
   }
}

function respawnBall(ball){
   if (ball.velocity.x > 0) {
      ball.pos.x = canvasEl.width - 150
      ball.pos.y = (Math.random() * (canvasEl.height - 200)) + 100
   }

   if (ball.velocity.x < 0){
      ball.pos.x = 150
      ball.pos.y = (Math.random() * (canvasEl.height - 200)) + 100
   }

   ball.velocity.x *= -1
   ball.velocity.y *= -1
}

function increaseScore(ball, paddle1, paddle2){
   if (ball.pos.x <= -ball.radius) {
      paddle2.score += 1
      document.getElementById("player2Score").innerHTML = paddle2.score
      respawnBall(ball)
   }

   if (ball.pos.x >= canvasEl.width + ball.radius) {
      paddle1.score += 1;
      document.getElementById("player1Score").innerHTML = paddle1.score
      respawnBall(ball)

   }
}

function drawGameScene(){

    ctx.strokeStyle = "white"

   ctx.beginPath()
   ctx.lineWidth = 20
   ctx.moveTo(0, 0)
   ctx.LineTo(canvasEl.width, 0)
   ctx.stroke()
}

const ball = new Ball(vec2(200, 200), vec2(12, 12), 20)
const paddle1 = new Paddle(vec2(0, 50), vec2(10, 10), 20, 160)
const paddle2 = new Paddle(vec2(canvasEl.width - 20, 30), vec2(11, 11), 20, 160)


function gameUpdate(){
  ball.update()
  paddle1.update()
  paddleCollisionWithEdges(paddle1)
  ballCollisionWithTheEdges(ball)

  player2AI(ball, paddle2)

  ballPaddleCollision(ball, paddle1)
  ballPaddleCollision(ball, paddle2)

  increaseScore(ball, paddle1, paddle2)

}

function GameDraw () {
    ball.draw()
    paddle1.draw()
    paddle2.draw()
    drawGameScene()
}


function gameLoop() {
    //ctx.clearRect(0, 0, canvasEl.width, canvasEl.height)
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"
    ctx.fillRect(0, 0, canvasEl.width, canvasEl.height)
    window.requestAnimationFrame(gameLoop)
    gameUpdate()
    GameDraw()


}

gameLoop()


