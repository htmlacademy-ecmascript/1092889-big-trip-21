import {createElement} from '../render';

export abstract class AbstractView<El extends Element = HTMLElement>{
	#element: El | null = null;

	get element() {
		if (!this.#element) {
			this.#element = createElement<El>(this.template);
		}

		return this.#element;
	}

	protected abstract get template(): string

	removeElement() {
		this.#element = null;
	}
}

