import Fields from '../../../constants/Fields';

export default {
  title: 'Stands',
  items: [],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      return selectedValues.some(val => r[Fields.STAND_ID] === val);
    }
    return true;
  },
};
