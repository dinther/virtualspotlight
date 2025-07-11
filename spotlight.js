const MAX_GOBOS = 13;

export class SpotLight {
    #parent;
    #options = {gobo: 0, x: 0.5, y:0.5, size: 0.4, tilt: 0, focus: 1, inertia: 2, spinRate: 20};
    #gobo = 0;
    #x;
    #y;
    #size;
    #tilt = 0;
    #angle = 0;
    #focus = 0;
    #hue = 0;
    #sat = 0.5;
    #blurfilter = '';
    #huefilter = '';
    #satfilter = '';
    #translate = 'translate(-50%, -50%)';
    #rotateX = '';
    #rotate = '';
    #img;
    #target;
    constructor(parent, options) {
        this.#parent = parent;
        this.#parent.addEventListener('pointermove', e=>{
            this.#handleMove(e);
        });
        this.#parent.addEventListener('mousewheel', e=>{
            this.#handleMousewheel(e);
        });
        Object.assign(this.#options, options);
        this.#target = {x:this.#options.x, y:this.#options.y, size: this.#options.size, focus: this.#options.focus};
        this.#tilt = this.#options.tilt;
        this.#rotateX = this.#options.tilt !=0? ' rotateX('+this.#tilt+'deg) ' : ' ';
        this.#img = document.createElement('img');
        this.#img.classList.add('spotlight');
        this.#parent.appendChild(this.#img);
        this.#setGobo(this.#options.gobo);
    }

    #setGobo(number){
        console.log(number);
        switch(number){
            case 0: this.#img.src = 'gobos/white_circle.png'; break;
            case 1: this.#img.src = 'gobos/warm_white_circle.png'; break;
            case 2: this.#img.src = 'gobos/red_circle.png'; break;
            case 3: this.#img.src = 'gobos/light_red_circle.png'; break;
            case 4: this.#img.src = 'gobos/magenta_circle.png'; break;
            case 5: this.#img.src = 'gobos/light_magenta_circle.png'; break;    
            case 6: this.#img.src = 'gobos/blue_circle.png'; break;
            case 7: this.#img.src = 'gobos/light_blue_circle.png'; break;                        
            case 8: this.#img.src = 'gobos/window.png'; break;
            case 9: this.#img.src = 'gobos/fan.png'; break;
            case 10: this.#img.src = 'gobos/flowers.png'; break;
            case 11: this.#img.src = 'gobos/spots.png'; break;
            case 12: this.#img.src = 'gobos/universe.png'; break;
            default: this.#img.src = 'gobos/white_circle.png';
        }
    }


    #setLight(x, y, size, angle){
        this.#x = x;
        this.#y = y;
        this.#size = size;
        this.#angle = angle;
        this.#img.style.left = (this.#x*100)+'%';
        this.#img.style.top = (this.#y*100)+'%';
        this.#img.style.height = (size*100)+'%';
        this.#rotate = this.#angle != 0? 'rotate('+this.#angle+'deg) ' : '';
        this.#img.style.transform = this.#translate + this.#rotateX + this.#rotate; 
    }

    #handleMove(event){
        event.preventDefault();
        if (event.buttons == 1){    
            this.#target.x = event.clientX/this.#parent.offsetWidth;
            this.#target.y = event.clientY/this.#parent.offsetHeight;
        }
    }

    #setFilter(){
        this.#img.style.filter = this.#blurfilter + ' ' + this.#huefilter + ' ' + this.#satfilter;
    }

    #handleMousewheel(event){
        if (event.altKey && event.shiftKey){
            event.preventDefault();
            this.#sat = Math.max(0, Math.min(1, this.#sat - event.deltaY * 0.0002));
            if (this.#sat != 0.5) this.#satfilter = 'saturate('+this.#sat+')';
            else this.#satfilter = '';
            this.#setFilter();
        } else if (event.ctrlKey && event.shiftKey){
            event.preventDefault();
            this.#tilt = Math.max(-90, Math.min(90, this.#tilt - event.deltaY * 0.01));
            this.#rotateX = this.#tilt !=0? ' rotateX('+this.#tilt+'deg) ' : ' ';
        } else if (event.ctrlKey){
            event.preventDefault();
            this.#focus = Math.min(Math.max(0, this.#focus - event.deltaY * 0.01), 100);
            if (this.#focus > 0) this.#blurfilter = 'blur('+this.#focus+'px)';
            else this.#blurfilter = '';
            this.#setFilter();
        } else if (event.shiftKey){
            event.preventDefault();
            if (event.deltaY > 0) this.#gobo = Math.min(MAX_GOBOS - 1, this.#gobo + 1); 
            if (event.deltaY < 0) this.#gobo = Math.max(0, this.#gobo - 1);
            this.#setGobo(this.#gobo);
        } else if (event.altKey){
            event.preventDefault();
            this.#hue = this.#hue - event.deltaY * 0.1;
            while(this.#hue > 360) this.#hue -= 360;
            while(this.#hue < 0) this.#hue += 360;
            if (this.#hue != 0) this.#huefilter = 'hue-rotate('+this.#hue+'deg)';
            else this.#huefilter = '';
            this.#setFilter();
        } else {
            event.preventDefault();
            if (event.deltaY < 0) this.#target.size *= 1.1;
            if (event.deltaY > 0) this.#target.size *= 0.9;
        }
    }

    update(deltaTime){
        if (deltaTime == 0){
            this.#setLight(this.#options.x, this.#options.y, this.#options.size, this.#angle);
        } else {
            let angle = this.#angle + (this.#options.spinRate * deltaTime);
            while(angle > 360) angle -= 360;
            while(angle < 0) angle += 360;
            let factor = deltaTime * this.#options.inertia; 
            let deltaX = this.#target.x - this.#x;
            let deltaY = this.#target.y - this.#y;
            let deltaSize = this.#target.size - this.#size;
            this.#setLight(
                this.#x - (deltaX * factor),
                this.#y - (deltaY * factor),
                this.#size - (deltaSize * factor * 0.5),
                angle
            );
        }
    }
}