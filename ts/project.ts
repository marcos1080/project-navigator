// Class to hold project data in the model.
export class Project {
    private readonly _title: string;
    private readonly _url: string;
    private readonly _element: HTMLElement;
    private _initialised: boolean;
    private _imagesCount: number;
    private _imagesLoaded: number;

    constructor(title: string, url: string, element: HTMLElement) {
        this._title = title;
        this._url = url;
        this._element = element;
        this._initialised = false;

        // Used to see if the project images have been loaded.
        this._imagesCount = 0;
        this._imagesLoaded = 0;
    }

    get title(): string {
        return this._title;
    };

    get url(): string {
        return this._url;
    };

    get element(): HTMLElement {
        return this._element;
    };

    // Are all the images loaded.
    get ready(): boolean {
        if (this._initialised) {
            return true;
        }

        if( this._imagesCount === this._imagesLoaded ) {
            this._initialised = true;
            return true;
        } else {
            this._initialised = false;
            return false;
        }
    };

    set imageCount(count: number) {
        if (count < 0) {
            throw new Error('Image count cannot be less than 0!');
        }

        this._imagesCount = count;
    }

    // Increment the image loaded variable. Used for checking if the project state is ready.
    imageLoaded() {
        if( this._imagesCount > this._imagesLoaded ) {
            this._imagesLoaded ++;
        } else {
            if (!this._initialised) {
                this._initialised = true;
            }
        }
    }
}