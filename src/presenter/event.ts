import {EventListItemView} from '../view/event-list-item';
import {EventThumbnailView} from '../view/event-thumbnail';
import {Destination, Offer, Point} from '../contracts/contracts';
import {render} from '../render';
import {SwitchEventsHandler} from './event-list';
import AbstractPresenter from './abstract';


interface EventPresenterProps {
	container: EventListItemView,
	point: Point,
	offers: Offer[],
	destination: Destination,
	handlers: SwitchEventsHandler
}

export default class EventPresenter extends AbstractPresenter{
	#container: EventListItemView;
	#target: EventThumbnailView;
	#point: Point;
	#offers: Offer[];
	#destination: Destination;
	#id: Point['id'];
	#handlers: SwitchEventsHandler;

	constructor(props: EventPresenterProps) {
		super();
		this.#container = props.container;
		this.#point = props.point;
		this.#offers = props.offers;
		this.#destination = props.destination;
		this.#id = this.#point.id;
		this.#handlers = props.handlers!;

		this.#target = this.#getTarget();
		this.render();
	}

	get id() {
		return this.#id;
	}

	get container() {
		return this.#container;
	}

	#getTarget = () => new EventThumbnailView({
		point: this.#point,
		offers: this.#offers,
		destination: this.#destination,
		handlers: this.#handlers
	});

	render() {
		render(this.#target, this.#container.element);
	}

	remove() {
		this.#target.removeElement();
	}
}


