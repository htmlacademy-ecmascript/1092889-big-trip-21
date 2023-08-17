import {AbstractView} from './_abstract';
import {getTripFilterTemplate} from '../template/trip-filter';

class TripFilterView extends AbstractView<HTMLFormElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getTripFilterTemplate() ;
	}
}

export {TripFilterView};
