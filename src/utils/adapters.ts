import {Point, ResponsePoint} from '../contracts/contracts';

const convertToPoint = (responsePoint: ResponsePoint): Point => ({
  id: responsePoint.id,
  basePrice: responsePoint.base_price,
  dateFrom: new Date(responsePoint.date_from),
  dateTo: new Date(responsePoint.date_to),
  isFavorite: responsePoint.is_favorite,
  offers: responsePoint.offers,
  type: responsePoint.type,
  destination: responsePoint.destination
});

const convertToResponsePoint = (point: Point | Omit<Point, 'id'>): ResponsePoint | Omit<ResponsePoint,'id'> => ({
  'base_price': point.basePrice,
  'date_from': point.dateFrom.toISOString(),
  'date_to': point.dateTo.toISOString(),
  'is_favorite': point.isFavorite,
  offers: point.offers,
  type: point.type,
  destination: point.destination
});

export {convertToPoint, convertToResponsePoint};
