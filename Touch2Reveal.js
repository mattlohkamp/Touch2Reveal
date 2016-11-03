/*
  <img id="bottom" src="after.png" />
  <canvas id="top"></canvas>
*/

window.Touch2Reveal = function(root = document.getElementById('Touch2Reveal'),topSrc,bottomSrc,options={

}){

  if(!root) return false;

    //  INIT

  var init = function(){
    root.appendChild(bottom);

    canvas.width = top.width;
    canvas.height = top.height;

    context.drawImage(top,0,0,top.width,top.height);

    console.log(canvas,bottom);
  }

    //  OPERATIONS

  var distanceBetween = function(point1, point2) {  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));  }
  var angleBetween = function(point1, point2)  { return Math.atan2( point2.x - point1.x, point2.y - point1.y );  }
  var getImageDataAlphaRatio = function(imageData, alphaIndex = 4) {
    let alphaTotal = 0;
    let pixelArray = imageData.data;
    let len = pixelArray.length;
    const maxAlphaValue = 255;
    const alphaMax = (len / alphaIndex) * maxAlphaValue;
    for(let i = (alphaIndex-1); i < len; i+=alphaIndex){  alphaTotal += pixelArray[i];  }
    let alphaRatio = alphaTotal / alphaMax;
    return alphaRatio;
  }

    //  EVENTS

  const queueTarget = 2;
  var queueProgress = 0;
  var imageQueue = function(){
    queueProgress++;
    console.log(queueProgress);
    if(queueProgress == queueTarget)  init();
  }

  var onMouseDown = function(e){
    onDown(e, e.clientX,e.clientY);
    canvas.addEventListener('mousemove', onMouseMove);
  }
  var onTouchDown = function(e){
    onDown(e, e.touches[0].clientX,e.touches[0].clientY);
    canvas.addEventListener('touchmove', onTouchMove);
  }
  var onDown = function(e, _x, _y){
    e.preventDefault();
    context.globalCompositeOperation = 'destination-out';
    lastPoint = { x:_x, y:_y  };
    return false;
  }

    //  ON MOVE

  var onMouseMove = function(e){  onMove(e, e.clientX,e.clientY); }
  var onTouchMove = function(e){  onMove(e, e.touches[0].clientX,e.touches[0].clientY); }
  var onMove = function(e, _x, _y){
    e.preventDefault();

    var currentPoint = { x:_x, y:_y  };
    var dist = distanceBetween(lastPoint, currentPoint);
    var angle = angleBetween(lastPoint, currentPoint);

    for (var i = 0; i < dist; i+=brushSize) {

      x = lastPoint.x + (Math.sin(angle) * i);
      y = lastPoint.y + (Math.cos(angle) * i);

      var radgrad = context.createRadialGradient(x,y,(brushSize/10),x,y,(brushSize/2));

      radgrad.addColorStop(0, 'rgba(0,0,0,.2)');
      radgrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
      radgrad.addColorStop(1, 'rgba(0,0,0,0)');

      context.fillStyle = radgrad;
      context.fillRect(x-(brushSize/2), y-(brushSize/2), brushSize, brushSize);
    }

    lastPoint = currentPoint;

    return false;
  }

    //  ON UP

  var onMouseUp = function(e){
    canvas.removeEventListener('mousemove', onMouseMove);
    onUp(e);
  }
  var onTouchUp = function(e){
    canvas.removeEventListener('touchmove', onTouchMove);
    onUp(e);
  }
  var onUp = function(e){
    e.preventDefault();
    let alphaRatio = getImageDataAlphaRatio(context.getImageData(0,0,canvas.width,canvas.height));
    context.globalCompositeOperation = 'source-over';
    //  if(alphaRatio < ratioToShow)  endState();
    return false;
  }

    //  CONFIG

  const canvas = document.createElement('canvas');
  root.appendChild(canvas);

  const context = canvas.getContext('2d');

  const top = document.createElement('img');
  top.addEventListener('load', imageQueue);
  top.src = topSrc;

  const bottom = document.createElement('img');
  bottom.addEventListener('load', imageQueue);
  bottom.src = bottomSrc;

  console.log(imageQueue)

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('touchstart', onTouchDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchend', onTouchUp);
  canvas.addEventListener('touchcancel', onTouchUp);
  canvas.addEventListener('touchleave', onTouchUp);

    //  SHORTCUTS

  const ratioToShow = .2;
  const brushSize = window.innerWidth / 20;

  var lastPoint;

  console.log(this);
}


/*
  //  VARS

const frameWidth = 896;
const frameHeight = 504;

const canvasID = 'top';
const topSrc = 'plant1.png';
const imageID = 'bottom';
const goalID = 'goal';

const ratioToShow = .2;
const brushSize = window.innerWidth / 20;

var canvas, image, context, isDrawing, lastPoint, goal;



function distanceBetween(point1, point2) {  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));  }
function angleBetween(point1, point2) { return Math.atan2( point2.x - point1.x, point2.y - point1.y );  }
function getImageDataAlphaRatio(imageData, alphaIndex = 4) {
  let alphaTotal = 0;
  let pixelArray = imageData.data;
  let len = pixelArray.length;
  const maxAlphaValue = 255;
  const alphaMax = (len / alphaIndex) * maxAlphaValue;
  for(let i = (alphaIndex-1); i < len; i+=alphaIndex){  alphaTotal += pixelArray[i];  }
  let alphaRatio = alphaTotal / alphaMax;
  return alphaRatio;
}

  //  EVENT HANDLERS

  // ON DOWN

function onMouseDown(e){
  onDown(e, e.clientX,e.clientY);
  canvas.addEventListener('mousemove', onMouseMove);
}
function onTouchDown(e){
  onDown(e, e.touches[0].clientX,e.touches[0].clientY);
  canvas.addEventListener('touchmove', onTouchMove);
}
function onDown(e, _x, _y){
  //  console.log(e.type);
  e.preventDefault();
  isDrawing = true;
  context.globalCompositeOperation = 'destination-out';
  lastPoint = { x:_x, y:_y  };
  return false;
}

  //  ON MOVE

function onMouseMove(e){  onMove(e, e.clientX,e.clientY); }
function onTouchMove(e){  onMove(e, e.touches[0].clientX,e.touches[0].clientY); }
function onMove(e, _x, _y){
  //  console.log(e.type);
  if (!isDrawing) return;

  e.preventDefault();

  var currentPoint = { x:_x, y:_y  };
  var dist = distanceBetween(lastPoint, currentPoint);
  var angle = angleBetween(lastPoint, currentPoint);

  for (var i = 0; i < dist; i+=brushSize) {

    x = lastPoint.x + (Math.sin(angle) * i);
    y = lastPoint.y + (Math.cos(angle) * i);

    var radgrad = context.createRadialGradient(x,y,(brushSize/10),x,y,(brushSize/2));

    radgrad.addColorStop(0, 'rgba(0,0,0,.2)');
    radgrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
    radgrad.addColorStop(1, 'rgba(0,0,0,0)');

    context.fillStyle = radgrad;
    context.fillRect(x-(brushSize/2), y-(brushSize/2), brushSize, brushSize);
  }

  lastPoint = currentPoint;

  return false;
}

  //  ON UP

function onMouseUp(e){
  canvas.removeEventListener('mousemove', onMouseMove);
  onUp(e);
}
function onTouchUp(e){
  canvas.removeEventListener('touchmove', onTouchMove);
  onUp(e);
}
function onUp(e){
  //  console.log(e.type);
  e.preventDefault();
  isDrawing = false;
  let alphaRatio = getImageDataAlphaRatio(context.getImageData(goal.x,goal.y,goal.width,goal.height));
  //  document.getElementById('status').innerHTML = (100 - Math.round(alphaRatio * 100))+'%';
  console.log(alphaRatio);

  context.globalCompositeOperation = 'source-over';

  if(alphaRatio < ratioToShow)  endState();

  return false;
}

function endState(){
  canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('touchstart', onTouchDown);

  canvas.removeEventListener('mouseup', onMouseUp);
			canvas.removeEventListener('touchend', onTouchUp);
			canvas.removeEventListener('touchcancel', onTouchUp);
			canvas.removeEventListener('touchleave', onTouchUp);

  canvas.removeEventListener('mousemove', onMouseMove);
  canvas.removeEventListener('touchmove', onTouchMove);

  document.getElementById('endcard').className = 'show';
}

  //  ON LOAD INIT

window.addEventListener('load', function(){
  canvas = document.getElementById(canvasID);
  context = canvas.getContext('2d');

  context.lineJoin = context.lineCap = 'round';

  var topImg = new Image();
  topImg.addEventListener('load',function(e){
    context.drawImage(e.target,0,0,canvas.width,canvas.height);
    goal.style.display = 'block';
  });
  topImg.src = topSrc;

  image = document.getElementById(imageID);

  image.width = canvas.width = frameWidth;
  image.height = canvas.height = frameHeight;

  goal = document.getElementById(goalID);

  canvas.addEventListener('mousedown', onMouseDown);
			canvas.addEventListener('touchstart', onTouchDown);

  canvas.addEventListener('mouseup', onMouseUp);
			canvas.addEventListener('touchend', onTouchUp);
			canvas.addEventListener('touchcancel', onTouchUp);
			canvas.addEventListener('touchleave', onTouchUp);
});
*/
