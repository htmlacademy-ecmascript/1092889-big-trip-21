import ApiService from '../framework/api-service';
import {Point, ResponsePoint} from '../contracts/contracts';


const enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

export default class EventsApiService extends ApiService {
	get points() {
		return this._load({url: 'points'})
			.then(ApiService.parseResponse);
	}

	get destinations() {
		return this._load({url: 'destinations'})
			.then(ApiService.parseResponse);
	}

	get offers() {
		return this._load({url: 'offers'})
			.then(ApiService.parseResponse);
	}

	async addPoint(point: Omit<ResponsePoint,'id'>) {
		return await this._load({
			url: 'points',
			method: Method.POST,
			body: JSON.stringify(point),
			headers: new Headers({'Content-Type': 'application/json'}),
		}).then(ApiService.parseResponse);
	}

	async updatePoint(id: Point['id'], newPoint: Omit<ResponsePoint, 'id'>) {
		return await this._load({
			url: `points/${id}`,
			method: Method.PUT,
			body: JSON.stringify({...newPoint, id: id}),
			headers: new Headers({'Content-Type': 'application/json'}),
		}).then(ApiService.parseResponse);
	}

	async removePoint(id: Point['id']) {
		return await this._load({
			url: `points/${id}`,
			method: Method.DELETE,
		}).then(ApiService.checkStatus);
	}

}
