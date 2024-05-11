// import {points} from '../mock/points.js';
import {render, RenderPosition} from '../render.js';
import Sorting from '../view/sorting.js';
import Filters from '../view/filters.js';
import TripInfo from '../view/trip-info.js';
import TripPoint from '../view/trip-point.js';
import AddPoint from '../view/add-point.js';
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

  renderTripInfo() {
    render(new TripInfo(), this.tripInfoElement, RenderPosition.AFTERBEGIN);
  }

  renderSorting() {
    render(new Sorting(), this.tripEventsSectionElement, RenderPosition.AFTERBEGIN);
  }

  renderFilters() {
    render(new Filters(), this.filtersSectionElement);
  }

  renderTripPoint() {
    const points = this.pointModel.getPoints();
    const destinations = this.pointModel.getDestinations();
    const offers = this.pointModel.getOffers();
    // console.log(destinations);

    points.forEach((point) => {
      render(new TripPoint(point, destinations, offers), this.tripPointsContainerElement);
    });
  }

  renderAddPoint() {
    render(new AddPoint(), this.tripPointsContainerElement, RenderPosition.AFTERBEGIN);
  }

  renderEditPoint() {
    render(new EditPoint(), this.tripPointsContainerElement, RenderPosition.AFTERBEGIN);
  }

  init() {
    this.renderTripInfo();
    this.renderSorting();
    this.renderFilters();
    this.renderTripPoint();
    this.renderAddPoint();
    this.renderEditPoint();
  }
}
