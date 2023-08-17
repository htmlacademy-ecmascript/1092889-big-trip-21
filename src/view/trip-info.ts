import {AbstractView} from './_abstract';
import {getTripInfoTemplate} from '../template/trip-info';

class TripInfoView extends AbstractView<HTMLElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getTripInfoTemplate() ;
	}
}

export {TripInfoView};
