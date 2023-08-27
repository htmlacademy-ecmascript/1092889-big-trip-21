import AbstractView from '../framework/view/abstract-view';
import {getEventThumbnailTemplate} from '../template/event-thumbnail';
import {Destination, Offer, Point} from '../contracts/contracts';
import {getRelativeTime} from '../utils/time';
import {SwitchEventsHandler} from '../presenter/event-list';
import dayjs from 'dayjs';

const enum Default {
	SWITCH_KIND = 'Edit'
}

interface EventThumbnailViewProps {
	state: Point,
	offers: Offer[],
	destination: Destination,
	handlers: SwitchEventsHandler;
}

class EventThumbnailView extends AbstractView<HTMLDivElement>{
	#state: Point;
	#offers: Offer[];
	#destination: Destination;
	#editButton: HTMLButtonElement;
	#handlers: SwitchEventsHandler;
	constructor(props: EventThumbnailViewProps) {
		super();
		this.#state = props.state;
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
		this.#handlers(this.#state.id, Default.SWITCH_KIND);
	};

	calculateDuration = ({dateFrom, dateTo}: Point) => getRelativeTime(dayjs(dateFrom), dayjs(dateTo));

	get template(): string {
		return getEventThumbnailTemplate(this.#state, this.#offers, this.#destination, this.calculateDuration(this.#state));
	}

	removeElement() {
		this.removeListeners();
		super.removeElement();
	}
}

export {EventThumbnailView};
