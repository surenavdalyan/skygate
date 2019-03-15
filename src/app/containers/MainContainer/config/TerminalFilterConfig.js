import Fields from '../../../constants/Fields';
import FilterType from '../../../constants/FilterType';

export default {
  title: 'Terminals',
  defaultFilterType: FilterType.ABSOLUTE_FILTER,
  items: [
    {
      label: 'A',
      value: 'A',
    },
    {
      label: 'B',
      value: 'B',
    },
    {
      label: 'C',
      value: 'C',
    },
    {
      label: 'E',
      value: 'E',
    },
  ],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.some(val => r[Fields.TERMINAL_CODE] === val);
    }
    return true;
  },
  headerIconClass:'span-header-image-terminal'
};
