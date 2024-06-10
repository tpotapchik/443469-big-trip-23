import {END_POINT, AUTHORIZATION} from './constants.js';
import PointsApiService from './server/points-api-service.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';

const filterModel = new FilterModel();

const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

pointModel.init();

const tripInfoPresenter = new TripInfoPresenter(pointModel);
const filterPresenter = new FilterPresenter(pointModel, filterModel);
const generalPresenter = new GeneralPresenter(pointModel, filterModel);

tripInfoPresenter.init();
filterPresenter.init();
generalPresenter.init();
