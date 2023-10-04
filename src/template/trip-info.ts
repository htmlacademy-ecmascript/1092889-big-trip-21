const getTripInfoTemplate = (destinations: string, price: number, dates: string[]) => `<section class="trip-main__trip-info  trip-info">
<div class="trip-info__main">
<h1 class="trip-info__title">${destinations}</h1>

<p class="trip-info__dates">${dates[0]} – ${dates[1]}</p>
</div>

<p class="trip-info__cost">
Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
</p>
</section>`;

export {getTripInfoTemplate};
