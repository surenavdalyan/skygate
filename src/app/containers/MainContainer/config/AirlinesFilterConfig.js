import Fields from '../../../constants/Fields';

export default {
  title: 'Airlines',
  items: [],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.some(val =>
        r[Fields.ARRIVAL_AIRLINE_CODE] === val ||
        r[Fields.DEPARTURE_AIRLINE_CODE] === val);
    }
    return true;
  },
};
