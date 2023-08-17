import {AbstractView} from './_abstract';
import {getEventThumbnailTemplate} from '../template/event-thumbnail';

class EventThumbnailView extends AbstractView<HTMLDivElement>{
	constructor() {
		super();
	}

	get template(): string {
		return getEventThumbnailTemplate();
	}
}

export {EventThumbnailView};
