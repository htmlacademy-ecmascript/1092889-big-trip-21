import {Destination, EventType} from './contracts';

const EVENT_TYPES : EventType[] = [
	'Flight',
	'Taxi',
	'Bus',
	'Train',
	'Ship',
	'Drive',
	'Check-in',
	'Sightseeing',
	'Restaurant'
];

const DESTINATIONS: Destination['name'][] = [
	'Bangkok',
	'Paris',
	'London',
	'Dubai',
	'Singapore',
	'Kuala Lumpur',
	'New York',
	'Istanbul',
	'Tokyo',
	'Antalya',
	'Seoul',
	'Osaka',
	'Makkah',
	'Phuket',
	'Pattaya',
	'Milan',
	'Barcelona',
	'Palma de Mallorca',
	'Bali',
	'Hong Kong'
];

export {EVENT_TYPES, DESTINATIONS};
