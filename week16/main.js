import {
    Component,
    createElement
} from "./framework.js"
import {
    Carousel
} from "./carousel.js"
import {
    Timeline,
    Animation
} from "./animation.js"

let d = [
    'n个图片链接'
]
let a = < Carousel src = {
    d
}
/>
a.mountTo(document.body);
let tl = new Timeline();
tl.add(new Animation({}, "a", 0, 100, 1000, null));
tl.start();
//document.body.appendChild(a);