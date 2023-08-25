import {AbstractView} from './_abstract';
import {getEventAddTemplate} from '../template/event-add';
import {Destination, EventType, Offer, Point, ResponseOffer} from '../contracts/contracts';
import {StateFullOffers} from './event-edit';

interface EventAddHandlers {
		getOffersByType: (eventType: EventType) => Offer[],
		getDestinationByName: (destinationName: Destination['name']) => Destination,
		handler: ()=> void
}

interface EventAddViewProps {
	eventTypes: ResponseOffer['type'][],
	destinationsNames: Destination['name'][],
	state: Point,
	handlers: EventAddHandlers
}
class EventAddView extends AbstractView<HTMLFormElement>{
	#eventTypes: EventType[];
	#destination: Destination | null = null;
	#destinationsNames: Destination['name'][];
	#offers: Offer[] = [];
	#state: Point;
	#handlers: EventAddHandlers;
	constructor(props: EventAddViewProps) {
		super();
		this.#eventTypes = props.eventTypes;
		this.#destinationsNames = props.destinationsNames;
		this.#state = props.state;
		this.#handlers = props.handlers;
	}

	getStateFullOffers = (): StateFullOffers[] => {
		const stateFullOffers = this.#offers.map((offer) => Object.assign(offer, {checked: true}));
		const offersByType = this.#handlers.getOffersByType(this.#state.type)
			.filter((offer) => !this.#offers.includes(offer))
			.map((offer) => Object.assign((offer), {checked: false}));
		return [...stateFullOffers,...offersByType];
	};

	get template(): string {
		return getEventAddTemplate({
			state: this.#state,
			eventTypes: this.#eventTypes,
			destinationsNames: this.#destinationsNames,
			destination: this.#destination
		},
		this.getStateFullOffers());
	}
}

export {EventAddView};
export type {EventAddViewProps};

