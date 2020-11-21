/*setInterval(()=>{

}, 16);

let tick = ()=>{
	setTimeout(tick, 16);
}
*/
const TICK = Symbol("tick");
const TICK_HANDLER = Symbol("tick-handler");
const ANIMATIONS = Symbol("animations");
const STARTTIME = Symbol("startTime");
const PAUSESTART = Symbol("pausestart");
const PAUSETIME = Symbol("pausetime");

export class Timeline {
    constructor() {
        this.state = "inited";
        this[ANIMATIONS] = new Set();
        this[STARTTIME] = new Map();
    }
    start() {
        if (this.state !== "inited") {
            return;
        }
        this.state = "started";
        this[PAUSETIME] = 0;
        let startTime = Date.now();
        this[TICK] = () => {
            let now = Date.now();
            for (let animation of this[ANIMATIONS]) {
                let t;
                if (this[STARTTIME].get(animation) < startTime) {
                    t = now - startTime - this[PAUSETIME] - animation.delay;
                } else {
                    t = now - this[STARTTIME].get(animation) - this[PAUSETIME] - animation.delay;
                }
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                if (t > 0)
                    animation.receive(t);
            }
            this[TICK_HANDLER] = requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    pause() {
        if (this.state !== "started") {
            return;
        }
        this.state = "paused";
        this[PAUSESTART] = Date.now();
        cancelAnimationFrame(this[TICK_HANDLER]);
    }
    resume() {
        if (this.state !== "paused") {
            return;
        }
        this.state = "started";
        this[PAUSETIME] += Date.now() - this[PAUSESTART];
        this[TICK]();
    }
    reset() {
        this.state = "inited";
        this.pause();
        this.startTime = Date.now();
        this[PAUSETIME] = 0;
        this[ANIMATIONS] = new Set();
        this[STARTTIME] = new Map();
        this[PAUSESTART] = 0;
        this[TICK_HANDLER] = null;
    }
    add(animation, startTime) {
        if (this.arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation)
        this[STARTTIME].set(animation, startTime)
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction, template) {
        timingFunction = timingFunction || (v => v);
        template = template || (v => v);
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
        this.template = template
    }
    receive(time) {
        let range = (this.endValue - this.startValue);
        let progress = this.timingFunction(time / this.duration);
        this.object[this.property] = this.template(this.startValue + range * progress);
    }
}