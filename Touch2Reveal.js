/*
  <img id="bottom" src="after.png" />
  <canvas id="top"></canvas>
*/

window.Touch2Reveal = function(root = document.getElementById('Touch2Reveal'),topSrc,bottomSrc,options={
  brushSize:window.innerWidth / 20,
  softBrush:true,
  ratioToShow:.5,
  onReveal:function(){}
}){

  if(!root) return false;

    //  INIT

  var init = function(){
    root.appendChild(bottom);

    canvas.width = top.width;
    canvas.height = top.height;

    context.drawImage(top,0,0,top.width,top.height);

    if(!options.revealTarget) options.revealTarget = {
      x:0,
      y:0,
      width:canvas.width,
      height:canvas.height
    }
  }

  this.reset = function(){
    context.drawImage(top,0,0,top.width,top.height);
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

    if(options.softBrush == false){
      context.beginPath();
      context.lineWidth=options.brushSize;
      context.moveTo(lastPoint.x,lastPoint.y);
    }

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

    if(options.softBrush == false){
      context.lineTo(currentPoint.x,currentPoint.y);
      context.stroke();
    }else{
      for (var i = 0; i < dist; i+=options.brushSize) {

        x = lastPoint.x + (Math.sin(angle) * i);
        y = lastPoint.y + (Math.cos(angle) * i);

        var radgrad = context.createRadialGradient(x,y,(options.brushSize/10),x,y,(options.brushSize/2));

        radgrad.addColorStop(0, 'rgba(0,0,0,.2)');
        radgrad.addColorStop(0.5, 'rgba(0,0,0,0.1)');
        radgrad.addColorStop(1, 'rgba(0,0,0,0)');

        context.fillStyle = radgrad;
        context.fillRect(x-(options.brushSize/2), y-(options.brushSize/2), options.brushSize, options.brushSize);
      }
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
    let alphaRatio = getImageDataAlphaRatio(context.getImageData(options.revealTarget.x,options.revealTarget.y,options.revealTarget.width,options.revealTarget.height));

    context.globalCompositeOperation = 'source-over';

    if(alphaRatio < options.ratioToShow)  options.onReveal();

    return false;
  }

    //  CONFIG

  if(!options.brushSize)  options.brushSize = window.innerWidth / 20;
  if(!options.softBrush)  options.softBrush = true;
  if(!options.ratioToShow)  options.ratioToShow = .5;
  if(!options.onReveal)  options.onReveal = function(){};

  const canvas = document.createElement('canvas');
  root.appendChild(canvas);

  const context = canvas.getContext('2d');
  if(options.softBrush == false)  context.lineJoin = context.lineCap = 'round';

  const top = document.createElement('img');
  top.addEventListener('load', imageQueue);
  top.src = topSrc;

  const bottom = document.createElement('img');
  bottom.addEventListener('load', imageQueue);
  bottom.src = bottomSrc;

  canvas.addEventListener('mousedown', onMouseDown);
  canvas.addEventListener('touchstart', onTouchDown);
  canvas.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('touchend', onTouchUp);
  canvas.addEventListener('touchcancel', onTouchUp);
  canvas.addEventListener('touchleave', onTouchUp);

    //  SHORTCUTS

  var lastPoint;
}
