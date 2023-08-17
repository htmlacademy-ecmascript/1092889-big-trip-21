import {AbstractView} from './_abstract';
import {getTripSortTemplate} from '../template/trip-sort';

class TripSortView extends AbstractView<HTMLFormElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getTripSortTemplate() ;
	}
}

export {TripSortView};
