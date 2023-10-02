import {TripFilterView} from '../view/trip-filter';
import {render, replace} from '../framework/render';
import {FilterType} from '../contracts/constants';
import FilterModel from '../model/filter';
import PointsModel from '../model/points';

interface TripFiltersPresenterProps {
	container: HTMLElement,
	filterModel: FilterModel,
	pointsModel: PointsModel,
	filterHandler: () => void
}

export default class TripFiltersPresenter {
	#container: HTMLElement;
	#target: TripFilterView;
	#filterModel: FilterModel;
	#pointsModel: PointsModel;
	#currentFilter: FilterType = FilterType.ALL;
	#filterHandler: () => void;
	constructor(props: TripFiltersPresenterProps){
		this.#container = props.container;
		this.#filterModel = props.filterModel;
		this.#pointsModel = props.pointsModel;
		this.#target = this.#getTarget();
		this.#filterHandler = props.filterHandler;
		this.#filterModel.addObserver(this.#handleFilterChange);
		this.render();
	}

	#handleFilterChange = (updateType: unknown ,update: unknown) => {
		this.#currentFilter = update as FilterType;
	};

	#filterPoints = (value: FilterType) => {
		const currentTime = new Date();
		const getPoints = () => [...this.#pointsModel.points!].sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime());

		const getFuturePoints = () => getPoints().filter((point) => point.dateFrom.getTime() > currentTime.getTime());

		const getPastPoints = () => getPoints().filter((point) => point.dateFrom.getTime() < currentTime.getTime());
		const getPresentPoints = () => getPoints().filter((point) => point.dateFrom.getTime() <= currentTime.getTime() && point.dateTo.getTime() >= currentTime.getTime());

		const filteredPoints = new Map([
			[FilterType.ALL, getPoints()],
			[FilterType.PRESENT, getPresentPoints!()],
			[FilterType.PAST, getPastPoints!()],
			[FilterType.FUTURE, getFuturePoints!()]
		]);
		const res = filteredPoints.get(value);
		return (!res) ? [] : res;
	};

	getFilteredPoints = () => {
		this.updateTarget();
		return this.#filterPoints(this.#currentFilter);
	};

	updateTarget = () => {
		const newTarget = this.#getTarget();
		replace(newTarget, this.#target);
		this.#target = newTarget;
	};

	#updateFilter = (filter: FilterType) => {
		this.#currentFilter = filter;
		this.#filterModel.changeFilter(filter);
		this.#filterHandler();
	};

	#getTarget = () => new TripFilterView(this.#currentFilter ,this.#updateFilter);


	render = () => {
		render(this.#target, this.#container);
	};


}
