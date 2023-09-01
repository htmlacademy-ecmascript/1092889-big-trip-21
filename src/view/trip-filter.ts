import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripFilterTemplate} from '../template/trip-filter';
import {FILTER_TYPE} from '../contracts/constants';

class TripFilterView extends AbstractStatefulView<HTMLFormElement>{
	#filterOptions: HTMLInputElement[] = [];
	#updateFilter: (value: FILTER_TYPE) => void;
	constructor(updateFilter: (value: FILTER_TYPE) => void) {
		super();
		this.#updateFilter = updateFilter;
		this.initHandlers();
	}

	initHandlers = () => {
		this.#filterOptions = Array.from(this.element!.querySelectorAll('.trip-filters__filter-input'));
		this.#filterOptions.map((element) => element.addEventListener('change', this.#filterHandler));
	};

	#filterHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		const previousTargetIndex = this.#filterOptions.findIndex((element) => element.disabled);
		if(this.#filterOptions[previousTargetIndex] === target) {
			return;
		}
		const currentTargetIndex = this.#filterOptions.findIndex((element) => element.value === target.value);
		this.#toggleFilterOption(this.#filterOptions[previousTargetIndex]);
		this.#toggleFilterOption(this.#filterOptions[currentTargetIndex]);

		this.#filterOptions[currentTargetIndex] = target;
		this.#updateFilter(target.value as FILTER_TYPE);
	};

	#toggleFilterOption = (element: HTMLInputElement) => {
		if(!element) {
			return;
		}
		if (element.checked) {
			element.disabled = true;
			element.checked = true;
			return;
		}
		element.disabled = false;
		element.checked = false;
	};

	get template(): string {
		return getTripFilterTemplate();
	}
}

export {TripFilterView};
