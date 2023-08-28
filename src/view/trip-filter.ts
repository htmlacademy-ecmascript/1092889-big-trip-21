import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripFilterTemplate} from '../template/trip-filter';

class TripFilterView extends AbstractStatefulView<HTMLFormElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getTripFilterTemplate() ;
	}
}

export {TripFilterView};
