import {TripSortView} from '../view/trip-sort';
import {remove, render, replace} from '../framework/render';
import {SORT_TYPE, SortType} from '../contracts/constants';
import {Point} from '../contracts/contracts';
import FilterModel from '../model/filter';
import PointsModel from '../model/points';

interface TripSortPresenterProps {
	container: HTMLElement,
	filterModel: FilterModel,
	pointsModel: PointsModel,
	getCurrentPoints: () => Point[],
	sortHandler: () => void
}
export default class TripSortPresenter {
	#container: HTMLElement;
	#target: TripSortView | null = null;
	#filterModel: FilterModel;
	#pointsModel: PointsModel;
	#getCurrentPoints: () => Point[];
	#currentSort = SortType.DAY;
	#sortHandler: () => void;

	constructor(props: TripSortPresenterProps) {
		this.#container = props.container;
		this.#target = this.#getTarget();
		this.#filterModel = props.filterModel;
		this.#pointsModel = props.pointsModel;
		this.#getCurrentPoints = props.getCurrentPoints;
		this.#sortHandler = props.sortHandler;
		this.#filterModel.addObserver(this.#handleFilterChange);
		this.#pointsModel.addObserver(this.#handlePointsModelChange);
	}

	#handlePointsModelChange = (updateType: unknown) => {
		switch (updateType) {
			case 'INIT': {
				if(this.#pointsModel.points!.length === 0) {
					break;
				}
				this.#target = this.#getTarget();
				this.render();
				break;
			}
			case 'MAJOR' : {
				if(this.#pointsModel.points!.length === 0) {
					this.remove();
					this.#target = null;
					break;
				}
				if (!this.#target) {
					this.#target = this.#getTarget();
					this.render();
					break;
				}
				const newTarget = this.#getTarget();
				replace(newTarget,this.#target);
				this.#target = newTarget;
			}
		}
	};

	#handleFilterChange = () => {
		this.#currentSort = SortType.DAY;
	};

	#sortPoints = (value: SORT_TYPE) => {
		const sortByPrice = (priceOne: Point, priceTwo: Point) => priceOne.basePrice - priceTwo.basePrice;
		const sortByTime = (timeOne: Point, timeTwo: Point) => (timeOne.dateTo.getTime() - timeOne.dateFrom.getTime()) - (timeTwo.dateTo.getTime() - timeTwo.dateFrom.getTime());
		const sortByDate = (dayOne: Point, dayTwo: Point) => dayOne.dateFrom.getTime() - dayTwo.dateFrom.getTime();

		const sorts:Map<SORT_TYPE, (a: Point,b: Point) => number> = new Map ([
			[SortType.PRICE, sortByPrice],
			[SortType.DAY, sortByDate],
			[SortType.TIME, sortByTime]
		]);

		return this.#getCurrentPoints().sort((a, b) => sorts.get(value)!(a, b));
	};

	getSortedPoints = () => {
		const points = this.#sortPoints(this.#currentSort);
		this.updateTarget();
		return points;
	};

	updateTarget = () => {
		if(this.#target) {
			const newTarget = this.#getTarget();
			replace(newTarget, this.#target);
			this.#target = newTarget;
			return;
		}
		this.#target = this.#getTarget();
		this.render();
	};

	#updateSort = (sort: SortType) => {
		this.#currentSort = sort;
		this.#sortHandler();
	};

	#getTarget = () => new TripSortView(this.#currentSort, this.#updateSort);

	render = () => {
		render(this.#target!, this.#container,'afterbegin');
	};

	remove () {
		remove(this.#target!);
	}
}
