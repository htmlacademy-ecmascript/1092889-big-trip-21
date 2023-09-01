import {getEventEditTemplate} from '../template/event-edit';
import {Destination, EventType, Offer, Point} from '../contracts/contracts';
import {SwitchEventsHandler} from '../presenter/event-list';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import { getDestinationTemplate } from '../model/templates/templates';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

interface EventEditViewHandlers {
	getOffersByType: (eventType: EventType) => Offer[],
	getOffersById: (...id: string[]) => Offer[],
	getDestinationByName: (destinationName: Destination['name']) => Destination,
	switchHandler: SwitchEventsHandler,
	deletePoint: (id: Point['id']) => void,
	updatePoint:(state: Point) => void,
}
interface EventEditViewProps {
	state: Point,
	eventTypes: EventType[],
	destinationsNames: Destination['name'][];
	destination: Destination,
}

interface StateFullOffers extends Offer{
	checked: boolean
}
const enum Default {
	SWITCH_KIND = 'Thumbnail'
}

class EventEditView extends AbstractStatefulView<Point, HTMLFormElement>{
	#destination: Destination;
	#eventTypes: EventType[];
	#destinationsNames: Destination['name'][];
	#handlers: EventEditViewHandlers;
	#offers: Offer[] = [];

	#switchButton: HTMLButtonElement | null = null;
	#eventTypeSelect: HTMLInputElement[] | null = null;
	#destinationInput: HTMLInputElement | null = null;
	#priceInput: HTMLInputElement | null = null;
	#offersCheckboxes: HTMLInputElement[] = [];
	#startDate: flatpickr.Instance | null = null;
	#endDate: flatpickr.Instance | null = null;

	constructor(props: EventEditViewProps, handlers: EventEditViewHandlers) {
		super();
		this._setState(props.state);
		this.#destination = props.destination;
		this.#eventTypes = props.eventTypes;
		this.#destinationsNames = props.destinationsNames;
		this.#handlers = handlers;
		this.#initHandlers();
	}

	#getStatefulOffers = (): StateFullOffers[] => {
		this.#offers = this.#handlers.getOffersById(...this._state.offers);
		const statefulOffers = this.#offers.map((offer) => Object.assign(offer, {checked: true}));
		const offersByType = this.#handlers.getOffersByType(this._state.type)
			.filter((offer) => !this.#offers.includes(offer))
			.map((offer) => Object.assign((offer), {checked: false}));
		return [...statefulOffers,...offersByType];
	};

	_restoreHandlers(): void {
		this.#initHandlers();
	}

	#initHandlers = () => {
		this.#switchButton = this.element.querySelector('.event__rollup-btn')!;
		this.#eventTypeSelect = Array.from(this.element.querySelectorAll('.event__type-list input')!);
		this.#destinationInput = this.element.querySelector('.event__input--destination');
		this.#priceInput = this.element.querySelector('.event__input--price');
		this.#offersCheckboxes = Array.from(this.element?.querySelectorAll('.event__offer-checkbox'));
		this.createFlatpickrDates();

		if(!this.#switchButton || !this.#eventTypeSelect || !this.#destinationInput || !this.#priceInput) {
			throw new Error('Elements not found');
		}

		this.#switchButton!.addEventListener('click', this.#switchEventHandler);
		this.#eventTypeSelect!.map((element) => element.addEventListener('click', this.#updateEventTypeHandler));
		this.#destinationInput!.addEventListener('change', this.#updateDestinationHandler);
		this.#priceInput!. addEventListener('change', this.#updatePriceHandler);
		this.element!.addEventListener('submit', this.#formSubmitHandler);
		this.element!.addEventListener('reset', this.#formResetHandler);
	};

	createFlatpickrDates = () => {
		const startDate = this.element.querySelector('#event-start-time-1');
		const endDate = this.element.querySelector('#event-end-time-1');

		this.#startDate = flatpickr(startDate!, {
			dateFormat: 'y/m/d H:i',
			defaultDate: new Date(this._state.dateFrom),
			enableTime: true,
			onClose: this.startDateChange
		});
		this.#endDate = flatpickr(endDate!, {
			dateFormat: 'y/m/d H:i',
			minDate: new Date(this._state.dateFrom),
			defaultDate: new Date(this._state.dateTo),
			enableTime: true,
			onClose: this.endDateChange
		});
	};

	startDateChange = (dateObj: Date[]) => {
		if (dateObj[0].getTime() > this._state.dateTo.getTime()) {
			this.updateElement({dateFrom: dateObj[0], dateTo:  dateObj[0], offers: this.#getCheckedOffers()});
			return;
		}
		this.updateElement({dateFrom: dateObj[0], offers: this.#getCheckedOffers()});
	};

	endDateChange = (dateObj: Date[]) => {
		this.updateElement({dateTo: dateObj[0], offers: this.#getCheckedOffers()});
	};

	#removeListeners = () => {
		this.#switchButton!.removeEventListener('click', this.#switchEventHandler);
		this.#eventTypeSelect!.map((input) => input.removeEventListener('click', this.#updateEventTypeHandler));
		this.#destinationInput!.removeEventListener('change', this.#updateDestinationHandler);
		this.#priceInput!.removeEventListener('change', this.#updatePriceHandler);
		this.element!.removeEventListener('submit', this.#formSubmitHandler);
		this.element!.removeEventListener('reset', this.#formResetHandler);
	};


	#switchEventHandler = () => {
		this.#handlers.switchHandler(this._state.id, Default.SWITCH_KIND);
	};

	#updateEventTypeHandler = (evt: Event) => {
		evt.preventDefault();
		const target = evt.target as HTMLInputElement;
		this.updateElement({type: target.value as EventType, offers: []});
	};

	#updateDestinationHandler = (evt: Event) => {
		evt.preventDefault();
		const target = evt.target as HTMLInputElement;
		const value = target.value;
		const offers = this.#getCheckedOffers();

		if (this.#destinationsNames.find((name) => name === value)) {
			this.#destination = this.#handlers.getDestinationByName(target.value as Destination['name']);
			this.updateElement({destination: this.#destination.id, offers: offers});
		} else {
			this.#destination = getDestinationTemplate();
			this.updateElement({destination: this.#destination.id, offers: offers});
		}
	};

	#updatePriceHandler = (evt: Event) => {
		evt.preventDefault();
		const target = evt.target as HTMLInputElement;
		this.updateElement({basePrice: Number(target.value), offers: this.#getCheckedOffers()});
	};

	#getCheckedOffers = (): string[] | [] => {
		const checkedOffers = this.#offersCheckboxes!.filter((element) => element.checked);
		return (checkedOffers.length) ? checkedOffers!.map((element) => element.id.slice(-36)) : [];
	};

	#formSubmitHandler = (evt: Event) => {
		evt.preventDefault();
		if(this.#destination.name === '') {
			this.shake();
			return;
		}
		this.updateElement({offers: this.#getCheckedOffers()});
		this.#handlers.updatePoint(this._state);
		this.#handlers.switchHandler(this._state.id,Default.SWITCH_KIND);
	};

	#formResetHandler = (evt: Event) => {
		evt.preventDefault();
		this.#handlers.deletePoint(this._state.id);
	};

	get template(): string {
		return getEventEditTemplate(
			{
				state: this._state,
				eventTypes: this.#eventTypes,
				destinationsNames: this.#destinationsNames,
				destination: this.#destination
			},
			this.#getStatefulOffers());
	}

	removeElement() {
		this.#removeListeners();
		super.removeElement();
	}
}

export {EventEditView};
export type {EventEditViewProps, StateFullOffers};

