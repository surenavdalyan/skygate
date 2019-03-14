import React from 'react';
import { Checkbox } from 'react-bootstrap';

import './index.scss';

class FilterPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterState: props.config.items.map(filterItem => ({
        ...filterItem,
        selected: false,
      })),
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
      const selectedValues = filterState.filter(item => item.selected).map(i => i.value);
      console.log(selectedValues);
    });

    // console.log(e.target.checked);
  };

  render() {
    const { filterState } = this.state;
    return (
      <div className="pane-container">
        <div className="pane-header">
          <span>{this.props.config.title}</span>
        </div>
        <div className="pane-content">
          {
            filterState.map(item => (
              <div className="filter-item">
                <Checkbox checked={item.selected} onChange={e => this.onChange(e, item.value)}>{item.label}</Checkbox>
              </div>
                ))
        }
        </div>
      </div>
    );
  }
}

export default FilterPane;
