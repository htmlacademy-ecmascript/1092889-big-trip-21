/*
* <!--
  Значение отображаемого текста зависит от выбранного фильтра:
	* Everything – 'Click New Event to create your first state'
	* Past — 'There are no past events now';
	* Present — 'There are no present events now';
	* Future — 'There are no future events now'.
-->
* */
import {getPlaceholderTemplate} from '../template/placeholder';
import {FILTER_TYPE} from '../contracts/constants';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

class PlaceholderView extends AbstractStatefulView<FILTER_TYPE>{
	#filterType: FILTER_TYPE = 'everything';
	constructor(filterType: FILTER_TYPE) {
		super();
		this.#filterType = filterType;
		this._setState(this.#filterType);
	}

	updateText = (filter: FILTER_TYPE) => {
		this.updateElement(filter);
	};


	get template(): string {
		return getPlaceholderTemplate(this._state);
	}

	removeElement() {
		super.removeElement();
	}
}

export {PlaceholderView};

