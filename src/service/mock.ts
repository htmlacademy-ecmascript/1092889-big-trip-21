
import {Destination, Point, ResponseOffer} from '../contracts/contracts';
import {
	generateSeveralDestinations, generateSeveralOffers,
	generateSeveralPoints
} from '../mocks/mocks';


export default class MockService {
	#points: Point[]| null = null;
	#offers: ResponseOffer[] | null = null;
	#destinations: Destination[] | null = null;

	constructor () {
		this.#destinations = generateSeveralDestinations();
		this.#offers = generateSeveralOffers();
		this.#points = generateSeveralPoints(this.#destinations, this.#offers);
	}

	getPoints() {
		return this.#points;
	}

	getOffers() {
		return this.#offers;
	}

	getDestinations() {
		return this.#destinations;
	}

	updatePoint(id: Point['id'], newPoint: Point) {
		const pointIndex = this.#points!.findIndex((point) => point.id === id);
		this.#points![pointIndex] = newPoint;
	}

	removePoint(id: Point['id']){
		this.#points = this.#points!.filter((point) => point.id !== id);
	}
}

