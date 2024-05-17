import {render, replace, remove} from '../framework/render.js';
import TripPoint from '../view/trip-point.js';
import EditPoint from '../view/edit-point.js';

export default class PointPresenter {
  #pointContainer = null;
  #pointModel = null;
  #point = null;
  #tripPoint = null;
  #editPoint = null;

  constructor(pointModel, pointContainer) {
    this.#pointContainer = pointContainer;
    this.#pointModel = pointModel;
  }

  init(point) {
    this.#point = point;

    const prevTripPoint = this.#tripPoint;
    const prevEditPoint = this.#editPoint;

    this.#tripPoint = new TripPoint({
      point: this.#point,
      allOffers: [...this.#pointModel.getOffersById(this.#point.type, this.#point.offers)],
      allDestinations: this.#pointModel.getDestinationsById(this.#point.destination),
      onEditClick: () => this.#showEditorPoint(),
    });

    this.#editPoint = new EditPoint(
      this.#point,
      this.#pointModel.getOffersByType(this.#point.type),
      this.#pointModel.destinations,
      this.#pointModel.getDestinationsById(this.#point.destination),
      () => this.#hideEditorPoint(),
      () => this.#hideEditorPoint(),
    );

    if (prevTripPoint === null || prevEditPoint === null) {
      render(this.#tripPoint, this.#pointContainer);
      return;
    }

    if (this.#pointContainer.contains(prevTripPoint.element)) {
      replace(this.#tripPoint, prevTripPoint);
    }

    if (this.#pointContainer.contains(prevEditPoint.element)) {
      replace(this.#editPoint, prevEditPoint);
    }

    remove(prevTripPoint);
    remove(prevEditPoint);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#replaceEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  };

  #hideEditorPoint = () => {
    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #showEditorPoint = () => {
    this.#replacePointToEdit();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  #replacePointToEdit() {
    replace(this.#editPoint, this.#tripPoint);
  }

  #replaceEditToPoint() {
    replace(this.#tripPoint, this.#editPoint);
  }

  destroy() {
    remove(this.#tripPoint);
    remove(this.#editPoint);
  }
}
