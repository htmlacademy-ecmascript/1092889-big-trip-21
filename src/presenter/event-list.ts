import {EventListItemView} from '../view/event-list-item';
import {EventListView} from '../view/event-list';
import {AbstractView} from '../view/_abstract';
import {render} from '../render';
import {EventAddView} from '../view/event-add';
import {EventThumbnailView} from '../view/event-thumbnail';

class EventListPresenter {
	#container: HTMLElement;
	#eventList = new EventListView();
	#listItems: EventListItemView[] = [];
	constructor(container: HTMLElement) {
		this.#container = container;
		render(this.#eventList, this.#container);

		this.createTripList();
		this.renderEvents();
	}

	addElement(element: AbstractView) {
		const wrapper = new EventListItemView();
		render(element, wrapper.element);
		this.#listItems.push(wrapper);
	}

	private createTripList() {
		this.addElement(new EventAddView());
		for (let i = 0; i < 3; i++) {
			this.addElement(new EventThumbnailView());
		}
	}

	renderEvents(){
		this.#listItems.forEach((item) => render(item, this.#eventList.element));
	}
}

export {EventListPresenter};
