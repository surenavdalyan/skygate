import Fields from '../../../constants/Fields';
import FilterType from '../../../constants/FilterType';

export default {
  title: 'Early/Late',
  defaultFilterType: FilterType.HIGHLIGHT_FILTER,
  items: [
    {
      label: 'Early',
      value: 'Early',
    },
    {
      label: 'Late',
      value: 'Delay',
    },
    {
      label: 'On-Time',
      value: 'On Time',
    },
  ],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.some(val => r[Fields.ARRIVAL_STATUS] === val);
    }
    return true;
  },
  headerIconClass:'span-header-image-earlyLate'
};
