import AbstractView from '../framework/view/abstract-view';
import {getErrorTemplate} from '../template/error-load';

class ErrorView extends AbstractView<HTMLElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getErrorTemplate();
	}
}

export {ErrorView};
