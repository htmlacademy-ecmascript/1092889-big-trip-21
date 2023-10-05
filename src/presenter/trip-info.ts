import {remove, render, replace} from '../framework/render';
import OffersModel from '../model/offers';
import PointsModel from '../model/points';
import {TripInfoView} from '../view/trip-info';
import dayjs from 'dayjs';
import DestinationsModel from '../model/destinations';

interface TripInfoPresenterProps {
  container: HTMLElement,
  destinationsModel:DestinationsModel,
  pointsModel: PointsModel,
  offersModel: OffersModel
}

export default class TripInfoPresenter {
  #destinationsModel: DestinationsModel;
  #pointsModel: PointsModel;
  #offersModel: OffersModel;
  #container: HTMLElement;
  #target: TripInfoView | null = null;

  constructor(props: TripInfoPresenterProps) {
    this.#destinationsModel = props.destinationsModel;
    this.#pointsModel = props.pointsModel;
    this.#offersModel = props.offersModel;
    this.#container = props.container;
    this.#pointsModel.addObserver(this.#pointsModelChangeHandler);
  }

  #pointsModelChangeHandler = (updateType: unknown) => {
    switch (updateType) {
      case 'INIT': {
        if(this.#pointsModel.points!.length === 0) {
          break;
        }
        this.#target = this.#getTarget();
        this.render();
        break;
      }
      case 'MAJOR' : {
        if(this.#pointsModel.points!.length === 0) {
          this.remove();
          this.#target = null;
          break;
        }
        if (!this.#target) {
          this.#target = this.#getTarget();
          this.render();
          break;
        }
        const newTarget = this.#getTarget();
        replace(newTarget,this.#target);
        this.#target = newTarget;
      }
    }
  };

  #getTarget = () => new TripInfoView({
    destinations: this.#getDestinations(),
    price: this.#getPrice(),
    dates:this.#getDates()

  });

  #getPrice = (): number => {
    const points = this.#pointsModel.points!;
    const pointsSum = points.reduce((acc,point) => acc + point.basePrice, 0);
    const offers = points.flatMap((point) => point.offers).map((offer) => this.#offersModel.getById(offer));
    const offersSum = offers.reduce((acc, offer)=> acc + offer.price, 0);
    return(offersSum + pointsSum);
  };

  #getDates = () => {
    const points = this.#pointsModel.points!;
    const sortedPoints = [...points].sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime());

    return [dayjs(sortedPoints[0].dateFrom).format('D MMM').toString(),dayjs(sortedPoints.at(-1)!.dateTo).format('D MMM')];
  };

  #getDestinations = () => {
    const currentDestinations = [...this.#pointsModel.points!].sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime()).map((point) => this.#destinationsModel.getById(point.destination));
    return currentDestinations.map((destination) => destination.name);

  };

  render = () => {
    render(this.#target!, this.#container, 'afterbegin');
  };

  remove() {
    remove(this.#target!);
  }
}
