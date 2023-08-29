import { render } from '../framework/render';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import {TripInfoView} from '../view/trip-info';

interface TripInfoPresenterProps {
	container: HTMLElement,
	destinationModel: DestinationsModel,
	pointsModel: PointsModel,
	offersModel: OffersModel
}

export default class TripInfoPresenter {
	#destinationModel: DestinationsModel;
	#pointsModel: PointsModel;
	#offersModel: OffersModel;
	#container: HTMLElement;
	#target: TripInfoView;

	constructor(props: TripInfoPresenterProps) {
		this.#destinationModel = props.destinationModel;
		this.#pointsModel = props.pointsModel;
		this.#offersModel = props.offersModel;
		this.#container = props.container;
		this.#target = this.#getTarget();
	}

	#getTarget = () => new TripInfoView();

	render() {
		render(this.#target, this.#container);
	}

	remove() {
		this.#target.removeElement();
	}
}


