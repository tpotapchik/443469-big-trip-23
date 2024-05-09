const createEventTypeTemplate = (group) => `
  <div class="event__type-item">
    <input id="event-type-${group.toLowerCase()}-1" class="event__type-input visually-hidden" type="radio" name="event-type" value="${group.toLowerCase()}">
    <label class="event__type-label  event__type-label--${group.toLowerCase()}" for="event-type-${group.toLowerCase()}-1">${group}</label>
  </div>
`;

const createOfferTemplate = (type, title, price) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox visually-hidden" id="event-offer-${type}-1" type="checkbox" name="event-offer-${type}" checked>
    <label class="event__offer-label" for="event-offer-${type}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </label>
  </div>
`;

const createDestinationTemplate = (destination) => `
 <option value="${destination}"></option>
`;

export {createEventTypeTemplate, createOfferTemplate, createDestinationTemplate};
