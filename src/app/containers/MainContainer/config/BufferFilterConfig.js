import Fields from '../../../constants/Fields';

const FilterForValue = {
  LessThan30Min: m => m >= 0 && m < 30,
  HalfHrTo2Hrs: m => m >= 0 && m >= 30 && m <= 120,
  GreaterThan2Hrs: m => m >= 0 && m > 120,
};

export default {
  title: 'Buffer',
  items: [
    {
      label: '<30 min',
      value: 'LessThan30Min',
    },
    {
      label: '0.5-2 Hrs',
      value: 'HalfHrTo2Hrs',
    },
    {
      label: '>2 Hrs',
      value: 'GreaterThan2Hrs',
    },
  ],
  filterLogic: (r, selectedValues) => {
    if (selectedValues && selectedValues.length > 0) {
      const bufferStr = r[Fields.BUFFER];
      if (bufferStr) {
        const [hrs, mns] = bufferStr.split(':');
        const totalBufferInMinutes = (+hrs) * 60 + (+mns);
        return selectedValues.some(val => FilterForValue[val](totalBufferInMinutes));
      }
      return false;
    }
    return true;
  },
};
