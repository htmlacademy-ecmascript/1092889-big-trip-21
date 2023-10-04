import {TripFilterView} from '../view/trip-filter';
import {render, replace} from '../framework/render';
import {FilterType} from '../contracts/constants';
import FilterModel from '../model/filter';
import PointsModel from '../model/points';
import {Point} from '../contracts/contracts';
import dayjs from 'dayjs';

interface TripFiltersPresenterProps {
  container: HTMLElement,
  filterModel: FilterModel,
  pointsModel: PointsModel,
  filterHandler: () => void
}

export default class TripFiltersPresenter {
  #container: HTMLElement;
  #target: TripFilterView;
  #filterModel: FilterModel;
  #pointsModel: PointsModel;
  #currentFilter: FilterType = FilterType.ALL;
  #filterHandler: () => void;
  #filteredPoints: Map<FilterType, Point[]> = new Map([
    [FilterType.ALL, []],
    [FilterType.PRESENT, []],
    [FilterType.PAST, []],
    [FilterType.FUTURE, []]
  ]);

  constructor(props: TripFiltersPresenterProps){
    this.#container = props.container;
    this.#filterModel = props.filterModel;
    this.#pointsModel = props.pointsModel;
    this.#filterHandler = props.filterHandler;
    this.#filterModel.addObserver(this.#handleFilterChange);
    this.#pointsModel.addObserver(this.#handlePointsModelChange);
    this.#target = this.#getTarget();
    this.render();
  }

  #handlePointsModelChange = (updateType: unknown) => {
    switch (updateType) {
      case 'INIT': {
        if(this.#pointsModel.points!.length === 0) {
          break;
        }
        this.#filteredPoints = this.#filterPoints();
        this.updateTarget();
        break;
      }
      case 'MAJOR' : {
        if(this.#pointsModel.points!.length === 0) {
          this.#filterModel.changeFilter(FilterType.ALL);
          break;
        }
        break;
      }
      default : {
        this.#filteredPoints = this.#filterPoints();
      }
    }
  };

  #handleFilterChange = (updateType: unknown ,update: unknown) => {
    this.#currentFilter = update as FilterType;
  };

  #filterPoints = () => {
    const currentTime = new Date();
    const getPoints = () => [...this.#pointsModel.points!].sort((a,b) => a.dateFrom.getTime() - b.dateFrom.getTime());

    const getFuturePoints = () => getPoints().filter((point) => point.dateFrom.getTime() > currentTime.getTime());

    const getPastPoints = () => getPoints().filter((point) => point.dateTo.getTime() < currentTime.getTime());
    const getPresentPoints = () => getPoints().filter((point) => dayjs(point.dateFrom).isSame(dayjs(currentTime),'day'));

    return new Map([
      [FilterType.ALL, getPoints!()],
      [FilterType.PRESENT, getPresentPoints!()],
      [FilterType.PAST, getPastPoints!()],
      [FilterType.FUTURE, getFuturePoints!()]
    ]);
  };

  getFilteredPoints = () => {
    this.#filteredPoints = this.#filterPoints();
    this.updateTarget();
    return this.#filteredPoints.get(this.#currentFilter);
  };

  updateTarget = () => {
    const newTarget = this.#getTarget();
    replace(newTarget, this.#target);
    this.#target = newTarget;
  };

  #updateFilter = (filter: FilterType) => {
    this.#currentFilter = filter;
    this.#filterModel.changeFilter(filter);
    this.#filterHandler();
  };

  #getTarget = () => new TripFilterView(this.#currentFilter ,this.#filteredPoints ,this.#updateFilter);


  render = () => {
    render(this.#target, this.#container);
  };


}
