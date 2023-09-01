import {TripSortView} from '../view/trip-sort';
import {render} from '../framework/render';
import {SORT_TYPE} from '../contracts/constants';

interface TripSortPresenterProps {
	container: HTMLElement
	updateSort: (value: SORT_TYPE) => void;
}
export default class TripSortPresenter {
	#container: HTMLElement;
	#target: TripSortView;
	#updateSort: (value: SORT_TYPE) => void;

	constructor(props: TripSortPresenterProps) {
		this.#container = props.container;
		this.#updateSort = props.updateSort;
		this.#target = this.#getTarget();
		this.render();
	}

	#getTarget = () => new TripSortView(this.#updateSort);

	render = () => {
		render(this.#target, this.#container);
	};
}
