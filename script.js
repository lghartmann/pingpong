const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");
const pauseBtn = document.querySelector("#pause-play");
const resetBtn = document.querySelector("#reset");
const menuBtn = document.querySelector("#menu");


let isPaused = false
const lineWidth = 15
const gapX = 10
let currentSpeed = 6
let speedZero = 0
let startBtn = false
let mouseListen = true
var mouse = { x:0, y:0}


function reset(){

    ball.x = field.w/2;
    ball.y = field.h/2;
    ball.speed = 6;
    mouseListen = true
    currentSpeed = 6;
    score.human = 0;
    score.computer = 0;

}

function pause(){

    ball.speed = 0
    pauseBtn.innerHTML = "Resume"
    isPaused = true
    mouseListen = false
}

function resume(){
        
    ball.speed = currentSpeed
    pauseBtn.innerHTML = "Pause"
    isPaused = false
    mouseListen = true

}

pauseBtn.addEventListener("click", (e)=>{

    if(isPaused == true){
        resume()
    } else {
        pause()
    }

})

resetBtn.addEventListener("click", (e)=>{

    if(isPaused == false){reset()}

})





const field = {

    w: window.innerWidth,
    h: window.innerHeight,
    draw: function(){

        canvasCtx.fillStyle = "#286047"
    canvasCtx.fillRect(0,0, window.innerWidth, window.innerHeight)

    }

}

const line = {

    w:15,
    h: field.h, 
    draw:function(){
    const x = field.w/2 - this.w /2
    const y = 0
    const w = lineWidth
    const h = field.h
    canvasCtx.fillStyle = "#ffffff"
    canvasCtx.fillRect(x, y, w, h)

    }

}

const leftRacket = {

    x:gapX,
    y:0,
    w:line.w,
    h:200,
    _move: function(){

        this.y = mouse.y - this.h/2


    },
    draw: function(){

        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }
    
}

const rightRacket = {

    x: field.w - line.w - gapX,
    y: 100,
    w: line.w,
    h:200,
    speed: 4.5,
    _move: function(){

        if(this.y + this.h / 2 < ball.y + ball.r){
            this.y += this.speed
        } else {
            this .y -= this.speed
        }
        this.y = ball.y - this.h /2
    },
    _speedUp: function(){

        this.speed += 1

    },
    draw: function(){

        canvasCtx.fillRect(this.x, this.y, this.w, this.h)
        this._move()
    }


}

const ball = {
    x: field.w/2,
    y: field.h/2,
    r: 20,
    speed: 6,
    directionX: 1,
    directionY: 1,
    _calcPosition: function(){

        if(this.x > field.w - this.r - rightRacket.w - gapX){

            if(
            this.y + this.r > rightRacket.y && 
            this.y - this.r < rightRacket.y + rightRacket.h
            ){  
                this._reverseX()

            }else {
                    score.increaseHuman()
                    this._pointUp()
                    }

        }

        if(this.x < this.r + leftRacket.w + gapX) {
            if(this.y + this.r > leftRacket.y && this.y - this.r < leftRacket.y + leftRacket.h){

                this._reverseX()

            } else {

                score.increaseComputer()
                this._pointUp()

            }
        }

        if(
            (this.y - this.r < 0 && this.directionY < 0) ||
            (this.y > field.h - this.r && this.directionY > 0))
        {
            this._reverseY()
        }

    },
    _reverseX: function(){
        this.directionX *= -1
    },
    _reverseY: function(){
        this.directionY *= -1
    },
    _speedUp:function(){

         if (this.speed < 30){
            currentSpeed = (this.speed+= 1)
        }
        
    },
    _pointUp: function(){
        
        this._speedUp()
        rightRacket._speedUp()
        this.x = field.w/2
        this.y = field.h/2

    },
    _move: function () {
      this.x += this.directionX * this.speed
      this.y += this.directionY * this.speed
    },
    draw: function () {
      canvasCtx.fillStyle = "#ffffff"
      canvasCtx.beginPath()
      canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
      canvasCtx.fill()

      this._calcPosition()
      this._move()
    },
  }

const score = {

    human:0,
    computer:0,
    increaseHuman: function(){
        this.human++
    },
    increaseComputer: function(){
        this.computer++
    },
    draw: function(){

    canvasCtx.font = "bold 72px Arial"
    canvasCtx.textAlign = "center"
    canvasCtx.textBaseline = "top"
    canvasCtx.fillStyle = "#01341d"
    
    canvasCtx.fillText(this.human, field.w/4, 50)
    canvasCtx.fillText(this.computer, (field.w/4) + (field.w/2), 50)

    if(isPaused == true){

        canvasCtx.fillText("Paused", field.w/2, 50)

    }

    }

}

function prepare(){

    canvasEl.width = canvasCtx.width = field.w //window.innerWidth
    canvasEl.height = canvasCtx.height = field.h //window.innerHeight

}

function setup(){

    field.draw()

    line.draw()

    leftRacket.draw()

    rightRacket.draw()

    ball.draw()

    score.draw()

}


window.animateFrame = (function () {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {

        return window.setTimeout(callback, 1000/60)
      }
    )
  })()

  function main(){

    animateFrame(main)
    setup()

  }

  function addEvent(){

    if(mouseListen == true){

        console.log("LISTENING")

        canvasEl.addEventListener('pointermove', function (e){
            mouse.x = e.pageX
            mouse.y = e.pageY
        })

    } else {

        console.log("NOT LISTENING")

        canvasEl.removeEventListener('pointermove', function (e){

            mouse.x = e.pageX
            mouse.y = e.pageY

        })

    }
}

    addEvent()
    prepare()
    main()
    
    

   
    
   
       