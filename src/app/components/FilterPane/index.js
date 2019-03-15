import React from 'react';
import { connect } from 'react-redux';
import { Checkbox } from 'react-bootstrap';
import { bindActionCreators } from 'redux';
import { applyFilter } from '../../actions';
import FIlterType from '../../constants/FilterType';

import './index.scss';

class FilterPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterState: props.config.items.map(filterItem => ({
        ...filterItem,
        selected: false,
      })),
      filterVisibilityFlag: props.config.defaultFilterType === FIlterType.HIGHLIGHT_FILTER,      
    };
  }

  onChange = (e, value) => {
    let filterState = [...this.state.filterState];
    filterState = filterState.map((item) => {
      if (item.value === value) {
        return {
          ...item,
          selected: e.target.checked,
        };
      }
      return item;
    });
    this.setState({ filterState }, () => {
      this.applyFilter();
    });
    // console.log(e.target.checked);
  };

  applyFilter = () => {
    const { filterState, filterVisibilityFlag } = this.state;
    const selectedValues = filterState
      .filter(item => item.selected)
      .map(i => i.value);
    // console.log(selectedValues);
    const filterLogic = r => this.props.config.filterLogic(r, selectedValues);
    this.props.applyFilter({
      filterLogic,
      filterKey: this.props.config.title,
      filterVisibilityFlag,
    });
  };

  filterVisibilityChanged = () => {
    const filterVisibilityFlag = !this.state.filterVisibilityFlag;
    this.setState({ filterVisibilityFlag }, () => {
      this.applyFilter();
    });
  };

  render() {
    const { filterState, filterVisibilityFlag } = this.state;
    const visibilityIcon = filterVisibilityFlag ? 'fa fa-eye' : 'fa fa-eye-slash';
    return (
      <div className="pane-container">
        <div className="pane-header">
          <span className={this.props.config.headerIconClass} />
          <span>{this.props.config.title}</span>
          <i className={visibilityIcon} onClick={this.filterVisibilityChanged} />
        </div>
        <div className="pane-content">
          {filterState.map(item => (
            <div className="filter-item">
              <Checkbox
                checked={item.selected}
                onChange={e => this.onChange(e, item.value)}
              >
                {item.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ applyFilter }, dispatch);
}

export default connect(null, mapDispatchToProps)(FilterPane);
