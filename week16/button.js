import {
    Component,
    createElement
} from "./framework"
import {
    enableGesture
} from './gesture';

export {
    STATE,
    ATTRIBUTE
}
from "./framework"

export class Button extends Component {
    constructor() {
        super();
    }
    render() {
        this.childontainer = <span/>
            this.root = ( <div> {
                    this.childontainer
                } </div>).render()
                return this.root
            }

        appendChild() {
            if (!this.childontainer) {
                this.render()
            }
            this.childontainer.appendChild(child)
        }
    }
}