import {getPlaceholderTemplate} from '../template/placeholder';
import {FilterType} from '../contracts/constants';
import AbstractView from '../framework/view/abstract-view';

class PlaceholderView extends AbstractView{
	#filterType: FilterType = FilterType.ALL;
	constructor(filterType: FilterType) {
		super();
		this.#filterType = filterType;
	}


	get template(): string {
		return getPlaceholderTemplate(this.#filterType);
	}

	removeElement() {
		super.removeElement();
	}
}

export {PlaceholderView};

