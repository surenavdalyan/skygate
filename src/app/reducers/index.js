import { combineReducers } from 'redux';


import sampleDataReducer from './sampleDataReducer';
/**
 * combineReducers
 */
export default combineReducers({
  sampleData: sampleDataReducer,
});
