import {EventType, Offer, ResponseOffer} from '../contracts/contracts';
import Observable from '../framework/observable';
import EventsApiService from '../service/events-api-service';

export default class OffersModel extends Observable{
	#service: EventsApiService;
	#responses: ResponseOffer[] = [];
	#offers: Map<Offer['id'], Offer> = new Map();
	#eventTypes: ResponseOffer['type'][] = [];
	constructor(service: EventsApiService) {
		super();
		this.#service = service;
	}

	async init() {
		try {
			this.#responses = await this.#service.offers;
			this.#eventTypes = Array.from(new Set(this.#responses.map((value) => value.type)));
			this.#offers = this.#getMappedOffers();
		} catch {
			throw new Error('Error while fetching data');
		}
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
