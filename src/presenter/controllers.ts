import { Destination, Offer, Point } from '../contracts/contracts';
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
	currentDestinations: Destination[],
	currentOffers: Offer[],
}

export default class ControllersPresenter {
	#state: ControllersPresenterState = { currentPoints:[], currentDestinations:[], currentOffers: [] };
	#pointsModel: PointsModel;
	#destinationsModel: DestinationsModel;
	#offersModel: OffersModel;
	#filter: TripFiltersPresenter;
	#sort: TripSortPresenter;
	#info: TripInfoPresenter;
	#list: EventListPresenter;

	constructor(props: ControllersPresenterProps) {
		this.#pointsModel = props.pointsModel;
		this.#destinationsModel = props.destinationsModel;
		this.#offersModel = props.offersModel;
	}

	#setState = (update: ControllersPresenter | Partial<ControllersPresenter>) => {
		this.#state = structuredClone({...this.#state, ...update});
	};

	#updateState = () => {};
}
renderInfo = () => {};
renderFilter = () => {};
renderSort = () => {};
renderList = () => {};
