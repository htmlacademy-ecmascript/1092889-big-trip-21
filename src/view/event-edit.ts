import {getEventEditTemplate} from '../template/event-edit';
import {BlankPoint, Destination, EventType, Offer, Point} from '../contracts/contracts';
import {SwitchEventsHandler} from '../presenter/event-list';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';

interface EventEditViewHandlers {
  getOffersByType: (eventType: EventType) => Offer[],
  getOffersById: (...id: string[]) => Offer[],
  getDestinationByName: (destinationName: Destination['name']) => Destination,
  getDestinationTemplate: Destination;
  switchHandler: SwitchEventsHandler,
  deletePoint: (id: Point['id']) => void,
  updatePoint:(state: Point) => void,
  cancelHandler: () => void,
  createPoint:(state: Point) => void,
}
interface EventEditViewProps {
  state: Point | BlankPoint,
  eventTypes: EventType[],
  destinationsNames: Destination['name'][];
  destination: Destination | '',
}

interface StatefulOffer extends Offer{
  checked: boolean
}
const enum Default {
  SWITCH_KIND = 'Thumbnail'
}

class EventEditView extends AbstractStatefulView<Point | BlankPoint, HTMLFormElement>{
  #destination: Destination | '' = '';
  #eventTypes: EventType[];
  #destinationsNames: Destination['name'][];
  #handlers: EventEditViewHandlers;
  #offers: Offer[] = [];

  #switchButton: HTMLButtonElement | null = null;
  #submitButton: HTMLButtonElement | null = null;
  #resetButton: HTMLButtonElement | null = null;
  #eventTypeSelect: HTMLInputElement[] | null = null;
  #eventTypeToggle: HTMLInputElement | null = null;
  #destinationInput: HTMLInputElement | null = null;
  #priceInput: HTMLInputElement | null = null;
  #offersCheckboxes: HTMLInputElement[] = [];
  #startDate: flatpickr.Instance | null = null;
  #endDate: flatpickr.Instance | null = null;

  constructor(props: EventEditViewProps, handlers: EventEditViewHandlers) {
    super();
    this._setState(props.state);
    this.#destination = (props.destination) ? props.destination : '';
    this.#eventTypes = props.eventTypes;
    this.#destinationsNames = props.destinationsNames;
    this.#handlers = handlers;
    this.#initHandlers();
  }

  #getStatefulOffers = (): StatefulOffer[] => {
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
    this.#submitButton = this.element.querySelector('.event__save-btn')! as HTMLButtonElement;
    this.#resetButton = this.element.querySelector('.event__reset-btn')! as HTMLButtonElement;
    this.#switchButton = this.element.querySelector('.event__rollup-btn')!;
    this.#eventTypeSelect = Array.from(this.element.querySelectorAll('.event__type-list input')!);
    this.#eventTypeToggle = this.element.querySelector('.event__type-toggle');
    this.#destinationInput = this.element.querySelector('.event__input--destination');
    this.#priceInput = this.element.querySelector('.event__input--price');
    this.#offersCheckboxes = Array.from(this.element?.querySelectorAll('.event__offer-checkbox'));
    this.createFlatpickrDates();

    if(!this.#switchButton || !this.#eventTypeSelect || !this.#destinationInput || !this.#priceInput) {
      throw new Error('Elements not found');
    }

    this.#switchButton!.addEventListener('click', this.#hideFormHandler);
    this.#eventTypeSelect!.map((element) => element.addEventListener('change', this.#updateEventTypeHandler));
    this.#destinationInput!.addEventListener('change', this.#updateDestinationHandler);
    this.#priceInput!. addEventListener('change', this.#updatePriceHandler);
    this.element!.addEventListener('submit', this.#formSubmitHandler);
    this.element!.addEventListener('reset', this.#formResetHandler);
  };

  createFlatpickrDates = () => {
    const startDate = this.element.querySelector('#event-start-time-1');
    const endDate = this.element.querySelector('#event-end-time-1');

    this.#startDate = flatpickr(startDate!, {
      dateFormat: 'd/m/y H:i',
      defaultDate: new Date(this._state.dateFrom),
      enableTime: true,
      onClose: this.startDateChange
    });
    this.#endDate = flatpickr(endDate!, {
      dateFormat: 'd/m/y H:i',
      minDate: new Date(this._state.dateFrom),
      defaultDate: new Date(this._state.dateTo),
      enableTime: true,
      onClose: this.endDateChange
    });
  };

  startDateChange = (dateObj: Date[]) => {
    this._setState({dateFrom: dateObj[0], offers: this.#getCheckedOffers()});
  };

  endDateChange = (dateObj: Date[]) => {
    this._setState({dateTo: dateObj[0], offers: this.#getCheckedOffers()});
  };

  #removeListeners = () => {
    this.#switchButton!.removeEventListener('click', this.#hideFormHandler);
    this.#eventTypeSelect!.map((input) => input.removeEventListener('change', this.#updateEventTypeHandler));
    this.#destinationInput!.removeEventListener('change', this.#updateDestinationHandler);
    this.#priceInput!.removeEventListener('change', this.#updatePriceHandler);
    this.element!.removeEventListener('submit', this.#formSubmitHandler);
    this.element!.removeEventListener('reset', this.#formResetHandler);
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
      this.#destination = this.#handlers.getDestinationTemplate;
      this.updateElement({destination: this.#destination.id, offers: offers});
    }
  };

  #updatePriceHandler = (evt: Event) => {
    evt.preventDefault();
    const target = evt.target as HTMLInputElement;
    this._setState({basePrice: Number(target.value), offers: this.#getCheckedOffers()});
  };

  #getCheckedOffers = (): string[] | [] => {
    const checkedOffers = this.#offersCheckboxes!.filter((element) => element.checked);
    return (checkedOffers.length) ? checkedOffers!.map((element) => element.id.slice(-36)) : [];
  };

  #formSubmitHandler = async (evt: Event) => {
    evt.preventDefault();

    this._setState({...this._state, offers: this.#getCheckedOffers()});
    this.#setDisabledState();
    this.changeButtonState(this.#submitButton!);
    if (this._state.id === '') {
      try {
        await this.#handlers.createPoint(this._state as Point);
      } catch (e) {
        this.changeButtonState(this.#submitButton!);
        this.shake(this.#removeDisabledState);
        return;
      }
      this.#handlers.cancelHandler();
      return;
    }
    try {
      await this.#handlers.updatePoint(this._state as Point);
    } catch (e) {
      this.changeButtonState(this.#submitButton!);
      this.shake(this.#removeDisabledState);
      return;
    }
    this.#handlers.switchHandler(this._state.id,Default.SWITCH_KIND);
  };

  #formResetHandler = async (evt: Event) => {
    evt.preventDefault();
    this.#setDisabledState();
    if (this._state.id === '') {
      this.#handlers.cancelHandler();
      return;
    }
    this.changeButtonState(this.#resetButton!);
    try {
      await this.#handlers.deletePoint(this._state.id);
    } catch (e) {
      this.changeButtonState(this.#resetButton!);
      this.shake(this.#removeDisabledState);
    }
  };

  #hideFormHandler = (evt: Event) => {
    evt.preventDefault();
    if (this._state.id === '') {
      this.#handlers.cancelHandler();
      return;
    }
    this.#handlers.switchHandler(this._state.id, Default.SWITCH_KIND);
  };

  #setDisabledState = () => {
    this.#switchButton!.disabled = true;
    this.#eventTypeToggle!.disabled = true;
    this.#eventTypeSelect!.forEach((input) => {
      input.disabled = true;
    });
    this.#destinationInput!.disabled = true;
    this.#priceInput!.disabled = true;
    this.#offersCheckboxes.forEach((checkbox) => {
      checkbox.disabled = true;
    });
    this.#startDate!.input.disabled = true;
    this.#endDate!.input.disabled = true;
    this.#submitButton!.disabled = true;
    this.#resetButton!.disabled = true;
  };

  changeButtonState = (button: HTMLButtonElement) => {
    if(button.textContent!.endsWith('...')){
      const text = button.textContent!.slice(0,-6);
      button.textContent = `${text}e`;
      return;
    }
    const text = button.textContent!.slice(0,-1);
    button.textContent = `${text}ing...`;
  };

  #removeDisabledState = () => {
    this.#switchButton!.disabled = false;
    this.#eventTypeToggle!.disabled = false;
    this.#eventTypeSelect!.forEach((input) => {
      input.disabled = false;
    });
    this.#destinationInput!.disabled = false;
    this.#priceInput!.disabled = false;
    this.#offersCheckboxes.forEach((checkbox) => {
      checkbox.disabled = false;
    });
    this.#startDate!.input.disabled = false;
    this.#endDate!.input.disabled = false;
    this.#submitButton!.disabled = false;
    this.#resetButton!.disabled = false;
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
    this.#startDate!.destroy();
    this.#endDate!.destroy();
    this.#removeListeners();
    super.removeElement();
  }
}

export {EventEditView};
export type {EventEditViewProps, StatefulOffer};
