
import MockService from './service/mock';
import PointsModel from './model/points';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import ControllersPresenter from './presenter/controllers';

const pageHeader = document.querySelector('.trip-main') as HTMLDivElement;
const pageEventsContainer = document.querySelector('.trip-events') as HTMLElement;
const pageFiltersContainer = document.querySelector('.trip-controls__filters') as HTMLDivElement;


if (!pageHeader || !pageFiltersContainer || ! pageEventsContainer) {
	throw new Error('Missing main template');
}
const mockService = new MockService();

new ControllersPresenter({
	pointsModel: new PointsModel(mockService),
	offersModel: new OffersModel(mockService),
	destinationsModel: new DestinationsModel(mockService)});

