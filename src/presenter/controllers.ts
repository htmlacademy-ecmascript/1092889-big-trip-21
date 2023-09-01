import { Destination, Offer, Point } from '../contracts/contracts';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import { EventListPresenter } from './event-list';
import TripFiltersPresenter from './trip-filters';
import TripInfoPresenter from './trip-info';
import TripSortPresenter from './trip-sort';
import {FILTER_TYPE, SORT_TYPE} from '../contracts/constants';
interface ControllersPresenterProps {
	pointsModel: PointsModel,
	destinationsModel: DestinationsModel,
	offersModel: OffersModel
}

interface ControllersPresenterState {
	currentPoints: Point[],
	currentDestinations: Destination[],
	currentOffers: Offer[],
	currentFilter: FILTER_TYPE,
	currentSort: SORT_TYPE
}

interface PageContainers {
	header: HTMLDivElement,
	filter: HTMLDivElement,
	main: HTMLElement
}

export default class ControllersPresenter {
	#state: ControllersPresenterState = {
		currentPoints:[],
		currentDestinations:[],
		currentOffers: [],
		currentFilter: 'everything',
		currentSort: 'sort-day'
	};

	#pointsModel: PointsModel | null = null;
	#destinationsModel: DestinationsModel;
	#offersModel: OffersModel;
	#filter: TripFiltersPresenter | null = null;
	#sort: TripSortPresenter | null = null;
	#info: TripInfoPresenter | null = null;
	#eventList: EventListPresenter | null = null;
	#containers: PageContainers | null = null;

	constructor(props: ControllersPresenterProps) {
		this.#pointsModel = props.pointsModel;
		this.#destinationsModel = props.destinationsModel;
		this.#offersModel = props.offersModel;
		this.#containers = {
			filter: document.querySelector('.trip-controls__filters') as HTMLDivElement,
			main: document.querySelector('.trip-events') as HTMLElement,
			header: document.querySelector('.trip-main') as HTMLDivElement
		};
		this.initialRender();
	}

	#setState = (update: ControllersPresenterState | Partial<ControllersPresenterState>) => {
		this.#state = structuredClone({...this.#state, ...update});
	};

	#updateState = () => {};

	updateSort = (value: SORT_TYPE) => {
		switch(value) {
			case 'sort-price': break;
			case 'sort-time': break;
			default: break;
		}
		this.#setState({currentSort: value});
		this.refreshEventList();
	};

	updateFilter = (value: FILTER_TYPE) => {
		switch (value) {
			case 'present': break;
			case 'future': break;
			case 'past': break;
			default: break;
		}
		this.#setState({currentFilter: value});
		this.refreshEventList();
	};

	initialRender = () => {
		const points = this.#pointsModel!.points!;
		const destinations = points.map((point) => this.#destinationsModel.getById(point.destination));
		const offers = points.flatMap((point) => point.offers.map((offer) => this.#offersModel.getById(offer)));

		this.#setState({
			currentPoints: points,
			currentDestinations: destinations,
			currentOffers: offers,
			currentFilter: 'everything',
			currentSort: 'sort-day'
		});
		this.#info = new TripInfoPresenter({
			container: this.#containers!.header,
			pointsModel:this.#pointsModel!,
			destinations: this.#state.currentDestinations,
			offersModel: this.#offersModel,
		});

		this.#filter = new TripFiltersPresenter({
			container: this.#containers!.filter,
			updateFilter: this.updateFilter
		});

		this.#sort = new TripSortPresenter({
			container: this.#containers!.main,
			updateSort: this.updateSort
		});

		this.#eventList = new EventListPresenter({
			container: this.#containers!.main,
			points: this.#state.currentPoints,
			pointsModel: this.#pointsModel!,
			destinationsModel: this.#destinationsModel,
			offersModel: this.#offersModel,
			handlers: {deletePoint: this.#deletePoint}
		});
	};

	refreshEventList = () => {
		this.filterPoints(this.#state.currentFilter);
		this.sortPoints(this.#state.currentSort);

		this.#eventList!.updateTripList(this.#state.currentPoints);
	};

	filterPoints = (value: FILTER_TYPE) => {
		const currentTime = new Date();
		const filterDefault = () => this.#pointsModel!.points!;
		const filterPresent = () => this.#pointsModel!.points!.filter((point) => point.dateFrom.toDateString() === currentTime.toDateString());
		const filterFuture = () => this.#pointsModel!.points!.filter((point) => point.dateFrom.getTime() > currentTime.getTime());
		const filterPast = () => this.#pointsModel!.points!.filter((point) => point.dateFrom.getTime() < currentTime.getTime());

		const filters: Map<FILTER_TYPE,() => Point[]> = new Map([
			['everything', filterDefault],
			['present', filterPresent],
			['future', filterFuture],
			['past', filterPast]
		]);

		this.#setState({
			currentPoints: filters.get(value)!()
		});
	};

	sortPoints = (value: SORT_TYPE) => {
		const sortByPrice = (priceOne: Point, priceTwo: Point) => priceOne.basePrice - priceTwo.basePrice;
		const sortByTime = (timeOne: Point, timeTwo: Point) => (timeOne.dateTo.getTime() - timeOne.dateFrom.getTime()) - (timeTwo.dateTo.getTime() - timeTwo.dateFrom.getTime());
		const sortByDay = (dayOne: Point, dayTwo: Point) => dayOne.dateFrom.getTime() - dayTwo.dateFrom.getTime();

		const sorts:Map<SORT_TYPE, (a: Point,b: Point) => number> = new Map ([
			['sort-price', sortByPrice],
			['sort-day', sortByDay],
			['sort-time', sortByTime]
		]);

		this.#setState({
			currentPoints: this.#state.currentPoints.sort((a, b) => sorts.get(value)!(a, b))
		});
	};

	refreshInfo = () => {
		this.#info!.remove();
		this.#info = this.#info = new TripInfoPresenter({
			container: this.#containers!.header,
			pointsModel:this.#pointsModel!,
			destinations: this.#state.currentDestinations,
			offersModel: this.#offersModel,
		});
	};

	#deletePoint = (pointId: Point['id']) => {
		const selectedPoint = this.#state.currentPoints.find((point) => point.id === pointId);
		this.#setState({
			currentDestinations: this.#state.currentDestinations.filter((destination) => destination.id !== selectedPoint!.destination),
			currentPoints: this.#state.currentPoints.filter((point) => point.id !== selectedPoint!.id)
		});
		this.refreshInfo();
	};
}

