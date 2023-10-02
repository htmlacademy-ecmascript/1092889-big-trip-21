
type FILTER_TYPE = 'everything' | 'future' | 'present' | 'past';

type SORT_TYPE = 'sort-day' | 'sort-time' | 'sort-price'

const enum FilterType {
	ALL = 'everything',
	FUTURE = 'future',
	PRESENT = 'present',
	PAST = 'past'
}

const enum SortType {
	DAY = 'sort-day',
	TIME = 'sort-time',
	PRICE = 'sort-price'
}
export {FILTER_TYPE, SORT_TYPE, FilterType, SortType};
