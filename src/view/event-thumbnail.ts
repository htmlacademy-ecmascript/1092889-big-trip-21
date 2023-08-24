import {AbstractView} from './_abstract';
import {getEventThumbnailTemplate} from '../template/event-thumbnail';
import {Destination, Offer, Point} from '../contracts/contracts';
import {getRelativeTime} from '../utils/time';
import {SwitchEventsHandler} from '../presenter/event-list';

const enum Default {
	SWITCH_KIND = 'Edit'
}

interface EventThumbnailViewProps {
	point: Point,
	offers: Offer[],
	destination: Destination,
	handlers: SwitchEventsHandler;
}

class EventThumbnailView extends AbstractView<HTMLDivElement>{
	#point: Point;
	#offers: Offer[];
	#destination: Destination;
	#editButton: HTMLButtonElement;
	#handlers: SwitchEventsHandler;
	constructor(props: EventThumbnailViewProps) {
		super();
		this.#point = props.point;
		this.#offers = props.offers;
		this.#destination = props.destination;
		this.#handlers = props.handlers;

		this.#editButton = this.element.querySelector('.event__rollup-btn')!;
		this.initListeners();
	}

	initListeners = () => {
		this.#editButton.addEventListener('click', this.toggleEventListener);
	};

	removeListeners = () => {
		this.#editButton.removeEventListener('click', this.toggleEventListener);
	};

	toggleEventListener = () => {
		this.#handlers(this.#point.id, Default.SWITCH_KIND);
	};

	calculateDuration = ({dateFrom, dateTo}: Point) => getRelativeTime(dateFrom, dateTo);

	get template(): string {
		return getEventThumbnailTemplate(this.#point, this.#offers, this.#destination, this.calculateDuration(this.#point));
	}

	removeElement() {
		this.removeListeners();
		super.removeElement();
	}
}

export {EventThumbnailView};
