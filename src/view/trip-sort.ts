import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripSortTemplate} from '../template/trip-sort';
import {SORT_TYPE} from '../contracts/constants';

class TripSortView extends AbstractStatefulView<HTMLFormElement>{
	#sortOptions: HTMLInputElement[] = [];
	#updateSort: (value: SORT_TYPE) => void;
	constructor(updateSort: (value: SORT_TYPE) => void) {
		super();
		this.#updateSort = updateSort;
		this.initHandlers();
	}

	initHandlers = () => {
		const sortOptionsElements = Array.from(this.element!.querySelectorAll('.trip-sort__input')) as HTMLInputElement[];
		this.#sortOptions = sortOptionsElements.filter((element) => !element.disabled);
		this.#sortOptions.map((element) => element.addEventListener('change', this.#sortHandler));
	};

	#sortHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		const previousTargetIndex = this.#sortOptions.findIndex((element) => element.disabled);
		if(this.#sortOptions[previousTargetIndex] === target) {
			return;
		}
		const currentTargetIndex = this.#sortOptions.findIndex((element) => element.value === target.value);
		this.#toggleSortOption(this.#sortOptions[previousTargetIndex]);
		this.#toggleSortOption(this.#sortOptions[currentTargetIndex]);

		this.#sortOptions[currentTargetIndex] = target;
		this.#updateSort(target.value as SORT_TYPE);
	};

	#toggleSortOption = (element: HTMLInputElement) => {
		if (!element){
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
		return getTripSortTemplate() ;
	}

	remove() {
		super.removeElement();
	}
}

export {TripSortView};
