import {EventListItemView} from '../view/event-list-item';
import {Destination, EventType, Point} from '../contracts/contracts';
import PointsModel from '../model/points';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import {remove, render} from '../framework/render';
import {EventEditView} from '../view/event-edit';
import {SwitchEventsHandler} from './event-list';
import AbstractPresenter from './abstract';

interface EditEventPresenterHandlers {
	switchEvent: SwitchEventsHandler,
	deleteEvent: (id: Point['id']) => void
}

interface EventEditPresenterProps {
	container: EventListItemView,
	state: Point
	pointsModel: PointsModel,
	destinationsModel: DestinationsModel,
	offersModel: OffersModel,
	handlers: EditEventPresenterHandlers
}

export default class EventEditPresenter extends AbstractPresenter{
	#container: EventListItemView;
	#state: Point;
	#target: EventEditView;
	#id: Point['id'];
	#pointsModel: PointsModel;
	#destinationsModel: DestinationsModel;
	#offersModel: OffersModel;
	handlers: EditEventPresenterHandlers;

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

	getOffersById = (...id:string[]) => id.map((offerId) => this.#offersModel.getById(offerId));

	getTarget = () => new EventEditView({
		state: this.#state,
		eventTypes: this.#offersModel.eventTypes,
		destinationsNames: this.#destinationsModel.destinationsNames,
		destination: this.#destinationsModel.getById(this.#state.destination),
	},
	{
		getOffersByType: this.getOffersByType,
		getOffersById: this.getOffersById,
		getDestinationByName: this.getDestinationByName,
		switchHandler: this.handlers.switchEvent,
		deletePoint: this.deletePoint,
		updatePoint: this.updatePoint
	});

	updatePoint = (state: Point) => {
		this.#pointsModel.update(state);
	};

	deletePoint = (id: Point['id']) => {
		this.#pointsModel.delete(id);
		this.handlers.deleteEvent(id);
	};

	get id() {
		return this.#id;
	}

	render() {
		render(this.#target, this.#container.element);
	}

	remove() {
		remove(this.#target);
	}

}
