import {Project} from './project';
import {AjaxProjectResponseData} from './ajax';

// Model class to hold the project data retrieved from the server.
export class ProjectData {
    private readonly _projects :Project[];
    private _currentIndex: number;

    constructor() {
        this._projects = [];
    }

    // Used to see if all the images have been loaded.
    get ready(): boolean {
        if (this._projects == null) {
            return false;
        }

        for (let project of this._projects) {
            if (!project.ready) {
                return false;
            }
        }

        return true;
    }

    initialise(projectData: AjaxProjectResponseData) {
        this._currentIndex = projectData.current_project;
        const that = this;

        return new Promise(function(resolve, reject) {
            for (let project of projectData.projects) {
                // Create a new DOM element from the element string.
                const doc = new DOMParser().parseFromString(project.element, 'text/html');
                const element = <HTMLElement>doc.body.firstChild;

                // Create project and add to array.
                const newProject = new Project(project.title, project.url, element);
                that._projects.push(newProject);

                // Project will only be initialised once the images have loaded.
                const images = element.getElementsByTagName('img');

                if (images.length) {
                    newProject.imageCount = images.length;

                    for (let i:number = 0; i < images.length; i++) {
                        // Once the image is loaded check if the model is ready.

                        // Not sure why but the onload event is not being called on the provided element.
                        // Creating a temp image for each to trigger it.
                        const image = new Image();
                        image.onload = () => {
                            newProject.imageLoaded();

                            if (newProject.ready && that.ready) {
                                resolve();
                            }
                        };

                        image.onerror = () => {
                            reject();
                        };

                        image.src = images[i].src;
                    }
                } else {
                    if (newProject.ready && that.ready) {
                        resolve();
                    }
                }
            }
        });
    }

    // Return the next project
    get next(): Project {
        return this.isEmpty ? null : this._projects[this.nextIndex];
    }

    // Return the index of the next project.
    get nextIndex(): number {
        if (this._currentIndex == null) {
            throw new Error('project data not initialised');
        }

        let index = this._currentIndex + 1;
        /* The index starts from 0 not 1. If the next index equals count then it
         * is the first project and needs to be reset to 0.
         */
        if( index === this.count ) {
            index = 0;
        }

        return index;

    }

    // Return the previous project.
    get prev(): Project {
        return this.isEmpty ? null : this._projects[this.prevIndex];
    }

    // Return the index of the previous project.
    get prevIndex(): number {
        if (this._currentIndex == null) {
            throw new Error('project data not initialised');
        }

        let index = this._currentIndex - 1;
        /* The index starts from 0 not 1. If the next index is less than 0 then
         * the index needs to be set to the last possible index.
         */
        if( index < 0 ) {
            index = this.count - 1;
        }

        return index;

    }

    // Return the current project
    get current(): Project {
        return this.isEmpty ? null : this._projects[this.currentIndex];
    }

    // Return the index of the current project.
    get currentIndex(): number {
        if (this._currentIndex == null) {
            throw new Error('project data not initialised');
        }

        return this._currentIndex;
    }

    get isEmpty(): boolean {
        return this.count == 0;
    }

    get count(): number {
        return this._projects.length;
    }

    moveToNext() {
        this._currentIndex = this.nextIndex;
    }

    moveToPrev() {
        this._currentIndex = this.prevIndex;
    }

    moveToIndex(index: number): void {
        if (! this.hasIndex(index)) throw new Error('Model: Index is not valid.');

        this._currentIndex = index;
    }

    // Check to see if a provided index is valid.
    hasIndex(index: number): boolean {
        return !(index < 0 || index >= this.count);
    }
}