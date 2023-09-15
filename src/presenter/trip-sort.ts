import {TripSortView} from '../view/trip-sort';
import {render, replace} from '../framework/render';
import {SORT_TYPE} from '../contracts/constants';
import {Point} from '../contracts/contracts';

interface TripSortPresenterProps {
	container: HTMLElement,
	getCurrentPoints: () => Point[],
	sortHandler: () => void
}
export default class TripSortPresenter {
	#container: HTMLElement;
	#target: TripSortView;
	#getCurrentPoints: () => Point[];
	#currentSort: SORT_TYPE = 'sort-day';
	#sortHandler: () => void;

	constructor(props: TripSortPresenterProps) {
		this.#container = props.container;
		this.#target = this.#getTarget();
		this.#getCurrentPoints = props.getCurrentPoints;
		this.#sortHandler = props.sortHandler;
		this.render();
	}

	#sortPoints = (value: SORT_TYPE) => {
		const sortByPrice = (priceOne: Point, priceTwo: Point) => priceOne.basePrice - priceTwo.basePrice;
		const sortByTime = (timeOne: Point, timeTwo: Point) => (timeOne.dateTo.getTime() - timeOne.dateFrom.getTime()) - (timeTwo.dateTo.getTime() - timeTwo.dateFrom.getTime());
		const sortByDate = (dayOne: Point, dayTwo: Point) => dayOne.dateFrom.getTime() - dayTwo.dateFrom.getTime();

		const sorts:Map<SORT_TYPE, (a: Point,b: Point) => number> = new Map ([
			['sort-price', sortByPrice],
			['sort-day', sortByDate],
			['sort-time', sortByTime]
		]);

		return this.#getCurrentPoints().sort((a, b) => sorts.get(value)!(a, b));
	};

	getSortedPoints = (sort?: SORT_TYPE) => {
		if (sort) {
			this.#currentSort = sort;
			const newTarget = this.#getTarget();
			replace(newTarget, this.#target);
			this.#target = newTarget;
			return this.#sortPoints(sort);
		}
		return this.#sortPoints(this.#currentSort);
	};

	#updateSort = (sort: SORT_TYPE) => {
		this.#currentSort = sort;
		this.#sortHandler();
	};

	#getTarget = () => new TripSortView(this.#updateSort);

	render = () => {
		render(this.#target, this.#container);
	};
}
