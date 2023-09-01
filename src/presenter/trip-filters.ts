import {TripFilterView} from '../view/trip-filter';
import {render} from '../framework/render';
import {FILTER_TYPE} from '../contracts/constants';

interface TripFiltersPresenterProps {
	container: HTMLElement
	updateFilter: (value: FILTER_TYPE) => void;
}

export default class TripFiltersPresenter {
	#container: HTMLElement;
	#target: TripFilterView;
	#updateFilter: (value: FILTER_TYPE) => void;
	constructor(props: TripFiltersPresenterProps){
		this.#container = props.container;
		this.#updateFilter = props.updateFilter;
		this.#target = this.#getTarget();
		this.render();
	}

	#getTarget = () => new TripFilterView(this.#updateFilter);


	render = () => {
		render(this.#target, this.#container);
	};
}
