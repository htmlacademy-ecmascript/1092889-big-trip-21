import {AbstractView} from './_abstract';
import {getEventEditTemplate} from '../template/event-edit';

class EventEditView extends AbstractView<HTMLFormElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getEventEditTemplate();
	}
}

export {EventEditView};
