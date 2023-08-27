import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripSortTemplate} from '../template/trip-sort';

class TripSortView extends AbstractStatefulView<HTMLFormElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getTripSortTemplate() ;
	}
}

export {TripSortView};
