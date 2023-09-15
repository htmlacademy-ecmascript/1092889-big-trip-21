import {TripFilterView} from '../view/trip-filter';
import {render, replace} from '../framework/render';
import {FILTER_TYPE} from '../contracts/constants';
import {Point} from '../contracts/contracts';

interface TripFiltersPresenterProps {
	container: HTMLElement
	getCurrentPoints: () => Point[];
	filterHandler: () => void
}

export default class TripFiltersPresenter {
	#container: HTMLElement;
	#target: TripFilterView;
	#getCurrentPoints: () => Point[];
	#currentFilter: FILTER_TYPE = 'everything';
	#filterHandler: () => void;
	constructor(props: TripFiltersPresenterProps){
		this.#container = props.container;
		this.#getCurrentPoints = props.getCurrentPoints;
		this.#target = this.#getTarget();
		this.#filterHandler = props.filterHandler;
		this.render();
	}

	#filterPoints = (value: FILTER_TYPE) => {
		const currentTime = new Date();

		const points = this.#getCurrentPoints();
		const presentIndex = points.findIndex((point) => point.dateTo.getTime() >= currentTime.getTime() && point.dateFrom.getTime() <= currentTime.getTime());
		const filteredPoints = new Map([
			['everything', points],
			['present', [points[presentIndex]]],
			['past', points.slice(0, presentIndex)],
			['future', points.slice(presentIndex + 1)]
		]);
		return filteredPoints.get(value);
	};

	getFilteredPoints = (filter?: FILTER_TYPE) => {
		if (filter) {
			this.#currentFilter = filter;
			const newTarget = this.#getTarget();
			replace(newTarget, this.#target);
			this.#target = newTarget;
			return this.#filterPoints(filter);
		}
		return this.#filterPoints(this.#currentFilter);
	};

	#updateFilter = (filter: FILTER_TYPE) => {
		this.#currentFilter = filter;
		this.#filterHandler();
	};

	#getTarget = () => new TripFilterView(this.#updateFilter);


	render = () => {
		render(this.#target, this.#container);
	};
}
