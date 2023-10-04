import { Point } from '../contracts/contracts';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import { EventListPresenter } from './event-list';
import TripFiltersPresenter from './trip-filters';
import TripInfoPresenter from './trip-info';
import TripSortPresenter from './trip-sort';
import {remove, render, replace} from '../framework/render';
import {PlaceholderView} from '../view/placeholder';
import {FilterType} from '../contracts/constants';
import FilterModel from '../model/filter';
import {LoadingView} from '../view/loading';
import {ErrorView} from '../view/error';
interface ControllersPresenterProps {
	pointsModel: PointsModel,
	destinationsModel: DestinationsModel,
	offersModel: OffersModel
	filterModel: FilterModel
}

interface ControllersPresenterState {
	currentPoints: Point[],
}

interface PageContainers {
	header: HTMLDivElement,
	filter: HTMLDivElement,
	main: HTMLElement
}

export default class ControllersPresenter {
	#state: ControllersPresenterState = {
		currentPoints:[],
	};

	#pointsModel: PointsModel | null = null;
	#destinationsModel: DestinationsModel;
	#offersModel: OffersModel;
	#filterModel: FilterModel;
	#filter: TripFiltersPresenter | null = null;
	#sort: TripSortPresenter | null = null;
	#info: TripInfoPresenter | null = null;
	#eventList: EventListPresenter | null = null;
	#containers: PageContainers | null = null;
	#addButton: HTMLButtonElement | null = null;
	#placeholder: PlaceholderView | null = null;
	#loading: LoadingView | null = null;
	#error: ErrorView | null = null;

	constructor(props: ControllersPresenterProps) {
		this.#pointsModel = props.pointsModel;
		this.#destinationsModel = props.destinationsModel;
		this.#offersModel = props.offersModel;
		this.#filterModel = props.filterModel;
		this.#containers = {
			filter: document.querySelector('.trip-controls__filters') as HTMLDivElement,
			main: document.querySelector('.trip-events') as HTMLElement,
			header: document.querySelector('.trip-main') as HTMLDivElement
		};
		this.#addButton = document.querySelector('.trip-main__event-add-btn')!;
		this.#addButton!.addEventListener('click', this.addEventButtonHandler);
		this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
		this.#filterModel.addObserver(this.#filterModelChangeHandler);
		this.initModels();
	}

	async initModels() {
		this.addLoadingScreen();
		try {
			await Promise.all([this.#offersModel.init(), this.#destinationsModel.init()]);
			await this.#pointsModel!.init();
		} catch (err) {
			this.removeLoadingScreen();
			this.addErrorScreen();
		}
	}

	#pointsModelChangeHandler = (updateType: unknown, update: unknown) => {

		switch (updateType) {
			case 'INIT' : {
				this.#setState({currentPoints: update as Point[]});
				this.removeLoadingScreen();
				this.#setState({
					currentPoints: this.#pointsModel!.points!,
				});
				this.initialRender();
				if (this.isNoFilteredPoints()) {
					this.addPlaceholder(this.#filterModel.filter);
					break;
				}
				this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
				this.#setState({currentPoints: this.#sort!.getSortedPoints()});
				this.refreshEventList(this.#state.currentPoints);
				break;
			}
			case 'MAJOR' : {
				this.#setState({currentPoints: update as Point[]});
				this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
				this.#setState({currentPoints: this.#sort!.getSortedPoints()});
				if (this.isNoFilteredPoints()) {
					this.#eventList?.clearTripList();
					this.addPlaceholder(this.#filterModel.filter);
					break;
				}
				if(this.#placeholder) {
					this.removePlaceholder();
				}
				this.refreshEventList(this.#state.currentPoints);
				break;
			} case 'PATCH' : {
				this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
			}
		}
	};


	#filterModelChangeHandler = () => {
		if(this.#placeholder){
			this.removePlaceholder();
		}
		if(this.isNoPoints()) {
			this.addPlaceholder(this.#filterModel.filter);
		}
	};

	isNoFilteredPoints = () => this.#state.currentPoints.length === 0;
	isNoPoints = () => this.#pointsModel!.points!.length === 0;

	#setState = (update: ControllersPresenterState | Partial<ControllersPresenterState>) => {
		this.#state = structuredClone({...this.#state, ...update});
	};

	initialRender = () => {
		this.#sort = this.#createTripSort();
		this.#info = this.#createTripInfo();
		this.#filter = this.#createTripFilter();
		this.#eventList = this.#createEventList();
	};

	getCurrentPoints = () => this.#state.currentPoints;


	addEventButtonHandler = () => {
		if (this.getCurrentPoints().length !== 0){
			this.#filterModel.changeFilter(FilterType.ALL);
			this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
			this.#setState({currentPoints: this.#sort!.getSortedPoints()});
			this.refreshEventList(this.#state.currentPoints);
		} else {
			this.removePlaceholder();
		}
		this.#addButton!.disabled = true;
		this.#eventList!.newEvent();
	};

	addEventCloseHandler = () => {
		this.#addButton!.disabled = false;
		if (this.isNoFilteredPoints()) {
			this.addPlaceholder(this.#filterModel.filter);
		}
	};

	filterUpdateHandler = () => {
		if (this.isNoPoints()) {
			return;
		}
		this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
		this.#setState({currentPoints: this.#sort!.getSortedPoints()});
		this.refreshEventList(this.#state.currentPoints);
	};

	sortUpdateHandler = () => {
		this.#setState({currentPoints: this.#sort!.getSortedPoints()});
		this.refreshEventList(this.#state.currentPoints);
	};

	refreshEventList = (points: Point[]) => {
		this.#eventList!.updateTripList(points);
	};

	addPlaceholder = (filterType: FilterType) => {
		if (this.#placeholder) {
			const newPlaceholder = new PlaceholderView(filterType);
			replace(newPlaceholder, this.#placeholder);
			this.#placeholder = newPlaceholder;
			return;
		}
		this.#placeholder = new PlaceholderView(filterType);
		render(this.#placeholder,this.#containers!.main, 'afterbegin');
	};

	removePlaceholder = () => {
		remove(this.#placeholder!);
		this.#placeholder = null;
	};

	addLoadingScreen = () => {
		this.#loading = new LoadingView();
		render(this.#loading,this.#containers!.main, 'afterbegin');
	};

	removeLoadingScreen = () => {
		remove(this.#loading!);
		this.#loading = null;
	};

	addErrorScreen = () => {
		this.#addButton!.disabled = true;
		this.#error = new ErrorView();
		render(this.#error,this.#containers!.main, 'afterbegin');
	};


	#createTripInfo = () => new TripInfoPresenter({
		container: this.#containers!.header,
		pointsModel:this.#pointsModel!,
		destinationsModel: this.#destinationsModel!,
		offersModel: this.#offersModel,
	});

	#createTripSort = () => new TripSortPresenter({
		container: this.#containers!.main,
		filterModel: this.#filterModel,
		pointsModel: this.#pointsModel!,
		getCurrentPoints: this.getCurrentPoints,
		sortHandler: this.sortUpdateHandler,
	});

	#createTripFilter = () => new TripFiltersPresenter({
		container: this.#containers!.filter,
		filterModel: this.#filterModel,
		pointsModel: this.#pointsModel!,
		filterHandler: this.filterUpdateHandler
	});

	#createEventList = () => new EventListPresenter({
		container: this.#containers!.main,
		points: this.#state.currentPoints,
		pointsModel: this.#pointsModel!,
		destinationsModel: this.#destinationsModel,
		offersModel: this.#offersModel,
		addEventCloseHandler: this.addEventCloseHandler
	});
}

