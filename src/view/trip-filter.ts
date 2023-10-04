import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripFilterTemplate} from '../template/trip-filter';
import {FilterType} from '../contracts/constants';
import {Point} from '../contracts/contracts';

class TripFilterView extends AbstractStatefulView<HTMLFormElement>{
	#filterOptions: HTMLInputElement[] = [];
	#updateFilter: (value: FilterType) => void;
	#currentFilter: FilterType;
	#filteredPoints: Map<FilterType, Point[]>;

	constructor(currentFilter: FilterType, filteredPoints: Map<FilterType, Point[]>, updateFilter: (value: FilterType) => void) {
		super();
		this.#filteredPoints = filteredPoints;
		this.#currentFilter = currentFilter;
		this.#updateFilter = updateFilter;
		this.initHandlers();
	}

	initHandlers = () => {
		this.#filterOptions = Array.from(this.element!.querySelectorAll('.trip-filters__filter-input'));
		this.#filterOptions.map((element) => element.addEventListener('change', this.#filterHandler));
	};

	#filterHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		const currentTargetIndex = this.#filterOptions.findIndex((element) => element.value === target.value);
		this.#toggleFilterOption(this.#filterOptions[currentTargetIndex]);

		this.#filterOptions[currentTargetIndex] = target;
		this.#updateFilter(target.value as FilterType);
	};

	#toggleFilterOption = (element: HTMLInputElement) => {
		if(!element) {
			return;
		}
		if (element.checked) {
			element.checked = true;
			return;
		}
		element.checked = false;
	};

	get template(): string {
		return getTripFilterTemplate(this.#currentFilter, this.#filteredPoints);
	}
}

export {TripFilterView};
