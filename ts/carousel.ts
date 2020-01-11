import {Ajax, AjaxProjectResponseData} from "./ajax"
import {SetupVariables} from "./main";
import {Navigator} from './navigator';
import {Content} from './content';
import {ProjectData} from './model';
import {State} from './constants';
import {DotSelector} from "./selector";
import Timeout = NodeJS.Timeout;

// Main class that houses the functionality of the project carousel.
export class Carousel {
    private readonly _ajax: Ajax;
    private readonly _navigator: Navigator;
    private readonly _selector: DotSelector;
    private readonly _content: Content;
    private readonly _model: ProjectData;
    private _state: State;
    private _timer: Timeout;

    public readonly     transitionSpeed = 500;          // Speed for the transition.
    private readonly    _transitionBuffer = 300;        // Buffer to stop a transition from starting while cleanup takes place.
    public readonly     transitionEffect = 'ease-in';   // transition effect.
    public readonly     animateHeightChange = false;    // An expensive animation. Disable for better performance.
    public readonly     transitionOffset: number = 120; // Percentage of project content width. Used to set how far to slide.

    constructor(setupData: SetupVariables) {
        // Server communication object.
        this._ajax = new Ajax(setupData.ajaxUrl);

        // Holds all the project data
        this._model = new ProjectData();

        // Navigation element
        this._navigator = new Navigator(
            this,
            setupData.navigationElement,
            setupData.leftNavigationControl,
            setupData.rightNavigationControl,
            setupData.titleElement,
        );

        // Dot selector element.
        this._selector = new DotSelector(this, setupData.dotSelectorElement, setupData.selectorClassName);

        // Content slider
        this._content = new Content(this, setupData.contentElement);

        // State to control interaction.
        this._state = State.Ready;
    }

    // Access to immutable properties..
    get model(): ProjectData {
        return this._model;
    }

    get state(): State {
        return this._state;
    }

    get ready(): boolean {
        return this._state == State.Ready;
    }

    initialise(): void {
        // 1: Request data from the server.
        this._ajax.getData().then((data: AjaxProjectResponseData) => {
            // 2: populate the model with the returned data.
            return this._model.initialise(data);
        }).then(() => {
            // 3: Set the other elements up with the data.
            this._navigator.initialise();
            this._selector.initialise();
            this._content.initialise();
        }).catch((error: string) => {
            // Catches errors thrown by any of the promises in the chain.
            console.log(error);
        });
    }

    // Triggers the carousel to move to the next project
    next(): void {
        if (! this.ready) return;

        this._state = State.Next;   // Set so no other action can occur.
        this._animate();
    }

    // Triggers the carousel to move to the previous project
    prev(): void {
        if (! this.ready) return;

        this._state = State.Prev;   // Set so no other action can occur.
        this._animate();
    }

    // Triggers the carousel to display the selected project from the dot selector.
    selected(index: number): void {
        if (! this.ready) return;

        if (index == this.model.currentIndex) return;   // Do nothing if the current dot is clicked.

        if (this._timer == null) {
            this._state = State.Select; // Set so no other action can occur.

            const that = this;
            this._timer = setTimeout(function() {
                 // Resetting this allows a trigger to start another transition.
                that._state = State.Ready;

                that._timer = null;
            }, this.transitionSpeed + this._transitionBuffer);

            // Set the carousel state to the selected project.
            this.model.moveToIndex(index);
            this._content.selected();
            this._navigator.selected();
            this._selector.reset();

            // Update server with the new current project.
            this._ajax.update(this.model.current.title);
        }
    }

    // Start the actual movement transitions for each element.
    private _animate(): void {
        const that = this;

        if (this._timer == null) {
            this._timer = setTimeout(function() {
                // Reset the styles and elements.
                that._navigator.clean();
                that._content.clean();

                // Resetting this allows a trigger to start another transition.
                that._state = State.Ready;

                that._timer = null;
            }, this.transitionSpeed + this._transitionBuffer);

            // State is used to decide the direction.
            if (that._state == State.Next ) {
                this._model.moveToNext();
                this._navigator.next();
                this._content.next();
            } else {
                this._model.moveToPrev();
                this._navigator.prev();
                this._content.prev();
            }

            // Update the current dot on the dot selector.
            that._selector.reset();

            // Update server with the new current project.
            this._ajax.update(this.model.current.title);
        }
    }
}