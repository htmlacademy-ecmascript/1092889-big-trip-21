import {EventType, Offer, ResponseOffer} from '../contracts/contracts';
import MockService from '../service/mock';

export default class OffersModel {
	#service: MockService;
	#responses: ResponseOffer[];
	#offers: Map<Offer['id'], Offer>;
	#eventTypes: ResponseOffer['type'][];
	constructor(service: MockService) {
		this.#service = service;
		this.#responses = this.#service.getOffers()!;
		this.#eventTypes = Array.from(new Set(this.#responses.map((value) => value.type)));
		this.#offers = this.#getMappedOffers();
	}

	get eventTypes() {
		return this.#eventTypes;
	}

	getByType = (type: EventType) => this.#responses.find((offer) => offer.type === type);

	#getMappedOffers = () => {
		const offers = this.#responses.flatMap((response) => response.offers);
		return new Map(offers.map((offer) => [offer.id,offer]));
	};

	getById = (id: Offer['id']): Offer => this.#offers.get(id)!;
}
