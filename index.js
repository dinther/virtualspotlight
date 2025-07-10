import {SpotLight} from './spotlight.js';

var lastTime;
var spot1;
var container = document.getElementById('container');

document.addEventListener('DOMContentLoaded', async () => {
  spot1 = new SpotLight(container);
  lastTime = performance.now();
  draw(lastTime);
}, false);

     
// Continuously update spotlight position
function draw(timeStamp) {
  let deltaTime = (lastTime - timeStamp) * 0.001;
  spot1.update(deltaTime);
  lastTime = timeStamp;
  requestAnimationFrame(draw);
}





