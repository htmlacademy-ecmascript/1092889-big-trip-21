import ApiService, {LoadConfig} from '../framework/api-service';
import {Point, ResponsePoint} from '../contracts/contracts';


const enum Method {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

export default class EventsApiService extends ApiService {
	async #fetchData (config: LoadConfig) {
		return await this._load(config).then(ApiService.parseResponse);
	}

	get points() {
		return this.#fetchData({url: 'points'});
	}

	get destinations() {
		return this.#fetchData({url: 'destinations'});
	}

	get offers() {
		return this.#fetchData({url: 'offers'});
	}

	async addPoint(point: Omit<ResponsePoint,'id'>) {
		return await this._load({
			url: 'points',
			method: Method.POST,
			body: JSON.stringify(point),
			headers: new Headers({'Content-Type': 'application/json'})
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
