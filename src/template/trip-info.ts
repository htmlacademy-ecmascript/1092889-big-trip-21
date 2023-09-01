const getTripInfoTemplate = (destinations: string, price: number) => `<section class="trip-main__trip-info  trip-info">
<div class="trip-info__main">
<h1 class="trip-info__title">${destinations}</h1>

<p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
</div>

<p class="trip-info__cost">
Total: &euro;&nbsp;<span class="trip-info__cost-value">${price}</span>
</p>
</section>`;

export {getTripInfoTemplate};
