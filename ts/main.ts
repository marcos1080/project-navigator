import {Carousel} from "./carousel";

// Definition of the data needed to be passed to set the carousel up.
export interface SetupVariables {
    ajaxUrl: string;
    navigationElement: HTMLElement;
    leftNavigationControl: HTMLElement;
    rightNavigationControl: HTMLElement;
    navigationControlTitleClassName: string;
    titleElement: HTMLElement;
    dotSelectorElement: HTMLElement;
    selectorClassName: string,
    contentElement: HTMLElement;
}

// Setup the carousel app using DOM element data passed in from the PHP code.
export class App {
    private readonly carousel: Carousel;

    constructor(setupData: SetupVariables) {
        // Test data to ensure no empty elements have been passed.
        if (setupData.ajaxUrl == null) throw new Error('Url has not been set.');
        if (setupData.navigationElement == null) throw new Error('Navigation container has not been set.');
        if (setupData.rightNavigationControl == null) throw new Error('Navigation right control has not been set.');
        if (setupData.leftNavigationControl == null) throw new Error('Navigation left control has not been set.');
        if (setupData.navigationControlTitleClassName == null) throw new Error('Navigation control title class has not been set.');
        if (setupData.titleElement == null) throw new Error('Navigation title element has not been set.');
        if (setupData.dotSelectorElement == null) throw new Error('Dot selector element has not been set.');
        if (setupData.selectorClassName == null) throw new Error('Dot selector class name has not been set.');
        if (setupData.contentElement == null) throw new Error('content container has not been set.');

        // Set up the module
        this.carousel = new Carousel(setupData);
    }

    // Populate and set up.
    start(): void {
        this.carousel.initialise();
    }
}