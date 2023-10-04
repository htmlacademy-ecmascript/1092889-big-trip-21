import * as dayjs from 'dayjs';

const EPOCH_START_YEAR = 1970;
const addLeadingZero = (number: number): string => (number.toString().length <= 1) ? `0${number}` : number.toString();

const getRelativeTime = (firstTime: dayjs.Dayjs, secondTime: dayjs.Dayjs) => {

  const timeGap = secondTime.toDate().getTime() - firstTime.toDate().getTime();

  const dateGaps = new Map ([
    ['Y', new Date(timeGap).getFullYear() - EPOCH_START_YEAR],
    ['m', new Date(timeGap).getUTCMonth()],
    ['D', new Date(timeGap).getDate() - 1],
    ['H', new Date(timeGap).getUTCHours()],
    ['M', new Date(timeGap).getUTCMinutes()]
  ]);

  let timeString = '';
  for (const key of dateGaps.keys()) {
    if ((key === 'Y' || 'm' || 'D') && dateGaps.get(key) === 0) {
      dateGaps.delete(key);
    }else {
      timeString += `${addLeadingZero(dateGaps.get(key)!)}${key} `;
    }
  }
  return timeString;
};


export {getRelativeTime};
