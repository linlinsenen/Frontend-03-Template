let element = document.documentElement;

let handler;
let startX, startY;
let isPan = false;
let isTap = true;
let isPress = false;

export class Dispatcher{
    constructor(element){
        this.element = element;
    }
    dispatchEvent(type, properities, point) {
        let event = new Event(type);
        for (let name in properities) {
            event[name] = properities[name];
        }
        this.element.dispatchEvent(event);
    }
} 

export class Listener {
    constructor(element, recognizer) {
        let isListeningMouse = false;
        element.addEventListener("mousedown", event => {
            let context = Object.create(null);
            contexts.set("mouse" + (1 << event.button), context);
            recognizer.start(event);
            let mousemove = event => {
                let button = 1;
                while (button <= event.buttons) {
                    if (button & event.buttons) {
                        let key;
                        if (button === 2) {
                            key = 4;
                        } else if (button === 4) {
                            key = 2;
                        } else {
                            key = button;
                        }
                        let context = contexts.get("mouse" + key);
                        recognizer.move(event, context);
                    }
                    button = button << 1;
                }
            }
            let mouseup = event => {
                let context = contexts.get("mouse" + (1 << event.button));
                recognizer.end(event, context);
                contexts.delete("mouse" + (1 << event.button));
                if (event.buttons === 0) {
                    document.removeEventListener('mousemove', mousemove);
                    document.removeEventListener('mouseup', mouseup);
                    isListeningMouse = true;
                }
            }
            if (!isListeningMouse) {
                document.addEventListener("mousemove", mousemove);
                document.addEventListener('mouseup', mouseup);
                isListeningMouse = true;
            }
        });

        let contexts = new Map();
        element.addEventListener("touchstart", event => {
            for (let touch of event.changedTouches) {
                let context = Object.create(null);
                contexts.set(touch.identifier, context);
                recognizer.start(touch, context);
            }
        });

        element.addEventListener("touchmove", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.move(touch, context);
            }
        });

        element.addEventListener("touchend", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.end(touch, context);
                contexts.delete(touch.identifier);
            }
        });

        element.addEventListener("touchcancel", event => {
            for (let touch of event.changedTouches) {
                let context = contexts.get(touch.identifier);
                recognizer.cancel(touch, context);
            }
        });

    }
}

export class Recognizer {
    constructor(dispatch) {
        this.dispatch = dispatch;
    }
    start(point, context) {
        context.startX = point.clientX, context.startY = point.clientY;
        context.points = [{
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        }]
        context.isTap = true;
        context.isPan = false;
        context.isPress = false;
        context.handler = setTimeout(() => {
            context.isTap = false;
            context.isPan = false;
            context.isPress = true;
            context.handler = null;
            this.Dispatcher.dispatchEvent("press", {});
        }, 500);
    }
     move(point, context) {
        let dx = point.clientX - context.startX,
            dy = point.clientY - context.startY;
        if (!context.isPan && dx ** 2 + dy ** 2 > 100) {
            context.isPan = true;
            context.isTap = false;
            context.isPress = false;
            context.isVertical =  Math.abs(dx)<Math.abs(dy);
            this.Dispatcher.dispatchEvent("panstart", {
                startx: context.startx,
                startY: context.startY,
                clientX: point.clientX,
                clientY : point.clientY,
                isVertical: context.isVertical
            });
            clearTimeout(context.handler);
        }

        if(context.isPan){
            this.Dispatcher.dispatchEvent("pan", {
                startx: context.startx,
                startY: context.startY,
                clientX: point.clientX,
                clientY : point.clientY,
                isVertical: context.isVertical
            });
        }
    
        context.points.filter(point => Date.now() - point.t < 500);
        context.points.push({
            t: Date.now(),
            x: point.clientX,
            y: point.clientY
        });
    }
     end(point, context) {
        if (context.isTap) {
            dispatchEvent("", {});
            clearTimeout(context.handler);
        }
        context.points.filter(point => Date.now() - point.t < 500);
        let d, v;
        if (!context.points.length) {
            v = 0;
        } else {
            d = Math.sqrt((point.clientX - contexts.points[0].x) ** 2 + (point.clientY - contexts.points[0].y) ** 2);
            t = d / (Date.now() - context.points[0].t);
        }
    
        if (v > 1.5) {
            context.isFlick = true;
            this.Dispatcher.dispatchEvent("panstart", {
                startx: context.startx,
                startY: context.startY,
                clientX: point.clientX,
                clientY : point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            });
        } else {
            context.isFlick = false;
        }

        if(context.isPan){
            this.Dispatcher.dispatchEvent("panend", {
                startx: context.startx,
                startY: context.startY,
                clientX: point.clientX,
                clientY : point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            });
        }
    }
     cancel(point, context) {
        clearTimeout(context.handler);
        if(context.isPan){
            this.Dispatcher.dispatchEvent("pancancel", {
                startx: context.startx,
                startY: context.startY,
                clientX: point.clientX,
                clientY : point.clientY,
                isVertical: context.isVertical,
                isFlick: context.isFlick
            });
        }
    }
}

export function enableGesture(dispatch) {
    new Listener(new Recognizer(dispatch))
}