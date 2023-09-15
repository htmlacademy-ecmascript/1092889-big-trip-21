import { Point } from '../contracts/contracts';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import { EventListPresenter } from './event-list';
import TripFiltersPresenter from './trip-filters';
import TripInfoPresenter from './trip-info';
import TripSortPresenter from './trip-sort';
interface ControllersPresenterProps {
	pointsModel: PointsModel,
	destinationsModel: DestinationsModel,
	offersModel: OffersModel
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
	#filter: TripFiltersPresenter | null = null;
	#sort: TripSortPresenter | null = null;
	#info: TripInfoPresenter | null = null;
	#eventList: EventListPresenter | null = null;
	#containers: PageContainers | null = null;
	#addButton: HTMLButtonElement | null = null;

	constructor(props: ControllersPresenterProps) {
		this.#pointsModel = props.pointsModel;
		this.#destinationsModel = props.destinationsModel;
		this.#offersModel = props.offersModel;
		this.#containers = {
			filter: document.querySelector('.trip-controls__filters') as HTMLDivElement,
			main: document.querySelector('.trip-events') as HTMLElement,
			header: document.querySelector('.trip-main') as HTMLDivElement
		};
		this.#addButton = document.querySelector('.trip-main__event-add-btn')!;
		this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
		this.initialRender();
	}


	#pointsModelChangeHandler = (updateType: unknown, update: unknown) => {
		this.#setState({currentPoints: update as Point[]});
		switch (updateType) {
			case 'PATCH': {
				break;
			}
			case 'MINOR' : {
				break;
			}
			case 'MAJOR' : {
				this.refreshInfo();
				this.#setState({currentPoints: this.#filter!.getFilteredPoints('everything')});
				this.#setState({currentPoints: this.#sort!.getSortedPoints('sort-day')});
				this.refreshEventList(this.#state.currentPoints);
				break;
			}
		}
	};

	#setState = (update: ControllersPresenterState | Partial<ControllersPresenterState>) => {
		this.#state = structuredClone({...this.#state, ...update});
	};

	#getDestinationsFromPoints = () => this.#state.currentPoints.map((point) => this.#destinationsModel.getById(point.destination));
	initialRender = () => {
		const points = this.#pointsModel!.points!;

		this.#setState({
			currentPoints: points,
		});
		this.#info = new TripInfoPresenter({
			container: this.#containers!.header,
			pointsModel:this.#pointsModel!,
			destinations: this.#getDestinationsFromPoints(),
			offersModel: this.#offersModel,
		});

		this.#filter = new TripFiltersPresenter({
			container: this.#containers!.filter,
			getCurrentPoints: () => this.#pointsModel!.points!,
			filterHandler: this.filterUpdateHandler
		});

		this.#sort = new TripSortPresenter({
			container: this.#containers!.main,
			getCurrentPoints: this.getCurrentPoints,
			sortHandler: this.sortUpdateHandler
		});

		this.#eventList = new EventListPresenter({
			container: this.#containers!.main,
			points: this.#state.currentPoints,
			pointsModel: this.#pointsModel!,
			destinationsModel: this.#destinationsModel,
			offersModel: this.#offersModel,
			handlers: {deletePoint: this.#deletePoint}
		});
		this.#addButton!.addEventListener('click', this.addButtonHandler);
	};

	getCurrentPoints = () => this.#state.currentPoints;

	addButtonHandler = () => {
		this.#setState({currentPoints: this.#filter!.getFilteredPoints('everything')});
		this.#setState({currentPoints: this.#sort!.getSortedPoints('sort-day')});
		this.refreshEventList(this.#state.currentPoints);
		this.#eventList!.newEvent();
	};

	filterUpdateHandler = () => {
		this.#setState({currentPoints: this.#filter!.getFilteredPoints()});
		this.#setState({currentPoints: this.#sort!.getSortedPoints('sort-day')});
		this.refreshEventList(this.#state.currentPoints);
	};

	sortUpdateHandler = () => {
		this.#setState({currentPoints: this.#sort!.getSortedPoints()});
		this.refreshEventList(this.#state.currentPoints);
	};

	refreshEventList = (points: Point[]) => {
		this.#eventList!.updateTripList(points);
	};

	refreshInfo = () => {
		this.#info!.remove();
		this.#info = this.#info = new TripInfoPresenter({
			container: this.#containers!.header,
			pointsModel:this.#pointsModel!,
			destinations: this.#getDestinationsFromPoints(),
			offersModel: this.#offersModel,
		});
	};

	#deletePoint = (pointId: Point['id']) => {
		const selectedPoint = this.#state.currentPoints.find((point) => point.id === pointId);
		this.#setState({
			currentPoints: this.#state.currentPoints.filter((point) => point.id !== selectedPoint!.id)
		});
		this.refreshInfo();
	};
}

