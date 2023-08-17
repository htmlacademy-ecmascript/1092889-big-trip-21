import {AbstractView} from './_abstract';
import {getEventAddTemplate} from '../template/event-add';


class EventAddView extends AbstractView<HTMLFormElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getEventAddTemplate() ;
	}
}

export {EventAddView};
