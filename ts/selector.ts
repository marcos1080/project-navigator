import {Carousel} from "./carousel";

// Control the Dot Selector element.
export class DotSelector {
    private readonly _carousel: Carousel;
    private readonly _element: HTMLElement;
    private readonly _currentClassName: string;

    constructor(carousel: Carousel, element: HTMLElement, currentClassName: string) {
        this._carousel = carousel;
        this._element = element;
        this._currentClassName = currentClassName;
    }

    initialise(): void {
        const dots = this._element.getElementsByTagName('li');
        const that = this;

        // Add event click handler to each of the dots.
        for (let key = 0; key < dots.length; key++) {
            dots[key].addEventListener('click', function() {
                // index of the dot is saved in the html data attribute.
                that._carousel.selected(parseInt(this.dataset.index));
            });
        }
    }

    // Update the current dot if the current project is changed.
    reset(): void {
        const currentDot = <HTMLElement>this._element.getElementsByClassName(this._currentClassName)[0];
        currentDot.classList.remove(this._currentClassName);
        const newCurrent = this._element.querySelector(
            `[data-index='${this._carousel.model.currentIndex}']`);
        newCurrent.classList.add(this._currentClassName);
    }
}