import {Carousel} from "./carousel";
import {ContentItem} from './contentItem';
import {Position, State} from "./constants";
import {AnimationGenerator} from "./generators";


export class Content {
    private readonly _carousel: Carousel;
    private readonly _element: HTMLElement;
    private _left: ContentItem;
    private _center: ContentItem;
    private _right: ContentItem;
    private _keyframes: HTMLElement;

    constructor(parent: Carousel, element: HTMLElement) {
        this._carousel = parent;
        this._element = element;
    }

    get carousel(): Carousel {
        return this._carousel;
    }

    initialise(): void {
        // Shouldn't happen unless the initialise function is called more than once.
        if (this._left != null || this._center != null || this._right != null) {
            throw new Error('There is already data present');
        }

        // Remove current items.
        while (this._element.firstChild)
            this._element.removeChild(this._element.firstChild);

        // Must add keyframes after emptying div.
        this._keyframes = document.createElement('style');
        this._element.append(this._keyframes);

        // Create the movable project elements and add to the DOM.
        this._createContentItems();
    }

    // Helper function for tidier code.
    append(projectItem: ContentItem): void {
        if (projectItem == null) {
            throw new Error('Object has not been initialised. Cannot add to DOM');
        }

        this._element.append(projectItem.element);
    }

    // Trigger the animations for the project elements.
    next(): void {
        this._left.next();
        this._center.next();
        this._right.next();

        // Resize is optional. Triggered if the setting is set to true.
        if (this.carousel.animateHeightChange) this.resize(this._right.element.clientHeight);
    }

    prev(): void {
        this._left.prev();
        this._center.prev();
        this._right.prev();

        if (this.carousel.animateHeightChange) this.resize(this._left.element.clientHeight);
    }

    // animation for dot selector.
    selected(): void {
        const fadeSpeed = this.carousel.transitionSpeed/2;

        // Fade out
        this._center.element.style.transition = `opacity ${fadeSpeed}ms`;
        this._center.element.style.opacity = '0';

        const that = this;

        setTimeout(function() {
            that._left.remove();
            that._center.remove();
            that._right.remove();

            // Create the replacement movable project elements and add to the DOM.
            that._createContentItems();

            // Fade in. Need to wrap in the delay in order for it to work. Think there's a timing issue.
            that._center.element.style.opacity = '0';
            setTimeout(function() {
                that._center.element.style.transition = `opacity ${fadeSpeed}ms ease-in`;
                that._center.element.style.opacity = '1';
            }, 50);
        }, fadeSpeed);
    }

    // Animate the content container resize effect. Expensive animation.
    resize(newHeight: number): void {
        const animation = new AnimationGenerator({
            name: 'resize',
            speed: this.carousel.transitionSpeed,
            timing: this.carousel.transitionEffect,
            forwards: true,
            initial: [
                ['height', `${this._element.clientHeight}px`]
            ],
            final: [
                ['height', `${newHeight}px`]
            ]
        });

        // Add styles and keyframes to the DOM to trigger effect.
        this._element.style.cssText += animation.css;
        this._keyframes.append(animation.keyframes);
    }

    // Clean up the elements after an animation.
    clean(): void {
        if (this.carousel.state === State.Next) {
            // Replace the left item with the center one.
            this._left.remove();
            this._center.reset(Position.Left);
            this._left = this._center;

            // Replace the center item with the right one.
            this._right.reset(Position.Center);
            this._center = this._right;

            // Create a new right item and attach to DOM.
            this._right = new ContentItem(
                this,
                Position.Right,
                this._carousel.model.next.element);
            this.append(this._right);

        } else if (this.carousel.state === State.Prev) {
            // Replace the right item with the center one.
            this._right.remove();
            this._center.reset(Position.Right);
            this._right = this._center;

            // Replace the center item with the left one.
            this._left.reset(Position.Center);
            this._center = this._left;

            // Create a new left item and attach to DOM.
            this._left = new ContentItem(
                this,
                Position.Left,
                this._carousel.model.prev.element);
            this.append(this._left);
        }

        // Remove all styles and keyframes for this content container.
        this._element.style.cssText = '';
        this._keyframes.innerText = '';
    }

    private _createContentItems(): void {
        // Create the movable project elements and add to the DOM.
        this._left = new ContentItem(
            this,
            Position.Left,
            this._carousel.model.prev.element);

        this._center = new ContentItem(
            this,
            Position.Center,
            this._carousel.model.current.element);

        this._right = new ContentItem(
            this,
            Position.Right,
            this._carousel.model.next.element);

        this.append(this._left);
        this.append(this._center);
        this.append(this._right);
    }
}