import PointsModel from './model/points';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import ControllersPresenter from './presenter/controllers';
import EventsApiService from './service/events-api-service';
import FilterModel from './model/filter';

const pageHeader = document.querySelector('.trip-main') as HTMLDivElement;
const pageEventsContainer = document.querySelector('.trip-events') as HTMLElement;
const pageFiltersContainer = document.querySelector('.trip-controls__filters') as HTMLDivElement;


if (!pageHeader || !pageFiltersContainer || ! pageEventsContainer) {
	throw new Error('Missing main template');
}

const AUTHORIZATION = 'Basic 9f7993d6-c582-42c5-a163-3b080c21af6f';
const END_POINT = 'https://21.objects.pages.academy/big-trip';

const eventsApiService = new EventsApiService(END_POINT, AUTHORIZATION);


const destinationsModel = new DestinationsModel(eventsApiService);
const pointsModel = new PointsModel(eventsApiService);
const offersModel = new OffersModel(eventsApiService);
const filterModel = new FilterModel();

new ControllersPresenter({
	pointsModel: pointsModel,
	offersModel: offersModel,
	destinationsModel: destinationsModel,
	filterModel: filterModel}
);


