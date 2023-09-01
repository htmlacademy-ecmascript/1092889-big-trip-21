import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {getTripInfoTemplate} from '../template/trip-info';
import {Destination} from '../contracts/contracts';

interface TripInfoViewProps {
	destinations: Destination['name'][],
	price: number,
	dates: string[];
}

class TripInfoView extends AbstractStatefulView<HTMLElement>{
	#destinations: Destination['name'][];
	#price: number;
	#dates: string[];

	constructor(props: TripInfoViewProps) {
		super();
		this.#destinations = props.destinations;
		this.#price = props.price;
		this.#dates = props.dates;
	}

	get template(): string {
		return getTripInfoTemplate(this.#getDestinations(), this.#price) ;
	}

	#getDestinations = (): string => {
		if (this.#destinations.length > 3) {
			return [this.#destinations[0], '...', this.#destinations.slice(-1)[0]].join(' - ');
		}
		return this.#destinations.join(' - ');
	};


}

export {TripInfoView};
