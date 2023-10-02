import Observable from '../framework/observable';
import {FILTER_TYPE, FilterType} from '../contracts/constants';

export default class FilterModel extends Observable{
	#currentFilter: FILTER_TYPE = FilterType.ALL;
	constructor () {
		super();
	}

	get filter() {
		return this.#currentFilter;
	}

	changeFilter(newFilter: FILTER_TYPE) {
		this.#currentFilter = newFilter;
		this._notify('Change', this.filter);
	}
}
