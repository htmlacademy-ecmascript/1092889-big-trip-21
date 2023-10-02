import {Point, ResponsePoint} from '../contracts/contracts';
import Observable from '../framework/observable';
import EventsApiService from '../service/events-api-service';
import {convertToPoint, convertToResponsePoint} from '../utils/adapters';

export default class PointsModel extends Observable {
	#service: EventsApiService;
	#points: Point[]| null = null;
	constructor(service: EventsApiService){
		super();
		this.#service = service;
	}

	getBlankPoint = ():Omit<Point, 'id'> => ({
		basePrice: 0,
		dateFrom: new Date(),
		dateTo: new Date(),
		destination:'',
		isFavorite: false,
		offers: [],
		type: 'flight'
	});

	async init() {
		try {
			const responsePoints = await this.#service.points;
			this.#points = responsePoints.map(convertToPoint);
			this._notify('INIT');
		} catch {
			throw new Error('Error while fetching data');
		}
	}

	get points() {
		return this.#points;
	}

	getById(id: string): Point {
		return this.#points!.filter((point) => point.id === id)[0];
	}

	async createPoint(point: Point) {
		try {
			await this.#service!.addPoint(convertToResponsePoint(point));
			const responsePoints = await this.#service.points;
			this.#points = responsePoints.map((responsePoint: ResponsePoint) => convertToPoint(responsePoint));
			this._notify('MAJOR', this.points);
		} catch {
			throw new Error('Error while creating Point');
		}
	}

	async updatePoint(point: Point) {
		try {
			await this.#service!.updatePoint(point.id, convertToResponsePoint(point));
			const responsePoints = await this.#service.points;
			this.#points = responsePoints.map((responsePoint: ResponsePoint) => convertToPoint(responsePoint));
			this._notify('MAJOR', this.points);
		} catch {
			throw new Error('Error while updating Point');
		}
	}

	updateFavorite = async (point: Point) =>{
		try {
			const newPoint = await this.#service!.updatePoint(point.id, convertToResponsePoint({...point, isFavorite: !point.isFavorite }));
			this._notify('PATCH', convertToPoint(newPoint));
		} catch {
			throw new Error('Error while updating Favorite');
		}
	};

	async delete(id: Point['id']) {
		try {
			await this.#service.removePoint(id);
			const responsePoints = await this.#service.points;
			this.#points = responsePoints.map((responsePoint: ResponsePoint) => convertToPoint(responsePoint));
			this._notify('MAJOR', this.points);
		} catch {
			throw new Error('Error while deleting Point');
		}
	}
}

