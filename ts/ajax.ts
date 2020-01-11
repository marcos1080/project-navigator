// Methods for the ajax call.
enum Method {
    Post = 'POST',
    Get = 'GET'
}

// Expected return data from the server for the getData method.
export interface AjaxProjectResponseData {
    current_project: number;
    projects: AjaxProjectItem[];
}

// Data about a single project.
export interface AjaxProjectItem {
    index: number;
    title: string;
    url: string;
    element: string;
}

// Class used for sending and receiving data from the server.
export class Ajax {
    private readonly _url: string;

    constructor(url: string) {
        this._url = url;
    }

    // Request the project data from the server.
    getData(): Promise<AjaxProjectResponseData> {
        const xhttp = this._buildXMLHttpRequest(Method.Post);

        return new Promise(function(resolve, reject) {
            xhttp.onreadystatechange = function() {
                if(this.readyState == 4) {
                    if (this.status == 200) {
                        try {
                            // If the response text is not a json object an error is thrown.
                            resolve(JSON.parse(this.responseText));
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        // The server response is not 'OK'.
                        reject(this.responseText);
                    }
                }
            };

            xhttp.send('projects');
        });
    }

    // Send data to the server. THis is used to update the current project index.
    update(data: string): void {
        const xhttp = this._buildXMLHttpRequest(Method.Post);

        // xhttp.onreadystatechange = function() {
        //     if(this.readyState == 4) {
        //         if (this.status != 200) {
        //             console.log(this.responseText);
        //         }
        //     }
        // };

        xhttp.send(`update=${data}`);
    }

    // Create an object to make the request.
    private _buildXMLHttpRequest(method: Method) {
        const xhttp = new XMLHttpRequest();
        xhttp.open(method, this._url);
        xhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        return xhttp;
    }
}
