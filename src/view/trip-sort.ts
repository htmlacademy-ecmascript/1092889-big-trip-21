import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripSortTemplate} from '../template/trip-sort';
import {SortType} from '../contracts/constants';

class TripSortView extends AbstractStatefulView<HTMLFormElement>{
  #sortOptions: HTMLInputElement[] = [];
  #updateSort: (value: SortType) => void;
  #currentSort: SortType;
  constructor(currentSort: SortType,updateSort: (value: SortType) => void) {
    super();
    this.#currentSort = currentSort;
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

    const currentTargetIndex = this.#sortOptions.findIndex((element) => element.value === target.value);

    this.#sortOptions[currentTargetIndex] = target;
    this.#updateSort(target.value as SortType);
  };

  get template(): string {
    return getTripSortTemplate(this.#currentSort) ;
  }

  remove() {
    super.removeElement();
  }
}

export {TripSortView};
