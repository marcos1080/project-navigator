import {Content} from "./content";
import {Position} from './constants';
import {Item} from "./interfaces";
import {AnimationGenerator, generateCss, generatePrefixCss} from "./generators";

interface animationData {
    from: string;
    to:   string;
    name: string;
}

// Project item for use in the content class.
export class ContentItem implements Item {
    private readonly _contentContainer: Content;
    private _position: Position;
    private readonly _projectElement: HTMLElement;
    private readonly _keyframes: HTMLElement;

    constructor(container: Content, position: Position, project: HTMLElement) {
        if (project == null) {
            throw new Error('Project cannot be null');
        }

        this. _contentContainer = container;
        this. _projectElement = project;

        this._keyframes = document.createElement('style');
        this._projectElement.append(this._keyframes);

        this.reset(position);
    }

    get element(): HTMLElement {
        return this._projectElement;
    }

    get isLeft(): boolean {
        return this._position === Position.Left;
    }

    get isCenter(): boolean {
        return this._position === Position.Center;
    }

    get isRight(): boolean {
        return this._position === Position.Right;
    }

    // Set up css data for the next transition.
    next(): void {
        switch(this._position) {
            case Position.Left:
                return;
            case Position.Center:
                this._animate({
                    from: `0`,
                    to:   `-${this._contentContainer.carousel.transitionOffset}`,
                    name: 'original-slide'
                });
                break;
            case Position.Right:
                this._animate({
                    from: `${this._contentContainer.carousel.transitionOffset}`,
                    to:   `0`,
                    name: 'new-slide'
                });
                break;
        }
    }

    // Set up css data for the next transition.
    prev(): void {
        switch(this._position) {
            case Position.Left:
                this._animate({
                    from: `-${this._contentContainer.carousel.transitionOffset}`,
                    to:   `0`,
                    name: 'new-slide'
                });
                break;
            case Position.Center:
                this._animate({
                    from: `0`,
                    to:   `${this._contentContainer.carousel.transitionOffset}`,
                    name: 'original-slide'
                });
                break;
            case Position.Right:
                return;
        }
    }

    // Remove the item from the DOM without leaving orphaned elements.
    remove(): void {
        this._keyframes.remove();
        this._projectElement.remove();
    }

    // Adjust position and css after an animation.
    reset(position: Position): void {
        this._position = position;
        this._keyframes.innerText = '';
        this._projectElement.style.cssText = '';

        if (!this.isCenter) this.setStyle();
    }

    // Perform animation.
    private _animate(data: animationData): void {
        const animation = new AnimationGenerator({
            name: data.name,
            speed: this._contentContainer.carousel.transitionSpeed,
            timing: this._contentContainer.carousel.transitionEffect,
            forwards: true,
            initial: [
                ['transform', `translateX( ${data.from}% )`]
            ],
            final: [
                ['transform', `translateX( ${data.to}% )`]
            ]
        });

        // Add to trigger the animation.
        this._projectElement.style.cssText += animation.css;
        this._keyframes.append(animation.keyframes);
    }

    // Create the css style to move the item to it's position.
    private setStyle(): void {
        // Calculate which direction to offset.
        let offset: string;
        if (this.isLeft) {
            offset = `-${this._contentContainer.carousel.transitionOffset}`;
        } else {
            offset = `${this._contentContainer.carousel.transitionOffset}`;
        }

        // Add to trigger the repositioning.
        this._projectElement.style.cssText = generateCss([
            ['position', 'absolute'],
            ['top', '0'],
            ['left', '0']
        ]) + generatePrefixCss([
            ['transform', `translateX( ${offset}% )`]
        ]);
    }
}