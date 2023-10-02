import {FILTER_TYPE} from '../contracts/constants';

const getTextForFilterType = (filterType: FILTER_TYPE): string => {
	switch (filterType) {
		case 'present': return 'There are no present events now';
		case 'past': return 'There are no past events now';
		case 'future': return 'There are no future events now';
		default : return 'Click New Event to create your first state';
	}
};

const getPlaceholderTemplate = (filter: FILTER_TYPE) => `'<section class="trip-events">
	<h2 class="visually-hidden">Trip events</h2>
	<p class="trip-events__msg">${getTextForFilterType(filter)}</p>
</section>'`;

export {getPlaceholderTemplate};
