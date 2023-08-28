import {EventEditViewProps, StateFullOffers} from '../view/event-edit';
import {Destination, EventType} from '../contracts/contracts';
import dayjs from 'dayjs';


const getEventTypesSelectTemplate = (eventTypes: EventType[]) => (
	eventTypes.map((eventType) => (
		`<div class="event__type-item">
			<input id="event-type-${eventType.toLowerCase()}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}">
			<label class="event__type-label  event__type-label--${eventType.toLowerCase()}" for="event-type-${eventType.toLowerCase()}-1">${eventType}</label>
		</div>`)).join(''));

const getOffersTemplate = (offers: StateFullOffers[]) => (
	`<section class="event__section  event__section--offers">
		<h3 class="event__section-title  event__section-title--offers">Offers</h3>
		<div class="event__available-offers">
			${(offers.map((offer) => (`
				<div class="event__offer-selector">
					<input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-${offer.id}" type="checkbox" name="event-offer-${offer.title}" ${(offer.checked) ? 'checked' : ''}>
					<label class="event__offer-label" for="event-offer-${offer.title}-${offer.id}">
						<span class="event__offer-title">${offer.title}</span>
						&plus;&euro;&nbsp;
						<span class="event__offer-price">${offer.price}</span>
					</label>
				</div>`)).join(''))}
		</div>
	</section>`);

const getDestinationTemplate = (destination: Destination) => (
	`<section class="event__section  event__section--destination">
		<h3 class="event__section-title  event__section-title--destination">Destination</h3>
		<p class="event__destination-description">${destination.description}</p>
		${(destination.pictures.length >= 1) ?
		`<div class="event__photos-container">
			<div class="event__photos-tape">
				${destination.pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
			</div>
		</div>` : ''}
	</section>`);

const getEventEditTemplate = ({state, eventTypes, destinationsNames, destination}: Omit<EventEditViewProps, 'offers'>, offers: StateFullOffers[]) =>
	`<form class="event event--edit" action="#" method="post">
		<header class="event__header">
                      <div class="event__type-wrapper">
                        <label class="event__type  event__type-btn" for="event-type-toggle-1">
                          <span class="visually-hidden">Choose event type</span>
                          <img class="event__type-icon" width="17" height="17" src="img/icons/${state.type.toLowerCase()}.png" alt="Event type icon">
                        </label>
                        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                        <div class="event__type-list">
                          <fieldset class="event__type-group">
                            <legend class="visually-hidden">Event type</legend>
							${getEventTypesSelectTemplate(eventTypes)}
                          </fieldset>
                        </div>
                      </div>

                      <div class="event__field-group  event__field-group--destination">
                        <label class="event__label  event__type-output" for="event-destination-1">
                          ${state.type}
                        </label>
                        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
                        <datalist id="destination-list-1">
                        ${destinationsNames.map((destinationName) => (`<option value="${destinationName}"></option>`)).join('')}
                        </datalist>
                      </div>

                      <div class="event__field-group  event__field-group--time">
                        <label class="visually-hidden" for="event-start-time-1">From</label>
                        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(state.dateFrom).format('YY/MM/DD hh:mm')}">
                        &mdash;
                        <label class="visually-hidden" for="event-end-time-1">To</label>
                        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(state.dateTo).format('YY/MM/DD hh:mm')}">
                      </div>

                      <div class="event__field-group  event__field-group--price">
                        <label class="event__label" for="event-price-1">
                          <span class="visually-hidden">Price</span>
                          &euro;
                        </label>
                        <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" min="0" value="${state.basePrice}">
                      </div>

                      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                      <button class="event__reset-btn" type="reset">Delete</button>
                      <button class="event__rollup-btn" type="button">
                        <span class="visually-hidden">Open event</span>
                      </button>
                    </header>
                    <section class="event__details">
						${(offers.length >= 1) ? getOffersTemplate(offers) : ''}
						${(destination.description.length) ? getDestinationTemplate(destination) : ''}
                    </section>
                  </form>`;

export {getEventEditTemplate};
