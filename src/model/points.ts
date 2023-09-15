import {Point} from '../contracts/contracts';
import MockService from '../service/mock';
import Observable from '../framework/observable';

export default class PointsModel extends Observable {
	#service: MockService | null = null;
	#points: Point[]| null = null;
	constructor(service: MockService){
		super();
		this.#service = service;
		this.#points = service.getPoints();
	}

	get points() {
		return this.#points;
	}

	getById(id: string): Point {
		return this.#points!.filter((point) => point.id === id)[0];
	}

	createPoint = (point: Point) => {
		this.#service!.addPoint(point);
		this.#points = this.#service!.getPoints();
		this._notify('MAJOR', this.points);
	};

	updatePoint = (point: Point) => {
		this.#service!.updatePoint(point.id, point);
		this.#points = this.#service!.getPoints();
		this._notify('MAJOR', this.points);
	};

	updateFavorite = (point: Point) =>{
		const newPoint = this.#service!.updatePoint(point.id, {...point, isFavourite: !point.isFavourite });
		this._notify('PATCH', newPoint);
	};

	delete(id: Point['id']) {
		this.#service?.removePoint(id);
		this.#points = this.#service!.getPoints();
		this._notify('MAJOR', this.points);
	}
}

