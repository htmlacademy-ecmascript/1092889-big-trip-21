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
  handlers: {
    switchEvent: SwitchEventsHandler,
    updateFavourite: () => void};
}

class EventThumbnailView extends AbstractView<HTMLDivElement>{
  #state: Point;
  #offers: Offer[];
  #destination: Destination;
  #editButton: HTMLButtonElement;
  #favouriteButton: HTMLButtonElement;
  #handlers: {
    switchEvent: SwitchEventsHandler,
    updateFavourite: () => void
  };

  constructor(props: EventThumbnailViewProps) {
    super();
    this.#state = props.state;
    this.#offers = props.offers;
    this.#destination = props.destination;
    this.#handlers = props.handlers;

    this.#editButton = this.element.querySelector('.event__rollup-btn')!;
    this.#favouriteButton = this.element.querySelector('.event__favorite-btn')!;
    this.initListeners();
  }

  initListeners = () => {
    this.#editButton.addEventListener('click', this.#toggleEventHandler);
    this.#favouriteButton.addEventListener('click', this.#toggleFavouriteHandler);
  };

  removeListeners = () => {
    this.#editButton.removeEventListener('click', this.#toggleEventHandler);
    this.#favouriteButton.removeEventListener('click', this.#toggleFavouriteHandler);
  };

  #toggleEventHandler = () => {
    this.#handlers.switchEvent(this.#state.id, Default.SWITCH_KIND);
  };

  #toggleFavouriteHandler = async () => {
    try {
      await this.#handlers.updateFavourite();
    }catch (e){
      this.shake();
    }
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
