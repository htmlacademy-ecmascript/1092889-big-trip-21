import {generateRandomBoolean, generateRandomNumber, getRandomArrayElement} from '../utils/randomizers';
import {EventType, Offer, ResponseOffer, Point, Picture, Destination} from '../contracts/contracts';
import dayjs from 'dayjs';
import {DESTINATIONS, EVENT_TYPES} from '../contracts/constants';
import {getTimePairsInit} from '../utils/time';

const offerDescriptions = [
	'Upgrade to a business class',
	'Add luggage',
	'Switch to comfort class',
	'Add meal',
	'Choose seats',
	'Travel by train',
];
const descriptions =
	['Lorem ipsum dolor sit amet,',
		'consectetur adipiscing elit. Cras aliquet varius magna,',
		'non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra.',
		'Aliquam id orci ut lectus varius viverra.',
		'Nullam nunc ex, convallis sed finibus eget,',
		'sollicitudin eget ante. Phasellus eros mauris,',
		'condimentum sed nibh vitae, sodales efficitur ipsum.',
		'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam,',
		'eu luctus nunc ante ut dui.',
		'Sed sed nisi sed augue convallis suscipit in sed felis.',
		'Aliquam erat volutpat.',
		'Nunc fermentum tortor ac porta dapibus.',
		'In rutrum ac purus sit amet tempus.'];

const getTimePairs = getTimePairsInit(dayjs().subtract(12, 'day'));

const generatePictureUrl = (city: string) => `https://loremflickr.com/320/240/${city}?random=${crypto.randomUUID()}`;
const getRandomUUID = () => crypto.randomUUID();

const generateOffer = (): Offer => ({
	id: getRandomUUID(),
	title: getRandomArrayElement(offerDescriptions),
	price: generateRandomNumber(10,140)
});

const generateResponseOffer = (): ResponseOffer => ({
	type: getRandomArrayElement(EVENT_TYPES),
	offers: Array.from({length: generateRandomNumber(0,5)}, generateOffer)
});

const generateSeveralOffers = (): ResponseOffer[] => Array.from({length: DESTINATIONS.length}, generateResponseOffer);

const generatePicture = (city: string): Picture => ({
	src: generatePictureUrl(city),
	description: getRandomArrayElement(descriptions)
});

const generateDestination = (point: string): Destination => ({
	id: getRandomUUID(),
	description: getRandomArrayElement([...descriptions, '']),
	name: point,
	pictures: Array.from({length: generateRandomNumber(0, 7)}, generatePicture.bind(this, point))
});

const generateSeveralDestinations = (): Destination[] => DESTINATIONS.map((point) => generateDestination(point));

const generateMockPoint = (destination: Destination, {type, offers}: ResponseOffer):Point => {
	const dates = getTimePairs();
	return ({
		id: getRandomUUID(),
		basePrice: generateRandomNumber(0,5000),
		dateFrom: dates.dateFrom.toDate(),
		dateTo: dates.dateTo.toDate(),
		destination: destination.id,
		isFavourite: generateRandomBoolean(),
		offers: (offers.length >= 1) ? offers.map((offer) => offer.id) : [],
		type: type
	});
};

const generateSeveralPoints = (destinations: Destination[], offers: ResponseOffer[]):Point[] => destinations.map((destination, index) => generateMockPoint(destination, offers[index]));

export {EventType, generateSeveralPoints, generateSeveralDestinations, generateSeveralOffers};

