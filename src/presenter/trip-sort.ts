import {TripSortView} from '../view/trip-sort';
import {remove, render, replace} from '../framework/render';
import {SortType} from '../contracts/constants';
import {Point} from '../contracts/contracts';
import FilterModel from '../model/filter';
import PointsModel from '../model/points';

interface TripSortPresenterProps {
  container: HTMLElement,
  filterModel: FilterModel,
  pointsModel: PointsModel,
  getCurrentPoints: () => Point[],
  sortHandler: () => void
}
export default class TripSortPresenter {
  #container: HTMLElement;
  #target: TripSortView | null = null;
  #filterModel: FilterModel;
  #pointsModel: PointsModel;
  #getCurrentPoints: () => Point[];
  #currentSort = SortType.DAY;
  #sortHandler: () => void;

  constructor(props: TripSortPresenterProps) {
    this.#container = props.container;
    this.#target = null;
    this.#filterModel = props.filterModel;
    this.#pointsModel = props.pointsModel;
    this.#getCurrentPoints = props.getCurrentPoints;
    this.#sortHandler = props.sortHandler;
    this.#filterModel.addObserver(this.#handleFilterChange);
    this.#pointsModel.addObserver(this.#handlePointsModelChange);
  }

  #handlePointsModelChange = (updateType: unknown) => {
    switch (updateType) {
      case 'INIT': {
        if(this.#getCurrentPoints().length === 0) {
          break;
        }
        this.updateTarget();
        break;
      }
      case 'MAJOR' : {
        if(this.#getCurrentPoints().length === 0) {
          this.remove();
          this.#target = null;
          break;
        }
        this.updateTarget();
        break;
      }
    }
  };

  #handleFilterChange = () => {
    this.#currentSort = SortType.DAY;
  };

  #sortPoints = (value: SortType) => {
    const sortByPrice = (priceOne: Point, priceTwo: Point) => priceTwo.basePrice - priceOne.basePrice;
    const sortByTime = (timeOne: Point, timeTwo: Point) => (timeTwo.dateTo.getTime() - timeTwo.dateFrom.getTime()) - (timeOne.dateTo.getTime() - timeOne.dateFrom.getTime());
    const sortByDate = (dayOne: Point, dayTwo: Point) => dayOne.dateFrom.getTime() - dayTwo.dateFrom.getTime();

    const sorts:Map<SortType, (a: Point,b: Point) => number> = new Map ([
      [SortType.PRICE, sortByPrice],
      [SortType.DAY, sortByDate],
      [SortType.TIME, sortByTime]
    ]);

    return this.#getCurrentPoints().sort((a, b) => sorts.get(value)!(a, b));
  };

  getSortedPoints = () => {
    const points = this.#sortPoints(this.#currentSort);
    this.updateTarget();
    return points;
  };

  updateTarget = () => {
    if(this.#target) {
      const newTarget = this.#getTarget();
      replace(newTarget, this.#target);
      this.#target = newTarget;
      return;
    }
    this.#target = this.#getTarget();
    this.render();
  };

  #updateSort = (sort: SortType) => {
    this.#currentSort = sort;
    this.#sortHandler();
  };

  #getTarget = () => new TripSortView(this.#currentSort, this.#updateSort);

  render = () => {
    render(this.#target!, this.#container,'afterbegin');
  };

  remove () {
    remove(this.#target!);
  }
}
