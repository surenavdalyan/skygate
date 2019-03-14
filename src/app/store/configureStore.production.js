import {Store, createStore, applyMiddleware, compose } from "redux";
import promise from "redux-promise-middleware";
import thunk from "redux-thunk";
import rootReducer from "../reducers/index";

/** Create required middleware */
const middleware:Array<any> = [promise(), thunk];
const enhancers:Array<any> = [];
import { createLogger } from 'redux-logger';

export default function configureStore(): Store {
  return createStore(
    rootReducer,
    compose(applyMiddleware(...middleware, createLogger()), ...enhancers)
  );
}