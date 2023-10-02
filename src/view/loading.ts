import AbstractView from '../framework/view/abstract-view';
import {getLoadingTemplate} from '../template/loading';

class LoadingView extends AbstractView<HTMLElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getLoadingTemplate();
	}
}

export {LoadingView};
