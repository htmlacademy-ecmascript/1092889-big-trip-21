import AbstractView from '../framework/view/abstract-view';
import {getEventListTemplate} from '../template/event-list';

class EventListView extends AbstractView<HTMLUListElement>{
  constructor() {
    super();
  }

  get template(): string {
    return getEventListTemplate();
  }
}

export {EventListView};
