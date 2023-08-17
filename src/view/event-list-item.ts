import {AbstractView} from './_abstract';
import {getEventListItemTemplate} from '../template/event-list-item';

class EventListItemView extends AbstractView<HTMLLIElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getEventListItemTemplate();
	}
}

export {EventListItemView};
