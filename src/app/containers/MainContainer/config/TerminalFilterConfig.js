import Fields from '../../../constants/Fields';

export default {
  title: 'Terminals',
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
};
