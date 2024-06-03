import {END_POINT, AUTHORIZATION} from './constants.js';
import PointsApiService from './server/points-api-service.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filterModel = new FilterModel();

const pointModel = new PointModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

pointModel.init();

const filterPresenter = new FilterPresenter(pointModel, filterModel);
const generatePresenter = new GeneralPresenter(pointModel, filterModel);

filterPresenter.init();
generatePresenter.init();
