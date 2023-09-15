import {remove, render} from '../framework/render';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import {TripInfoView} from '../view/trip-info';
import {Destination} from '../contracts/contracts';
import dayjs from 'dayjs';

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
		dates:this.#getDates()

	});

	#getPrice = (): number => {
		const points = this.#pointsModel.points!;
		const pointsSum = points.reduce((acc,point) => acc + point.basePrice, 0);
		const offers = points.flatMap((point) => point.offers).map((offer) => this.#offersModel.getById(offer));
		const offersSum = offers.reduce((acc, offer)=> acc + offer.price, 0);
		return(offersSum + pointsSum);
	};

	#getDates = () => {
		const points = this.#pointsModel.points!;
		const sortedPoints = [...points].sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime());

		return [dayjs(sortedPoints[0].dateFrom).format('MMM D').toString(),dayjs(sortedPoints.at(-1)!.dateTo).format('MMM D')];
	};

	render = () => {
		render(this.#target, this.#container, 'afterbegin');
	};

	remove() {
		remove(this.#target);
	}
}


