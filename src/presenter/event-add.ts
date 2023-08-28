import {EventListItemView} from '../view/event-list-item';
import {Destination, EventType, Point} from '../contracts/contracts';
import {EventAddView} from '../view/event-add';
import PointsModel from '../model/points';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import { remove, render } from '../framework/render';
import AbstractPresenter from './abstract';

interface EventAddPresenterProps {
	container: EventListItemView,
	pointsModel: PointsModel,
	destinationsModel: DestinationsModel,
	offersModel: OffersModel,
	handlers: ()=>void;
}

export default class EventAddPresenter extends AbstractPresenter{
	#container: EventListItemView;
	#state: Point;
	#target: EventAddView;
	#id: Point['id'];
	#pointsModel: PointsModel;
	#destinationsModel: DestinationsModel;
	#offersModel: OffersModel;
	#handlers: ()=>void;

	constructor(props: EventAddPresenterProps) {
		super();
		this.#container = props.container;
		this.#state = this.#createNewState();
		this.#pointsModel = props.pointsModel;
		this.#destinationsModel = props.destinationsModel;
		this.#offersModel = props.offersModel;
		this.#id = this.#state.id;
		this.#handlers = props.handlers;

		this.#target = this.#getTarget();
		this.render();
	}

	#createNewState = (): Point => ({
		id: crypto.randomUUID(),
		basePrice: 0,
		dateFrom: new Date(),
		dateTo: new Date(),
		destination:'',
		isFavourite: false,
		offers: [],
		type: 'Flight'
	});

	getOffersByType = (eventType: EventType) => this.#offersModel.getByType(eventType)!.offers;

	getDestinationByName = (destinationName: Destination['name']) => this.#destinationsModel.getByName(destinationName);


	get id() {
		return this.#id;
	}

	#getTarget = () => new EventAddView({
		eventTypes: this.#offersModel.eventTypes,
		destinationsNames: this.#destinationsModel.destinationsNames,
		state: this.#state,
		handlers: {
			getOffersByType: this.getOffersByType,
			getDestinationByName: this.getDestinationByName,
			handler: this.#handlers}
	});

	render() {
		render(this.#target, this.#container.element);
	}

	remove() {
		remove(this.#target);
	}

}
