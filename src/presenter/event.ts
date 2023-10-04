import {EventListItemView} from '../view/event-list-item';
import {EventThumbnailView} from '../view/event-thumbnail';
import {Destination, Offer, Point} from '../contracts/contracts';
import { remove, render } from '../framework/render';
import {SwitchEventsHandler} from './event-list';
import AbstractPresenter from './abstract';


interface EventPresenterProps {
  container: EventListItemView,
  point: Point,
  offers: Offer[],
  destination: Destination,
  handlers: {
    switchEvent: SwitchEventsHandler,
    updateFavourite: (id: Point) => void}
}

export default class EventPresenter extends AbstractPresenter{
  #container: EventListItemView;
  #target: EventThumbnailView;
  #state: Point;
  #offers: Offer[];
  #destination: Destination;
  #id: Point['id'];
  #handlers: {
    switchEvent: SwitchEventsHandler,
    updateFavourite: (id: Point) => void
  };

  constructor(props: EventPresenterProps) {
    super();
    this.#container = props.container;
    this.#state = props.point;
    this.#offers = props.offers;
    this.#destination = props.destination;
    this.#id = this.#state.id;
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

  #updateFavourite = async () => {
    try {
      await this.#handlers.updateFavourite(this.#state);
    } catch {
      throw new Error();
    }
  };


  #getTarget = () => new EventThumbnailView({
    state: this.#state,
    offers: this.#offers,
    destination: this.#destination,
    handlers: {
      switchEvent: this.#handlers.switchEvent,
      updateFavourite: this.#updateFavourite
    }
  });

  render() {
    render(this.#target, this.#container.element);
  }

  remove() {
    remove(this.#target);
  }
}
