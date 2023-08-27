import { render } from '../framework/render';
import {TripInfoView} from '../view/trip-info';

interface TripInfoPresenterProps {
	container: HTMLElement
}

export default class TripInfoPresenter {
	#container: HTMLElement;
	#info: TripInfoView;
	constructor(props: TripInfoPresenterProps) {
		this.#container = props.container;
		this.#info = new TripInfoView();
	}

	#renderView() {
		render(this.#info, this.#container);
	}

	removeView() {
		this.#info.removeElement();
	}
}

