import {AbstractView} from './view/_abstract';

const enum Default {
	POSITION = 'beforeend',
}

function createElement<El extends Element = HTMLDivElement>(template: string) {
	const newElement = document.createElement('div');
	newElement.innerHTML = template;

	return newElement.firstElementChild as El;
}

function render(component: AbstractView, container: Element, place: InsertPosition = Default.POSITION) {
	container.insertAdjacentElement(place, component.element);
}

export {createElement, render};
