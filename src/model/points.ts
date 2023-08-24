import {Point} from '../contracts/contracts';
import MockService from '../service/mock';

export default class PointsModel {
	#service: MockService | null = null;
	#points: Point[]| null = null;
	constructor(service: MockService){
		this.#service = service;
		this.#points = service.getPoints();
	}

	get points() {
		return this.#points;
	}

	getById(id: string): Point {
		return this.#points!.filter((point) => point.id === id)[0];
	}


	update() {

	}

	delete() {

	}
}

