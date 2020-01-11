import {Carousel} from "./carousel";
import {NavigatorItem} from "./navigatorItem";
import {Position, State} from "./constants";
import {generateCss} from "./generators";

// Class to control the navigation element.
export class Navigator {
    private readonly _carousel: Carousel;
    private readonly _element: HTMLElement;

    // Link trigger elements
    private readonly _leftLink: HTMLElement;
    private readonly _rightLink: HTMLElement;

    // Original title element is removed, cleared and used for a template to clone.
    private readonly _titleTemplate: HTMLElement;

    // Movable title elements.
    private _leftTitle: NavigatorItem;
    private _centerTitle: NavigatorItem;
    private _rightTitle: NavigatorItem;

    constructor(parent: Carousel, element: HTMLElement,
                leftLink: HTMLElement, rightLink: HTMLElement,
                title: HTMLElement) {
        this._carousel = parent;
        this._element = element;
        this._leftLink = leftLink;
        this._rightLink = rightLink;
        this._titleTemplate = title;

        // Add gradient divs for fade effect.
        this._addGradientDiv(this._leftLink);
        this._addGradientDiv(this._rightLink);
    }

    get carousel(): Carousel {
        return this._carousel;
    }

    get width(): number {
        return this._element.offsetWidth;
    }

    initialise(): void {
        // Take the current title as a template.
        this._titleTemplate.innerText = ''; // Reset
        this._titleTemplate.remove();

        // Create movable title elements.
        this._createNavigationItems();

        // Add the event handlers to it.
        this._setHandlers();
    };

    // Add an item to the navigation element.
    append(navigatorItem: NavigatorItem): void {
        if (navigatorItem == null) {
            throw new Error('Object has not been initialised. Cannot add to DOM');
        }

        this._element.append(navigatorItem.element);
    }

    // Animate the next transition for the navigation elements.
    next(): void {
        this._animate(this._rightTitle);
    }

    // Animate the previous transition for the navigation element.
    prev(): void {
        this._animate(this._leftTitle);
    }

    // Animate the fade out/in transition for the dot selector.
    selected(): void {
        const fadeSpeed = this.carousel.transitionSpeed/2;

        // Fade out
        this._centerTitle.element.style.transition = `opacity ${fadeSpeed}ms`;
        this._centerTitle.element.style.opacity = '0';

        const that = this;

        setTimeout(function() {
            that._leftTitle.remove();
            that._centerTitle.remove();
            that._rightTitle.remove();

            // Create new movable title elements.
            that._createNavigationItems();

            // Fade in. Need to wrap in the delay in order for it to work. Think there's a timing issue.
            that._centerTitle.element.style.opacity = '0';
            setTimeout(function() {
                that._centerTitle.element.style.transition = `opacity ${fadeSpeed}ms ease-in`;
                that._centerTitle.element.style.opacity = '1';
            }, 50);
        }, fadeSpeed);
    }

    // Common animation function for next/prev methods.
    private _animate(clickedLink: NavigatorItem): void {
        // Set z-index of nav links so moving titles appear to go under.
        this._leftLink.style.zIndex = '10';
        this._rightLink.style.zIndex = '10';

        // Slide the current title.
        this.carousel.state === State.Next ? this._centerTitle.next() : this._centerTitle.prev();

        // Slide the next title to the current position.
        this.carousel.state === State.Next ? clickedLink.next() : clickedLink.prev();
    }

    // Reset the navigation state after a transition.
    clean(): void {
        if (this.carousel.state === State.Next) {
            // Replace the left movable title with the center one.
            this._leftTitle.remove();
            this._centerTitle.reset(Position.Left);
            this._leftTitle = this._centerTitle;

            // Replace the center title with the right one.
            this._rightTitle.reset(Position.Center);
            this._centerTitle = this._rightTitle;

            // Create a new right title and add.
            this._rightTitle = new NavigatorItem(
                this,
                Position.Right,
                <HTMLTitleElement>this._titleTemplate.cloneNode(),
                this._carousel.model.next.title);

            this._element.append(this._rightTitle.element);

        } else if (this.carousel.state === State.Prev) {
            // Replace the right title with the center one.
            this._rightTitle.remove();
            this._centerTitle.reset(Position.Right);
            this._rightTitle = this._centerTitle;

            // Replace the center title with the left one.
            this._leftTitle.reset(Position.Center);
            this._centerTitle = this._leftTitle;

            // Create a new left title and add.
            this._leftTitle = new NavigatorItem(
                this,
                Position.Left,
                <HTMLTitleElement>this._titleTemplate.cloneNode(),
                this._carousel.model.prev.title);

            this._element.append(this._leftTitle.element);
        }

        // Reset the css for all elements.
        this._element.style.cssText = '';
        this._rightLink.style.cssText = '';
        this._leftLink.style.cssText = '';
    }

    // Creates divs with a semi transparent gradient next to the navigation arrow elements.
    // Used to hide the sliding project name title elements as the approach the arrows.
    private _addGradientDiv(element: HTMLElement): void {
        const div = document.createElement('div');
        const height = element.offsetHeight;

        div.style.cssText = generateCss([
            ['display', 'inline-block'],
            ['width', `${height}px`],
            ['padding-top', `${height}px`]
        ]);

        if (element === this._leftLink) {
            div.style.cssText += generateCss([
                ['margin-left', '-6px'],
                ['background', 'linear-gradient(90deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9147465437788018) 60%, rgba(255,255,255,0) 100%)'],
            ]);
            element.append(div);
        } else {
            div.style.cssText += generateCss([
                ['margin-right', '-6px'],
                ['background', 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.9147465437788018) 40%, rgba(255,255,255,1) 100%)'],
            ]);
            element.prepend(div);
        }
    }

    // Add event handlers to trigger the transition.
    private _setHandlers(): void {
        const that = this;

        this._leftLink.addEventListener('click', function() {
            that._carousel.prev();
        });

        this._rightLink.addEventListener('click', function() {
            that._carousel.next();
        });
    }

    private _createNavigationItems(): void {
        this._leftTitle = new NavigatorItem(
            this,
            Position.Left,
            <HTMLTitleElement>this._titleTemplate.cloneNode(),
            this._carousel.model.prev.title);

        this._centerTitle = new NavigatorItem(
            this,
            Position.Center,
            <HTMLTitleElement>this._titleTemplate.cloneNode(),
            this._carousel.model.current.title);

        this._rightTitle = new NavigatorItem(
            this,
            Position.Right,
            <HTMLTitleElement>this._titleTemplate.cloneNode(),
            this._carousel.model.next.title);

        // Add the movable elements.
        this.append(this._leftTitle);
        this.append(this._centerTitle);
        this.append(this._rightTitle);
    }
}