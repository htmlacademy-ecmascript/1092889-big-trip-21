import { Point } from '../contracts/contracts';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import { EventListPresenter } from './event-list';
import TripFiltersPresenter from './trip-filters';
import TripInfoPresenter from './trip-info';
import TripSortPresenter from './trip-sort';
import {render} from '../framework/render';
import {PlaceholderView} from '../view/placeholder';
import {FILTER_TYPE, FilterType} from '../contracts/constants';
import FilterModel from '../model/filter';
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
		this.#addButton!.addEventListener('click', this.addButtonHandler);
		this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
		this.initModels();
	}

	async initModels() {
		//loading start
		try {
			await Promise.all([this.#offersModel.init(), this.#destinationsModel.init()]);
			await this.#pointsModel!.init();
		} catch (err) {
			//error screen
		}
	}

	#pointsModelChangeHandler = (updateType: unknown, update: unknown) => {
		this.#setState({currentPoints: update as Point[]});
		switch (updateType) {
			case 'INIT' : {
				this.#setState({
					currentPoints: this.#pointsModel!.points!,
				});
				this.initialRender();
				break;
			}
			case 'MAJOR' : {
				this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
				this.#setState({currentPoints: this.#sort!.getSortedPoints()});
				this.refreshEventList(this.#state.currentPoints);
				break;
			}
		}
	};

	#setState = (update: ControllersPresenterState | Partial<ControllersPresenterState>) => {
		this.#state = structuredClone({...this.#state, ...update});
	};

	initialRender = () => {

		this.#sort = new TripSortPresenter({
			container: this.#containers!.main,
			filterModel: this.#filterModel,
			pointsModel: this.#pointsModel!,
			getCurrentPoints: this.getCurrentPoints,
			sortHandler: this.sortUpdateHandler,
		});

		this.#info = new TripInfoPresenter({
			container: this.#containers!.header,
			pointsModel:this.#pointsModel!,
			destinationsModel: this.#destinationsModel!,
			offersModel: this.#offersModel,
		});

		this.#filter = new TripFiltersPresenter({
			container: this.#containers!.filter,
			filterModel: this.#filterModel,
			pointsModel: this.#pointsModel!,
			filterHandler: this.filterUpdateHandler
		});

		this.#eventList = new EventListPresenter({
			container: this.#containers!.main,
			points: this.#state.currentPoints,
			pointsModel: this.#pointsModel!,
			destinationsModel: this.#destinationsModel,
			offersModel: this.#offersModel,
		});

	};

	getCurrentPoints = () => this.#state.currentPoints;

	addButtonHandler = () => {
		this.#filterModel.changeFilter(FilterType.ALL);
		this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
		this.#setState({currentPoints: this.#sort!.getSortedPoints()});
		this.refreshEventList(this.#state.currentPoints);
		this.#eventList!.newEvent();
	};

	filterUpdateHandler = () => {
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

	addPlaceholder = (filterType: FILTER_TYPE) => {
		this.#placeholder = new PlaceholderView(filterType);
		render(this.#placeholder,this.#containers!.main, 'afterbegin');
	};

	removePlaceholder = () => {};
}

