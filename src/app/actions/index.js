import actionTypes from './constants';

const applyFilter = filterObj => ({
  type: actionTypes.APPLY_FILTER,
  payload: filterObj,
});

export { applyFilter };

