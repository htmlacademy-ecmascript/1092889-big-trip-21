import MockService from '../service/mock';
import {Destination} from '../contracts/contracts';

export default class DestinationsModel {
	#service: MockService;
	#destinations: Destination[];
	#destinationsNames: Destination['name'][];

	constructor(service: MockService) {
		this.#service = service;
		this.#destinations = this.#service.getDestinations()!;
		this.#destinationsNames = this.#destinations.map((destination) => destination.name);
	}

	get destinations() {
		return this.#destinations;
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
