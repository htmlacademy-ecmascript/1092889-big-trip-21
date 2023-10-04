import AbstractView from '../framework/view/abstract-view';
import {getEventListItemTemplate} from '../template/event-list-item';

class EventListItemView extends AbstractView<HTMLLIElement>{
  #content: string = '';
  constructor() {
    super();
  }

  get content() {
    return this.#content;
  }

  set content(newContent: string) {
    this.#content = newContent;
  }

  get template(): string {
    return getEventListItemTemplate(this.#content);
  }
}

export {EventListItemView};
