import {EventListItemView} from '../view/event-list-item';
import {Destination, EventType, Point} from '../contracts/contracts';
import PointsModel from '../model/points';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import {render} from '../render';
import {EventEditView} from '../view/event-edit';
import {SwitchEventsHandler} from './event-list';
import AbstractPresenter from './abstract';


interface EventEditPresenterProps {
	container: EventListItemView,
	state: Point
	pointsModel: PointsModel,
	destinationsModel: DestinationsModel,
	offersModel: OffersModel,
	handlers: SwitchEventsHandler
}

export default class EventEditPresenter extends AbstractPresenter{
	#container: EventListItemView;
	#state: Point;
	#target: EventEditView;
	#id: Point['id'];
	#pointsModel: PointsModel;
	#destinationsModel: DestinationsModel;
	#offersModel: OffersModel;
	handlers: SwitchEventsHandler;

	constructor(props: EventEditPresenterProps) {
		super();
		this.#container = props.container;
		this.#state = props.state;
		this.#pointsModel = props.pointsModel;
		this.#destinationsModel = props.destinationsModel;
		this.#offersModel = props.offersModel;
		this.#id = this.#state.id;
		this.handlers = props.handlers;

		this.#target = this.getTarget();
		this.render();
	}

	getOffersByType = (eventType: EventType) => this.#offersModel.getByType(eventType)!.offers;

	getDestinationByName = (destinationName: Destination['name']) => this.#destinationsModel.getByName(destinationName);


	getTarget = () => new EventEditView({
		state: this.#state,
		eventTypes: this.#offersModel.eventTypes,
		destinationsNames: this.#destinationsModel.destinationsNames,
		destination: this.#destinationsModel.getById(this.#state.destination),
		offers: this.#state.offers.map(this.#offersModel.getById)},
	{
		getOffersByType: this.getOffersByType,
		getDestinationByName: this.getDestinationByName,
		switchHandler: this.handlers
	});

	get id() {
		return this.#id;
	}

	render() {
		render(this.#target, this.#container.element);
	}

	remove() {
		this.#target.removeElement();
	}

}
