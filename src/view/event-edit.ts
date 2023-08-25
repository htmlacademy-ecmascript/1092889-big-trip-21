import {AbstractView} from './_abstract';
import {getEventEditTemplate} from '../template/event-edit';
import {Destination, EventType, Offer, Point} from '../contracts/contracts';
import {SwitchEventsHandler} from '../presenter/event-list';

interface EventEditHandlers {
	getOffersByType: (eventType: EventType) => Offer[],
	getDestinationByName: (destinationName: Destination['name']) => Destination,
	switchHandler: SwitchEventsHandler
}
interface EventEditViewProps {
	state: Point,
	eventTypes: EventType[],
	destinationsNames: Destination['name'][];
	destination: Destination,
	offers: Offer[],
}

interface StateFullOffers extends Offer{
	checked: boolean
}
const enum Default {
	SWITCH_KIND = 'Thumbnail'
}

class EventEditView extends AbstractView<HTMLFormElement>{
	#state: Point;
	#destination: Destination;
	#offers: Offer[];
	#eventTypes: EventType[];
	#destinationsNames: Destination['name'][];
	#handlers: EventEditHandlers;
	#switchButton: HTMLButtonElement;
	constructor(props: EventEditViewProps, handlers: EventEditHandlers) {
		super();
		this.#state = props.state;
		this.#destination = props.destination;
		this.#offers = props.offers;
		this.#eventTypes = props.eventTypes;
		this.#destinationsNames = props.destinationsNames;
		this.#handlers = handlers;

		this.#switchButton = this.element.querySelector('.event__rollup-btn')!;
		this.initListeners();
	}

	getStateFullOffers = (): StateFullOffers[] => {
		const stateFullOffers = this.#offers.map((offer) => Object.assign(offer, {checked: true}));
		const offersByType = this.#handlers.getOffersByType(this.#state.type)
			.filter((offer) => !this.#offers.includes(offer))
			.map((offer) => Object.assign((offer), {checked: false}));
		return [...stateFullOffers,...offersByType];
	};

	initListeners = () => {
		this.#switchButton.addEventListener('click', this.toggleEventListener);
	};

	removeListeners = () => {
		this.#switchButton.removeEventListener('click', this.toggleEventListener);
	};

	toggleEventListener = () => {
		this.#handlers.switchHandler(this.#state.id, Default.SWITCH_KIND);
	};

	get template(): string {
		return getEventEditTemplate(
			{
				state: this.#state,
				eventTypes: this.#eventTypes,
				destinationsNames: this.#destinationsNames,
				destination: this.#destination
			},
			this.getStateFullOffers());
	}

	removeElement() {
		this.removeListeners();
		super.removeElement();
	}
}

export {EventEditView};
export type {EventEditViewProps, StateFullOffers};

