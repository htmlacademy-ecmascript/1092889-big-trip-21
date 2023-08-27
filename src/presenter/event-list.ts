import {EventListItemView} from '../view/event-list-item';
import {EventListView} from '../view/event-list';
import {render} from '../framework/render';
import PointsModel from '../model/points';
import OffersModel from '../model/offers';
import DestinationsModel from '../model/destinations';
import EventAddPresenter from './event-add';
import {Point} from '../contracts/contracts';
import EventEditPresenter from './event-edit';
import EventPresenter from './event';
import AbstractPresenter from './abstract';

/* TODO
*submit on edit and add events
 */

interface EventListPresenterProps {
	container: HTMLElement,
	pointsModel: PointsModel,
	offersModel: OffersModel,
	destinationsModel: DestinationsModel
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

	#pointsModel: PointsModel;
	#offersModel: OffersModel;
	#destinationsModel: DestinationsModel;

	#addButton = document.querySelector('.trip-main__event-add-btn')!;

	#activeElement: AbstractPresenter | null = null;
	constructor(props: EventListPresenterProps) {
		this.#container = props.container;
		this.#pointsModel = props.pointsModel;
		this.#offersModel = props.offersModel;
		this.#destinationsModel = props.destinationsModel;

		render(this.#eventList, this.#container);
		this.#createTripList();
		this.initListeners();
	}

	initListeners = () => {
		this.#addButton.addEventListener('click', this.newEvent);
	};

	addEvent = (point: Point, wrapper: EventListItem | null = null) => {
		const destination = this.#destinationsModel.getById(point.destination);
		const offers = point.offers.map(this.#offersModel.getById);

		if (!wrapper){
			const container = new EventListItemView();
			const element = new EventPresenter({
				container: container,
				point: point,
				destination: destination,
				offers: offers,
				handlers: this.switchEventsHandler
			});
			this.#listItems.push({container: container, content: element});
			render(container, this.#eventList.element);
		} else {
			const element = new EventPresenter({
				container: wrapper.container,
				point: point,
				destination: destination,
				offers: offers,
				handlers: this.switchEventsHandler
			});
			wrapper.content = element;
		}
	};

	newEvent = () => {
		const container = new EventListItemView();
		const element = new EventAddPresenter({
			container: container,
			pointsModel: this.#pointsModel,
			destinationsModel: this.#destinationsModel,
			offersModel: this.#offersModel,
			handlers: ()=> {}
		});
		this.#listItems.push({container: container, content: element});
		this.switchActiveElement(element);
		render(container, this.#eventList.element, 'afterbegin');
		this.addEscapeHandler();
	};

	editEvent = (id: Point['id'], container: EventListItem) => {
		const element = new EventEditPresenter({
			container: container.container,
			state: this.#pointsModel.getById(id),
			pointsModel: this.#pointsModel,
			destinationsModel: this.#destinationsModel,
			offersModel: this.#offersModel,
			handlers: this.switchEventsHandler
		});
		container.content = element;
		this.switchActiveElement(element);
		this.addEscapeHandler();
	};

	switchEventsHandler = (id: Point['id'], kind: EventKinds) => {
		const wrapper = this.#listItems.find((listItem) => listItem.content.id === id)!;
		const element = wrapper.content;
		element.remove();
		if (kind === 'Edit') {
			this.editEvent(id, wrapper);
		} else if (kind === 'Thumbnail') {
			this.removeEscapeHandler();
			this.#activeElement = null;
			const point = this.#pointsModel.getById(id);
			this.addEvent(point, wrapper);
		}
	};

	switchActiveElement = (element: AbstractPresenter | null) => {
		if(this.#activeElement) {
			if(this.#pointsModel.points?.find((point) => point.id === this.#activeElement!.id)) {
				this.switchEventsHandler(this.#activeElement!.id, 'Thumbnail');
				this.#activeElement = element;
				return;
			}
			this.#activeElement.remove();
		}
		this.#activeElement = element;
	};

	escapeHandler = (evt: KeyboardEvent) => {
		if (evt.key === 'Escape') {
			this.switchActiveElement(null);
		}
	};

	addEscapeHandler = () => {
		document.addEventListener('keydown',this.escapeHandler);

	};

	removeEscapeHandler = () => {
		document.removeEventListener('keydown', this.escapeHandler);
	};

	deleteEvent = () => {


	};

	#createTripList = ()=> {
		const points = this.#pointsModel!.points ?? [];
		for (let i = 0; i < 5; i++) {
			if (points.length > 1) {
				this.addEvent(points[i]);
			}
		}
	};
}

export {EventListPresenter};
export type {EventKinds, SwitchEventsHandler};

