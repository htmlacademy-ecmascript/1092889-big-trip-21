
import {Destination} from '../contracts/contracts';
import EventsApiService from '../service/events-api-service';
import Observable from '../framework/observable';

export default class DestinationsModel extends Observable{
	#service: EventsApiService;
	#destinations: Destination[] = [];
	#destinationsNames: Destination['name'][] = [];

	constructor(service: EventsApiService) {
		super();
		this.#service = service;
	}

	async init() {
		try {
			this.#destinations = await this.#service.destinations!.then((response) => response);
			this.#destinationsNames = this.#destinations.map((destination) => destination.name);
		} catch {
			throw new Error('Error while fetching data');
		}
	}

	get destinations() {
		return this.#destinations;
	}

	get destinationTemplate() {
		return ({
			id: '',
			name: '',
			description: '',
			pictures: []
		});
	}

	get destinationsNames() {
		return this.#destinationsNames;
	}

	getById(id: Destination['id']): Destination {
		return this.#destinations.find((destination) => destination.id === id)!;
	}

	getByName(name: Destination['name']): Destination {
		return this.#destinations.find((destination) => destination.name === name)!;
	}
}
