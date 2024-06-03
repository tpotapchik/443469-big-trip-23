import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import GeneralPresenter from './presenter/general-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const filterModel = new FilterModel();
const pointModel = new PointModel();

pointModel.init();

const filterPresenter = new FilterPresenter(pointModel, filterModel);
const generatePresenter = new GeneralPresenter(pointModel, filterModel);

filterPresenter.init();
generatePresenter.init();
