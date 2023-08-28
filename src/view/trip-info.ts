import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripInfoTemplate} from '../template/trip-info';

class TripInfoView extends AbstractStatefulView<HTMLElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getTripInfoTemplate() ;
	}
}

export {TripInfoView};
