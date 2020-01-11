# Readme

My attempt to create a javascript carousel slider.

I'm using it as a project portfolio for my website. It supports sliding left and right between projects and also
has a dot selector to skip to specific projects.

## Requires:

* NodeJS 12.x
* Typescript
* NodeJS types
* SystemJS

NodeJS will need to be installed on the system.

Typescript is installed using "sudo npm -g install typescript"

The others are defined in the package.json and can be installed by running "npm install"

## SystemJS

I'm using typescript in a manner that compiles the source to a single file that uses SystemJS to load
modules that can be used to initialise the app.

Need to use the 'named-registers.js' found in the dist/extras folder in the SystemJS module folder.

## Complilation

To compile the typescript navigate to the ts folder and type "tsc"
The tsconfig.json contains the target outfile file path and can be easily changed.

## Project Data:

The server ajax.php endpoint returns project data as a JSON object.
The data structure is as follows:

```json
{
    "current_project": 0,
    "project": []
}
```

The project array contains individual projects that are structured like this:

```json
{
    "index": 0,
    "title": "Example Project",
    "url": "http://www.example.com",
    "element": "<html><h1>Example HTML Content</h1></html>"
}
```





