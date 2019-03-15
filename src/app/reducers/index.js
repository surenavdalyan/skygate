import { combineReducers } from 'redux';


import sampleDataReducer from './sampleDataReducer';
import filtersReducer from './filtersReducer';
/**
 * combineReducers
 */
export default combineReducers({
  sampleData: sampleDataReducer,
  filters: filtersReducer,
});
