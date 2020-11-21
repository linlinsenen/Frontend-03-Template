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
export class Timeline {
    constructor() {
        this[ANIMATIONS] = new Set();
        this[STARTTIME] = new Map();
    }
    start() {
        let startTime = Date.now();
        this[TICK] = () => {
            let now = Date.now();
            for (let animation of this[ANIMATIONS]) {
                let t;
                if (this[STARTTIME].get(animation) < startTime) {
                    t = now - startTime;
                } else {
                    t = now - this[STARTTIME].get(animation);
                }
                if (animation.duration < t) {
                    this[ANIMATIONS].delete(animation);
                    t = animation.duration;
                }
                animation.receive(Date.now() - startTime)
            }
            requestAnimationFrame(this[TICK]);
        }
        this[TICK]();
    }
    pause() {}
    resume() {}
    reset() {}
    add(animation, startTime) {
        if (this.arguments.length < 2) {
            startTime = Date.now();
        }
        this[ANIMATIONS].add(animation)
        this[STARTTIME].set(animation, startTime)
    }
}

export class Animation {
    constructor(object, property, startValue, endValue, duration, delay, timingFunction) {
        this.object = object;
        this.property = property;
        this.startValue = startValue;
        this.endValue = endValue;
        this.duration = duration;
        this.delay = delay;
        this.timingFunction = timingFunction;
    }
    receive(time) {
        let range = (this.endValue - this.startValue);
        this.object[this.property] = this.startValue + range * time / this.duration;
    }
}