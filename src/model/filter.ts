import Observable from '../framework/observable';
import {FilterType} from '../contracts/constants';

export default class FilterModel extends Observable{
	#currentFilter: FilterType = FilterType.ALL;
	constructor () {
		super();
	}

	get filter() {
		return this.#currentFilter;
	}

	changeFilter(newFilter: FilterType) {
		this.#currentFilter = newFilter;
		this._notify('Change', this.filter);
	}
}
