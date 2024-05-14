import {render, RenderPosition} from '../render.js';
import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import TripInfo from '../view/trip-info.js';
import TripPoint from '../view/trip-point.js';
import EditPoint from '../view/edit-point.js';

export default class GeneralPresenter {
  constructor({pointModel}) {
    this.tripInfoElement = document.querySelector('.trip-main');
    this.tripEventsSectionElement = document.querySelector('.trip-events');
    this.filtersSectionElement = document.querySelector('.trip-controls__filters');

    this.tripPointsContainerElement = document.createElement('ul');
    this.tripPointsContainerElement.classList.add('trip-events__list');
    this.tripEventsSectionElement.appendChild(this.tripPointsContainerElement);
    this.pointModel = pointModel;
  }

  init() {
    this.primePoints = [...this.pointModel.getPoints()];
    this.primeDestinations = [...this.pointModel.getDestinations()];
    this.primeOffers = [...this.pointModel.getOffers()];

    render(new TripInfo(), this.tripInfoElement, RenderPosition.AFTERBEGIN);
    render(new Sorting(), this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
    render(new Filters(), this.filtersSectionElement);

    const renderEditPoint = new EditPoint({
      point: this.primePoints[1],
      allOffers: this.pointModel.getOffersByType(this.primePoints[1].type),
      allDestinations: this.pointModel.getDestinations(),
      pointDestination: this.pointModel.getDestinationsById(this.primePoints[1].destination)
    });
    render(renderEditPoint, this.tripPointsContainerElement, RenderPosition.AFTERBEGIN);

    for (let i = 0; i < this.primePoints.length; i++) {
      const tripPoint = new TripPoint({
        point: this.primePoints[i],
        allOffers: [...this.pointModel.getOffersById(this.primePoints[i].type, this.primePoints[i].offers)],
        allDestinations: this.pointModel.getDestinationsById(this.primePoints[i].destination)
      });
      render(tripPoint, this.tripPointsContainerElement);
    }
  }
}
