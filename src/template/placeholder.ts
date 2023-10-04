import {FilterType} from '../contracts/constants';

const getTextForFilterType = (filterType: FilterType): string => {
  switch (filterType) {
    case ('present'): {
      return 'There are no present events now';
    }
    case ('past'): {
      return 'There are no past events now';
    }
    case ('future'): {
      return 'There are no future events now';
    }
    default : {
      return 'Click New Event to create your first point';
    }
  }
};

const getPlaceholderTemplate = (filter: FilterType) => `
  <p class="trip-events__msg">${getTextForFilterType(filter)}</p>`;

export {getPlaceholderTemplate};
