const MAX_GOBOS = 3;

export class SpotLight {
    #parent;
    #options = {gobo: 0, x: 0.5, y:0.5, size: 0.4, focus: 1, inertia: 2};
    #gobo = 0;
    #x;
    #y;
    #size;
    #focus = 0;
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
        this.#img = document.createElement('img');
        this.#img.classList.add('spotlight');
        this.#parent.appendChild(this.#img);
        this.#setGobo(this.#options.gobo);
    }

    #setGobo(number){
        console.log(number);
        switch(number){
            case 0: this.#img.src = 'gobos/circle.png'; break;
            case 1: this.#img.src = 'gobos/window.png'; break;
            case 2: this.#img.src = 'gobos/flowers.png'; break;
            default: this.#img.src = 'gobos/circle.png';
        }
    }


    #setLight(x, y, size){
        this.#x = x;
        this.#y = y;
        this.#size = size;
        this.#img.style.left = (this.#x*100)+'%';
        this.#img.style.top = (this.#y*100)+'%';
        this.#img.style.height = (size*100)+'%';
    }

    #handleMove(event){
        event.preventDefault();
        if (event.buttons == 1){    
            this.#target.x = event.clientX/this.#parent.offsetWidth;
            this.#target.y = event.clientY/this.#parent.offsetHeight;
        }
    }

    #handleMousewheel(event){
        if (event.ctrlKey){
            event.preventDefault();
            this.#focus = Math.min(Math.max(0, this.#focus - event.deltaY * 0.01), 100);
            if (this.#focus > 0) this.#img.style.filter = 'blur('+this.#focus+'px)';
            else this.#img.style.filter = '';
        } else if (event.shiftKey){
            event.preventDefault();
            if (event.deltaY > 0) this.#gobo = Math.min(MAX_GOBOS - 1, this.#gobo + 1); 
            if (event.deltaY < 0) this.#gobo = Math.max(0, this.#gobo - 1);
            this.#setGobo(this.#gobo);
        } else {
            event.preventDefault();
            if (event.deltaY < 0) this.#target.size *= 1.1;
            if (event.deltaY > 0) this.#target.size *= 0.9;
        }
    }

    update(deltaTime){
        if (deltaTime == 0){
            this.#setLight(this.#options.x, this.#options.y, this.#options.size);
        } else {
            let factor = deltaTime * this.#options.inertia; 
            let deltaX = this.#target.x - this.#x;
            let deltaY = this.#target.y - this.#y;
            let deltaSize = this.#target.size - this.#size;
            this.#setLight(
                this.#x - (deltaX * factor),
                this.#y - (deltaY * factor),
                this.#size - (deltaSize * factor * 0.5)
            );
        }
    }
}