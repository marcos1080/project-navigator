import {Navigator} from "./navigator";
import {Position} from "./constants";
import {AnimationGenerator, generateCss} from "./generators";
import {Item} from "./interfaces";

interface TransitionData {
    css: [string, string][];
    animation: AnimationData;
}

interface AnimationData {
    name: string;
    initial: [string, string][],
    final: [string, string][];
}

export class NavigatorItem implements Item {
    private readonly _navigator: Navigator;
    private readonly _element: HTMLTitleElement;
    private readonly  _keyframes: HTMLStyleElement;
    private _position: Position;

    constructor(parent: Navigator, position: Position, element: HTMLTitleElement, title: string) {
        this._navigator = parent;
        this._element = element;
        this._element.innerText = title;
        this._keyframes = document.createElement('style');
        this._element.append(this._keyframes);

        this.reset(position);
    }

    get element(): HTMLElement {
        return this._element;
    }

    get isLeft(): boolean {
        return this._position === Position.Left ? true : false;
    }

    get isCenter(): boolean {
        return this._position === Position.Center ? true : false;
    }

    get isRight(): boolean {
        return this._position === Position.Right ? true : false;
    }

    // Set up next transition
    next(): void {
        if (this.isLeft) return;

        if (this.isCenter) {
            const offset = this._navigator.width + this._element.offsetWidth / 2;

            this._animate({
                css: null,
                animation: {
                    name: 'center-title-left',
                    initial: [
                        ['transform', 'translateX(-50%)']
                    ],
                    final: [
                        ['transform', `translateX(-${offset}px)`]
                    ]
                }
            });
        } else {
            const offset = this._navigator.width - this._element.offsetWidth / 2;

            this._animate({
                css: [
                    ['position', 'absolute']
                ],
                animation: {
                    name: 'right-title-left',
                    initial: [
                        ['transform', `translateX(${offset}px)`]
                    ],
                    final: [
                        ['transform', 'translateX(-50%)']
                    ]
                }
            });
        }
    };

    // Set up previous transition
    prev(): void {
        if (this.isRight) return;

        if (this.isCenter) {
            const offset = this._navigator.width - this._element.offsetWidth / 2;

            this._animate({
                css: null,
                animation: {
                    name: 'center-title-right',
                    initial: [
                        ['transform', 'translateX(-50%)']
                    ],
                    final: [
                        ['transform', `translateX(${offset}px)`]
                    ]
                }
            });
        } else {
            const offset = this._navigator.width + this._element.offsetWidth / 2;

            this._animate({
                css: [
                    ['position', 'absolute']
                ],
                animation: {
                    name: 'left-title-right',
                    initial: [
                        ['transform', `translateX(-${offset}px)`]
                    ],
                    final: [
                        ['transform', 'translateX(-50%)']
                    ]
                }
            });
        }
    };

    hide() :void {
        this._element.style.display = 'none';
    }

    // Cleanly remove from DOM.
    remove(): void {
        this._keyframes.remove();
        this._element.remove();
    };

    // Reset position and css after animation.
    reset(position: Position): void {
        this._position = position;
        this._keyframes.innerText = '';
        this._element.style.cssText = '';

        if (!this.isCenter) this.hide();
    }

    // Animate transition.
    private _animate(data: TransitionData): void {
        this._element.style.cssText = generateCss([
            ['white-space', 'nowrap'],
        ]) + generateCss(data.css);

        const animation = new AnimationGenerator({
            name: data.animation.name,
            speed: this._navigator.carousel.transitionSpeed,
            timing: this._navigator.carousel.transitionEffect,
            forwards: true,
            initial: data.animation.initial,
            final: data.animation.final
        });

        this._keyframes.append(animation.keyframes);
        this._element.style.cssText += animation.css;
    }
}