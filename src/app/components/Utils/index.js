import moment from 'moment';
import Fields from '../../constants/Fields';

const timeFormatterMMDDHHmm = data => moment(data.value).format('MM/DD HH:mm');

// Applying all filters
const applyFilterList = (data, filterList = [], show = false) => {
  const shouldPass = r => filterList.every((filterObj) => {
    if (filterObj.filterLogic) {
      return filterObj.filterLogic(r);
    }
    return true;
  });
  if (data && data.length > 0) {
    if (show) {
      return data.map(r => ({
        ...r,
        [Fields.FILTERED_STATE]: shouldPass(r),
      }));
    }
    return data.filter(r => shouldPass(r));
  }
  return [];
};

const applyFilters = (data, filters) => {
  const allFilters = Object.values(filters);
  const coreFilters = allFilters.filter(f => !f.filterVisibilityFlag);
  const highlightFilters = allFilters.filter(f => f.filterVisibilityFlag);
  const dataAfterApplyingCoreFilters = applyFilterList(data, coreFilters);
  const dataAfterApplyingHighlightFilters = applyFilterList(
    dataAfterApplyingCoreFilters,
    highlightFilters,
    true,
  );
  return dataAfterApplyingHighlightFilters;
};

export { timeFormatterMMDDHHmm, applyFilters };
