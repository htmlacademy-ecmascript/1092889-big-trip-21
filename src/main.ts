import {render} from './render';
import {TripInfoView} from './view/trip-info';
import {TripFilterView} from './view/trip-filter';
import {TripSortView} from './view/trip-sort';
import {EventListPresenter} from './presenter/event-list';
import MockService from './service/mock';
import PointsModel from './model/points';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';

const pageHeader = document.querySelector('.trip-main') as HTMLDivElement;
const pageEventsContainer = document.querySelector('.trip-events') as HTMLElement;
const pageFiltersContainer = document.querySelector('.trip-controls__filters') as HTMLDivElement;


if (!pageHeader || !pageFiltersContainer || ! pageEventsContainer) {
	throw new Error('Missing main template');
}
const mockService = new MockService();

render(new TripInfoView(), pageHeader, 'afterbegin');
render(new TripFilterView(), pageFiltersContainer);
render(new TripSortView(), pageEventsContainer);
new EventListPresenter({container: pageEventsContainer,
	pointsModel: new PointsModel(mockService),
	offersModel: new OffersModel(mockService),
	destinationsModel: new DestinationsModel(mockService)});

