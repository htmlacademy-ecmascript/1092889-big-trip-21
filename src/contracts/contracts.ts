type EventType = 'Flight'|'Taxi'|'Bus'|'Train'|'Ship'|'Drive'|'Check-in'|'Sightseeing'|'Restaurant'


type Offer = {
	id: string,
	title: string,
	price: number
}
type Picture = {
	src: string,
	description: string,
}

type Destination = {
	id: string
	description: string
	name: string
	pictures: Picture[] | []
}

type ResponseOffer = {
	type: EventType,
	offers: Offer[]
}

type ResponsePoint = {
	'id': string,
	'base_price': number
	'date_from': string
	'date_to': string
	'destination': Destination['id']
	'is_favorite': boolean
	'offers': Offer['id'][]
	'type': EventType
};

type Point = {
	id: string,
	basePrice: number,
	dateFrom: Date,
	dateTo: Date,
	destination: Destination['id'],
	isFavourite: boolean,
	offers: Offer['id'][],
	type:EventType
}

export type {
	EventType,
	Offer,
	Picture,
	Destination,
	ResponseOffer,
	ResponsePoint,
	Point
};