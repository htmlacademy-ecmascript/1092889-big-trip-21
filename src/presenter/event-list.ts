import {EventListItemView} from '../view/event-list-item';
import {EventListView} from '../view/event-list';
import {remove, render} from '../framework/render';
import PointsModel from '../model/points';
import OffersModel from '../model/offers';
import DestinationsModel from '../model/destinations';
import {Point} from '../contracts/contracts';
import EventEditPresenter from './event-edit';
import EventPresenter from './event';
import AbstractPresenter from './abstract';


interface EventListPresenterProps {
	container: HTMLElement,
	points: Point[],
	pointsModel: PointsModel,
	offersModel: OffersModel,
	destinationsModel: DestinationsModel,
}


interface EventListItem {
	container: EventListItemView,
	content: AbstractPresenter;
}
type EventKinds = 'Thumbnail' | 'Edit';

type SwitchEventsHandler = (id: Point['id'], kind: EventKinds) => void;

class EventListPresenter {
	#container: HTMLElement;
	#eventList = new EventListView();
	#listItems: EventListItem[] = [];

	#points: Point[];
	#pointsModel: PointsModel;
	#offersModel: OffersModel;
	#destinationsModel: DestinationsModel;

	#activeElement: AbstractPresenter | null = null;
	constructor(props: EventListPresenterProps) {
		this.#points = props.points;
		this.#container = props.container;
		this.#pointsModel = props.pointsModel;
		this.#offersModel = props.offersModel;
		this.#destinationsModel = props.destinationsModel;

		render(this.#eventList, this.#container);
		this.updateTripList(this.#points);
		this.#pointsModel.addObserver(this.#pointsModelChangeHandler as (updateType: unknown, update: unknown) => void);
	}

	#addEvent = (point: Point) => {
		const container = new EventListItemView();
		const element = this.createEvent(point,container);
		this.#listItems.push({container: container, content: element});
		render(container, this.#eventList.element);
	};

	createEvent = (point: Point, container: EventListItemView) => new EventPresenter({
		container: container,
		point: point,
		destination: this.#destinationsModel.getById(point.destination),
		offers: point.offers.map(this.#offersModel.getById),
		handlers: {
			switchEvent: this.#switchEventsHandler,
			updateFavourite: this.#pointsModel.updateFavorite
		}
	});

	newEvent = () => {
		const container = new EventListItemView();
		const element = this.createEditEvent(container);
		this.#listItems.push({container: container, content: element});
		render(container, this.#eventList.element, 'afterbegin');
		this.#activeElement = element;
		this.#addEscapeHandler();
	};

	createEditEvent = (container: EventListItemView,id?: Point['id']) => new EventEditPresenter({
		container: container,
		state: (id) ? this.#pointsModel.getById(id) : null,
		pointsModel: this.#pointsModel,
		destinationsModel: this.#destinationsModel,
		offersModel: this.#offersModel,
		handlers: {
			switchEvent: this.#switchEventsHandler,
			cancelEventAdd: this.#switchActiveElement
		}
	});

	#switchEventsHandler = (id: Point['id'], kind: EventKinds) => {
		const wrapper = this.#listItems.find((listItem) => listItem.content.id === id)!;
		const element = wrapper.content;
		element.remove();
		if (kind === 'Edit') {
			const editEvent = this.createEditEvent(wrapper.container, id);
			wrapper.content = editEvent;
			this.#activeElement = editEvent;
			this.#addEscapeHandler();
			return;
		}
		this.#removeEscapeHandler();
		this.#activeElement = null;
		const point = this.#pointsModel.getById(id);
		const event = this.createEvent(point, wrapper.container);
		wrapper.content = event;
	};

	#switchActiveElement = (element: AbstractPresenter | null) => {
		if(this.#activeElement) {
			if(this.#pointsModel.points?.find((point) => point.id === this.#activeElement!.id)) {
				this.#switchEventsHandler(this.#activeElement!.id, 'Thumbnail');
				this.#activeElement = element;
				return;
			}
			this.#activeElement.remove();
		}
		this.#activeElement = element;
	};

	#escapeHandler = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.#removeEscapeHandler();
			this.#switchActiveElement(null);
		}
	};

	#addEscapeHandler = () => {
		document.addEventListener('keydown',this.#escapeHandler);

	};

	#removeEscapeHandler = () => {
		document.removeEventListener('keydown', this.#escapeHandler);
	};

	updateTripList = (newPoints: Point[])=> {
		this.clearTripList();
		this.#points = newPoints;
		if (this.#points.length === 0) {
			return;
		}
		this.#points.map((point) => this.#addEvent(point));
	};

	clearTripList = () => {
		this.#switchActiveElement(null);
		this.#listItems.forEach((listItem) => {
			remove(listItem.container);
			listItem.content.remove();
		});
		this.#listItems = [];
	};

	#pointsModelChangeHandler = (updateType: unknown, update: Point) => {
		switch (updateType) {
			case 'PATCH': {
				const pointItem = this.#listItems.find((item) => item.content.id === update.id as Point['id'])!;
				pointItem.content.remove();
				const event = this.createEvent(update as Point, pointItem.container);
				pointItem.content = event;
			}
		}
	};
}

export {EventListPresenter};
export type {EventKinds, SwitchEventsHandler};
