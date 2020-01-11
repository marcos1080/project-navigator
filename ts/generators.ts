import {BrowserPrefixes} from "./constants";

export interface AnimationData {
    name: string;
    speed: number;
    timing: string;
    forwards: boolean;
    initial: [string, string][];
    final: [string, string][];
}

// Helper methods for simplifying creating css rules and keyframes using browser prefixes.
export class AnimationGenerator {
    private readonly _css: string;
    private readonly _keyframes: string;
    static readonly prefixProperties: string[] = ['transform'];

    constructor(data: AnimationData) {
        if (data.name == null || data.speed == null || data.initial == null || data.final == null) {
            throw new Error('AnimationGenerator: Required data is missing.');
        }

        this._css = '';
        this._keyframes = '';

        for (let prefix of BrowserPrefixes) {
            // Create css text.
            this._css += `${prefix}animation: ${data.name} ${data.speed}ms`;
            if (data.timing != null) this._css += ` ${data.timing}`;
            if (data.forwards != null && data.forwards) this._css += ` forwards`;
            this._css += ';';

            // Create keyframes text.
            this._keyframes += `@${prefix}keyframes ${data.name} { 
                0% {
                    ${this._properties(data.initial, prefix)}
                } 
                100% {
                    ${this._properties(data.final, prefix)}
                } 
            }\n`;
        }
    }

    get css(): string {
        return this._css;
    }

    get keyframes(): string {
        return this._keyframes;
    }

    private _properties(properties: [string, string][], prefix: string): string {
        let propertyString = ' ';

        for (let property of properties) {
            if (AnimationGenerator.prefixProperties.includes(property[0])) propertyString += prefix;
            propertyString += `${property[0]}: ${property[1]};\n`;
        }

        return propertyString;
    }
}

// Take an array of tuples and create a string of css styles.
export function generateCss(properties: [string, string][]): string {
    if (properties == null) return;

    let cssText = '';
    for (let property of properties) {
        cssText += `${property[0]}: ${property[1]}; `;
    }
    return cssText;
}

// Same as above but add browser specific prefixes to them.
export function generatePrefixCss(properties: [string, string][]): string {
    if (properties == null) return;

    let cssText = '';
    for (let prefix of BrowserPrefixes) {
        for (let property of properties) {
            cssText += `${prefix}${property[0]}: ${property[1]}; `;
        }
    }

    return cssText;
}
