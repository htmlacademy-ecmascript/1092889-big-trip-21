import {getEventEditTemplate} from '../template/event-edit';
import {Destination, EventType, Offer, Point} from '../contracts/contracts';
import {SwitchEventsHandler} from '../presenter/event-list';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';

interface EventEditHandlers {
	getOffersByType: (eventType: EventType) => Offer[],
	getDestinationByName: (destinationName: Destination['name']) => Destination,
	switchHandler: SwitchEventsHandler,
	updateState:(state: Point) => void,
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

class EventEditView extends AbstractStatefulView<Point, HTMLFormElement>{
	#destination: Destination;
	#offers: Offer[];
	#eventTypes: EventType[];
	#destinationsNames: Destination['name'][];
	#handlers: EventEditHandlers;
	#switchButton: HTMLButtonElement | null = null;
	#eventTypeSelect: HTMLInputElement[] | null = null;

	constructor(props: EventEditViewProps, handlers: EventEditHandlers) {
		super();
		this._setState(props.state);
		this.#destination = props.destination;
		this.#offers = props.offers;
		this.#eventTypes = props.eventTypes;
		this.#destinationsNames = props.destinationsNames;
		this.#handlers = handlers;
		this.initListeners();
	}

	getStateFullOffers = (): StateFullOffers[] => {
		const stateFullOffers = this.#offers.map((offer) => Object.assign(offer, {checked: true}));
		const offersByType = this.#handlers.getOffersByType(this._state.type)
			.filter((offer) => !this.#offers.includes(offer))
			.map((offer) => Object.assign((offer), {checked: false}));
		return [...stateFullOffers,...offersByType];
	};

	_restoreHandlers(): void {
		this.initListeners();
	}

	initListeners = () => {
		this.#switchButton = this.element.querySelector('.event__rollup-btn')!;
		this.#eventTypeSelect = Array.from(this.element.querySelectorAll('.event__type-list input')!);
		if(!this.#switchButton || !this.#eventTypeSelect) {
			throw new Error('Button element not found');
		}
		this.#switchButton!.addEventListener('click', this.toggleEventListener);
		this.#eventTypeSelect!.map((input) => input.addEventListener('click', this.updateTypeHandler));
	};

	removeListeners = () => {
		this.#switchButton!.removeEventListener('click', this.toggleEventListener);
	};

	toggleEventListener = () => {
		this.#handlers.switchHandler(this._state.id, Default.SWITCH_KIND);
	};

	updateTypeHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		this.updateElement({type: target.value as EventType});
	};


	get template(): string {
		return getEventEditTemplate(
			{
				state: this._state,
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

