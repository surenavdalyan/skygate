import Fields from '../../../constants/Fields';
import FilterType from '../../../constants/FilterType';

export default {
  title: 'Stands',
  defaultFilterType: FilterType.ABSOLUTE_FILTER,
  items: [],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.some(val => r[Fields.STAND_ID] === val);
    }
    return true;
  },
  headerIconClass:'span-header-image-stand'
};
