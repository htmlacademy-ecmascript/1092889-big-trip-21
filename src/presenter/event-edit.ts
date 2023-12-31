import {EventListItemView} from '../view/event-list-item';
import {BlankPoint, Destination, EventType, Point} from '../contracts/contracts';
import PointsModel from '../model/points';
import DestinationsModel from '../model/destinations';
import OffersModel from '../model/offers';
import {remove, render} from '../framework/render';
import {EventEditView} from '../view/event-edit';
import {SwitchEventsHandler} from './event-list';
import AbstractPresenter from './abstract';

interface EditEventPresenterHandlers {
  switchEvent: SwitchEventsHandler,
  cancelEventAdd: (param: null) => void,
}

interface EventEditPresenterProps {
  container: EventListItemView,
  state: Point | null,
  pointsModel: PointsModel,
  destinationsModel: DestinationsModel,
  offersModel: OffersModel,
  handlers: EditEventPresenterHandlers
}

export default class EventEditPresenter extends AbstractPresenter{
  #container: EventListItemView;
  #state: Point | BlankPoint;
  target: EventEditView;
  #id: Point['id'] | '';
  #pointsModel: PointsModel;
  #destinationsModel: DestinationsModel;
  #offersModel: OffersModel;
  handlers: EditEventPresenterHandlers;

  constructor(props: EventEditPresenterProps) {
    super();
    this.#container = props.container;
    this.#pointsModel = props.pointsModel;
    this.#state = (props.state) ? props.state : {...this.#pointsModel.getBlankPoint(), id: ''};
    this.#destinationsModel = props.destinationsModel;
    this.#offersModel = props.offersModel;
    this.#id = (props.state) ? props.state.id : '';
    this.handlers = props.handlers;

    this.target = this.#getTarget();
    this.render();
  }

  #getOffersByType = (eventType: EventType) => this.#offersModel.getByType(eventType)!.offers;

  #getDestinationByName = (destinationName: Destination['name']) => this.#destinationsModel.getByName(destinationName);

  #getOffersById = (...id:string[]) => id.map((offerId) => this.#offersModel.getById(offerId));

  #getTarget = () => new EventEditView({
    state: this.#state,
    eventTypes: this.#offersModel.eventTypes,
    destinationsNames: this.#destinationsModel.destinationsNames,
    destination: this.#destinationsModel.getById(this.#state.destination),
  },
  {
    getOffersByType: this.#getOffersByType,
    getOffersById: this.#getOffersById,
    getDestinationByName: this.#getDestinationByName,
    getDestinationTemplate: this.#destinationsModel.destinationTemplate,
    switchHandler: this.handlers.switchEvent,
    deletePoint: this.#deletePoint,
    updatePoint: this.#updatePoint,
    cancelHandler: this.#cancelEventAdd,
    createPoint: this.#createPoint
  });

  #updatePoint = async (state: Point) => {
    try {
      await this.#pointsModel.updatePoint(state);
    } catch (e) {
      throw new Error();
    }
  };

  #deletePoint = async (id: Point['id']) => {
    try {
      await this.#pointsModel.delete(id);
    } catch (e) {
      throw new Error();
    }
  };

  #createPoint = async (state: Point) => {
    try {
      await this.#pointsModel.createPoint(state);
    } catch (e) {
      throw new Error();
    }
  };

  #cancelEventAdd = () => {
    this.handlers.cancelEventAdd(null);
  };

  get id() {
    return this.#id;
  }

  render() {
    render(this.target, this.#container.element);
  }

  remove() {
    remove(this.target);
  }

}
