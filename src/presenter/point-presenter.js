import {Mode, UpdateType, UserAction} from '../constants.js';
import {render, replace, remove} from '../framework/render.js';
import TripPoint from '../view/trip-point.js';
import EditPoint from '../view/edit-point.js';

export default class PointPresenter {
  #pointContainer = null;
  #pointModel = null;
  #point = null;
  #tripPoint = null;
  #editPoint = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor(pointModel, pointContainer, onDataChange, onModeChange) {
    this.#pointContainer = pointContainer;
    this.#pointModel = pointModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
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
      onFavoriteClick: () => this.#handleFavoriteClick(),
    });

    this.#editPoint = new EditPoint(
      this.#point,
      this.#pointModel.offers,
      this.#pointModel.getOffersByType(this.#point.type),
      this.#pointModel.destinations,
      this.#pointModel.getDestinationsById(this.#point.destination),
      this.#handleFormSubmit,
      () => this.#hideEditorPoint(),
      () => this.#handleDeleteClick()
    );

    if (prevTripPoint === null || prevEditPoint === null) {
      render(this.#tripPoint, this.#pointContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#tripPoint, prevTripPoint);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPoint, prevEditPoint);
    }

    remove(prevTripPoint);
    remove(prevEditPoint);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#editPoint.reset();
      this.#replaceEditToPoint();
      document.removeEventListener('keydown', this.#escKeyDownHandler);
    }
  }

  destroy() {
    remove(this.#tripPoint);
    remove(this.#editPoint);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editPoint.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editPoint.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#tripPoint.shake();
      return;
    }

    const resetFormState = () => {
      this.#editPoint.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editPoint.shake(resetFormState);
  }

  #replacePointToEdit() {
    replace(this.#editPoint, this.#tripPoint);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditToPoint() {
    replace(this.#tripPoint, this.#editPoint);
    this.#mode = Mode.DEFAULT;
  }

  #hideEditorPoint = () => {
    this.#editPoint.reset();
    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #showEditorPoint = () => {
    this.#replacePointToEdit();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };


  #escKeyDownHandler = (evt) => {
    if (!this.#editPoint || evt.key !== 'Escape') {
      return;
    }

    evt.preventDefault();
    this.#editPoint.reset();
    this.#replaceEditToPoint();
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {...this.#point, isFavorite: !this.#point.isFavorite};
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
      updatedPoint
    );
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleDeleteClick = () => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      this.#point
    );
  };
}
