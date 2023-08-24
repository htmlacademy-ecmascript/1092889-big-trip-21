import * as dayjs from 'dayjs';
import {generateRandomNumber} from './randomizers';

const addLeadingZero = (number: number): string => (number.toString().length <= 1) ? `0${number}` : number.toString();


const getTimePairsInit = (startTime: dayjs.Dayjs) => {
	let initialTime = startTime;
	return () => {
		const newTime = initialTime.add(generateRandomNumber(0,2), 'day')
			.add(generateRandomNumber(0,24), 'hours')
			.add(generateRandomNumber(0,60), 'minutes');
		const res = {
			dateFrom: initialTime,
			dateTo: newTime
		};
		initialTime = newTime;
		return res;
	};
};

const getRelativeTime = (firstTime: dayjs.Dayjs, secondTime: dayjs.Dayjs) => {

	const timeGap = secondTime.toDate().getTime() - firstTime.toDate().getTime();

	const dateGap = new Map ([
		['Y', new Date(timeGap).getFullYear() - 1970],
		['m', new Date(timeGap).getUTCMonth()],
		['D', new Date(timeGap).getDate() - 1],
		['H', new Date(timeGap).getUTCHours()],
		['M', new Date(timeGap).getUTCMinutes()]
	]);

	let timeString = '';
	for (const key of dateGap.keys()) {
		if ((key === 'Y' || 'm' || 'D') && dateGap.get(key) === 0) {
			dateGap.delete(key);
		}else {
			timeString += `${addLeadingZero(dateGap.get(key)!)}${key} `;
		}
	}
	return timeString;
};


export {getTimePairsInit, getRelativeTime};
