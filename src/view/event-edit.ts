import {getEventEditTemplate} from '../template/event-edit';
import {Destination, EventType, Offer, Point} from '../contracts/contracts';
import {SwitchEventsHandler} from '../presenter/event-list';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDestinationTemplate } from '../constants/templates';

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
	#destinationInput: HTMLInputElement | null = null;
	#priceInput: HTMLInputElement | null = null;

	constructor(props: EventEditViewProps, handlers: EventEditHandlers) {
		super();
		this._setState(props.state);
		this.#destination = props.destination;
		this.#offers = props.offers;
		this.#eventTypes = props.eventTypes;
		this.#destinationsNames = props.destinationsNames;
		this.#handlers = handlers;
		this.initHandlers();
	}

	getStatefulOffers = (): StateFullOffers[] => {
		const statefulOffers = this.#offers.map((offer) => Object.assign(offer, {checked: true}));
		const offersByType = this.#handlers.getOffersByType(this._state.type)
			.filter((offer) => !this.#offers.includes(offer))
			.map((offer) => Object.assign((offer), {checked: false}));
		return [...statefulOffers,...offersByType];
	};

	_restoreHandlers(): void {
		this.initHandlers();
	}

	initHandlers = () => {
		this.#switchButton = this.element.querySelector('.event__rollup-btn')!;
		this.#eventTypeSelect = Array.from(this.element.querySelectorAll('.event__type-list input')!);
		this.#destinationInput = this.element.querySelector('.event__input--destination');
		this.#priceInput = this.element.querySelector('.event__input--price');

		if(!this.#switchButton || !this.#eventTypeSelect || !this.#destinationInput || !this.#priceInput) {
			throw new Error('Elements not found');
		}

		this.#switchButton!.addEventListener('click', this.switchEventHandler);
		this.#eventTypeSelect!.map((input) => input.addEventListener('click', this.updateEventTypeHandler));
		this.#destinationInput!.addEventListener('change', this.updateDestiantionHandler);
		this.#priceInput!. addEventListener('change', this.updatePriceHandler);
	};

	removeListeners = () => {
		this.#switchButton!.removeEventListener('click', this.switchEventHandler);
		this.#eventTypeSelect!.map((input) => input.removeEventListener('click', this.updateEventTypeHandler));
		this.#destinationInput!.removeEventListener('change', this.updateDestiantionHandler);
		this.#priceInput!.removeEventListener('change', this.updatePriceHandler);
	};

	switchEventHandler = () => {
		this.#handlers.switchHandler(this._state.id, Default.SWITCH_KIND);
	};

	updateEventTypeHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		this.#offers = [];
		this.updateElement({type: target.value as EventType, offers: []});
	};

	updateDestiantionHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		const value = target.value;
		if (value === '') {
			this.#destination = getDestinationTemplate();
			this.updateElement({destination: this.#destination.id});
			return;
		}
		this.#destination = this.#handlers.getDestinationByName(target.value as Destination['name']);
		this.updateElement({destination: this.#destination.id});
	};

	updatePriceHandler = (evt: Event) => {
		const target = evt.target as HTMLInputElement;
		this.updateElement({basePrice: Number(target.value)});
	};

	updateOffersHandler = () => {};

	saveEventHandler = () => {};

	get template(): string {
		return getEventEditTemplate(
			{
				state: this._state,
				eventTypes: this.#eventTypes,
				destinationsNames: this.#destinationsNames,
				destination: this.#destination
			},
			this.getStatefulOffers());
	}

	removeElement() {
		this.removeListeners();
		super.removeElement();
	}
}

export {EventEditView};
export type {EventEditViewProps, StateFullOffers};

