import actionTypes from '../actions/constants';

const initState = {};

export default function filtersReducer(state = initState, action) {
  switch (action.type) {
    case actionTypes.APPLY_FILTER: {
      const { filterKey } = action.payload;
      return {
        ...state,
        [filterKey]: action.payload,
      };
    }
    default: break;
  }
  return state;
}
