import GeneralPresenter from './presenter/general-presenter.js';
import PointModel from './model/point-model.js';

const pointModel = new PointModel();
pointModel.init();

const generatePresenter = new GeneralPresenter({pointModel});

generatePresenter.init();
