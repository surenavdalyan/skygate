import Fields from '../../../constants/Fields';
import FilterType from '../../../constants/FilterType';

export default {
  title: 'Airlines',
  defaultFilterType: FilterType.HIGHLIGHT_FILTER,
  items: [],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.some(val =>
        r[Fields.ARRIVAL_AIRLINE_CODE] === val ||
        r[Fields.DEPARTURE_AIRLINE_CODE] === val);
    }
    return true;
  },
  headerIconClass:'span-header-image-airline'
};
