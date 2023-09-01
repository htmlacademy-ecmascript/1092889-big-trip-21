import {remove, render} from '../framework/render';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import {TripInfoView} from '../view/trip-info';
import {Destination} from '../contracts/contracts';

interface TripInfoPresenterProps {
	container: HTMLElement,
	destinations: Destination[],
	pointsModel: PointsModel,
	offersModel: OffersModel
}

export default class TripInfoPresenter {
	#destinations: Destination[];
	#pointsModel: PointsModel;
	#offersModel: OffersModel;
	#container: HTMLElement;
	#target: TripInfoView;

	constructor(props: TripInfoPresenterProps) {
		this.#destinations = props.destinations;
		this.#pointsModel = props.pointsModel;
		this.#offersModel = props.offersModel;
		this.#container = props.container;
		this.#target = this.#getTarget();
		this.render();
	}

	#getTarget = () => new TripInfoView({
		destinations: this.#destinations.map((destination) => destination.name),
		price: this.#getPrice(),
		dates:[]

	});

	#getPrice = (): number => {
		const points = this.#pointsModel.points!;
		const pointsSum = points.reduce((acc,point) => acc + point.basePrice, 0);
		const offers = points.flatMap((point) => point.offers).map((offer) => this.#offersModel.getById(offer));
		const offersSum = offers.reduce((acc, offer)=> acc + offer.price, 0);
		return(offersSum + pointsSum);
	};

	render = () => {
		render(this.#target, this.#container, 'afterbegin');
	};

	remove() {
		remove(this.#target);
	}
}


