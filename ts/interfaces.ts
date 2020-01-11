import {Position} from './constants';

export interface Item {
    element: HTMLElement;
    isLeft: boolean;
    isCenter: boolean;
    isRight: boolean;
    next(): void;
    prev(): void;
    remove(): void;
    reset(position: Position): void;
}