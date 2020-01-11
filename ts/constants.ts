export enum Position {
    Left,
    Center,
    Right,
}

export enum State {
    Ready,
    Next,
    Prev,
    Select,
}

export const BrowserPrefixes: string[] = [
    '',         // None
    '-o-',      // Opera
    '-ms-',      // Microsoft
    '-moz-',     // Mozilla
    '-webkit-' , // Webkit
];