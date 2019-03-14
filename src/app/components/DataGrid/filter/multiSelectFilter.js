import React, {Component} from "react";
import ReactDOM from "react-dom";
import _findIndex from 'lodash/findIndex';
import "./filterMenu.scss";
import { Scrollbars } from "react-custom-scrollbars";


const documentBody = document.body;
/**
 * onClose
 * @return {void}
 */
const onClose = () => {
  documentBody.click();
};
export default class MultiselectFilter extends Component {
  constructor(props) {
    super(props);
    this.items = [];
    let selectedItems = [];
    let model = {};

    this.field = props.colDef.field;
    this.filterConfig = props.colDef.filterConfig || {};

    this.operator = this.filterConfig.operatorType || "equals";

    const {appliedFilters} = props.column.gridOptionsWrapper;
    if (appliedFilters && appliedFilters[this.field]) {
      selectedItems = appliedFilters[this.field].values || [];
      model = {
        operator: this.operator,
        values: selectedItems
      };
    }

    this.state = {
      filteredItems: [],
      isAllSelected: false,
      isQueryResultSelected: false,
      model,
      searchTerm: '',
      selectedItems
    };

    this.onSearch = this.onSearch.bind(this);
    /**
           * @type {function}
           * setLocalState Handler
           */
    this.setLocalState = this.setLocalState.bind(this);
    /**
           * @type {function}
           * onAllSelectUnselect Handler
           */
    this.onAllSelectUnselect = this.onAllSelectUnselect.bind(this);
    /**
           * @type {function}
           * onApply Handler
           */
    this.onApply = this.onApply.bind(this);
    /**
           * @type {function}
           * onClear Handler
           */
    this.onClear = this.onClear.bind(this);
    /**
           * @type {function}
           * checkStateModel Handler
           */
    this.checkStateModel = this.checkStateModel.bind(this);
    /**
           * @type {function}
           * populateDropdownItems Handler
           */
    this.populateDropdownItems = this.populateDropdownItems.bind(this);
    /**
           * @type {function}
           * onAllSelectUnselect Handler
           */
    this.onSearchSelectUnSelect = this.onSearchSelectUnSelect.bind(this);
  }
  componentDidMount() {
    this.populateDropdownItems();
  }
  onAllSelectUnselect() {
    // this.searchBox.value = '';

    if (this.state.isAllSelected) {
      this.setState({filteredItems: this.items, isAllSelected: false, searchTerm: '', selectedItems: []});
    } else {
      this.setState({
        filteredItems: this.items,
        isAllSelected: this.isAllItemsSelected(this.items, this.state.filteredItems),
        searchTerm: '',
        selectedItems: [...this.state.filteredItems]
      });
    }
  }

  onApply() {
    let newModel = {};

    if (this.state.selectedItems.length > 0 && this.state.selectedItems.length !== this.items.length) {
      newModel = {
        operator: this.operator,
        returnPropName: this.filterConfig.returnPropName || 'name',
        values: this.state.selectedItems
      };
    }
    onClose();
    this.setState({
      model: newModel
    }, this.props.filterChangedCallback);
  }

  doesFilterPass = params => {
    if(!params.data[this.field]) return false;
    return this.state.model.values.map(val => 
      val[this.filterConfig.returnPropName].toString().toLowerCase()).indexOf(params.data[this.field].toString().toLowerCase()) >-1
      
  }
  onClear() {
    onClose();
    this.onApply();
    this.setState({
      model: {},
      selectedItems: []
    }, this.props.filterChangedCallback);
  }

  onItemSelected(item) {
    const selectedItems = [...this.state.selectedItems];

    if (this.isItemSelected(selectedItems, item)) {
      selectedItems.push(item);
      this.setState({
        isAllSelected: this.isAllItemsSelected(this.state.filteredItems, selectedItems),
        isQueryResultSelected: this.isAllItemsSelected(this.state.filteredItems, selectedItems),
        selectedItems
      });
    } else {
      selectedItems.forEach((t, i) => {
        if (item.id === t.id) {
          selectedItems.splice(i, 1);
        }
      });

      // set state
      this.setState({isAllSelected: false, isQueryResultSelected: false, selectedItems});
    }
  }

  onSearch(e) {
    // get query result
    const queryResult = [];
    let searchTerm;

    if (e) {
      searchTerm = e.target.value.toLowerCase();
    }
    this.items.forEach((item) => {
      if (item[this.filterConfig.returnPropName].toLowerCase().indexOf(searchTerm) !== -1) {
        queryResult.push(item);
      }
    });

    if (e.key === 'Enter') {
      this.searchBox.value = '';
      if (this.state.isAllSelected) {
        this.setState({filteredItems: this.items, isAllSelected: false, searchTerm: '', selectedItems: []});
      } else {
        this.setState({
          filteredItems: this.items,
          isAllSelected: this.isAllItemsSelected(this.items, queryResult),
          searchTerm: '',
          selectedItems: [...this.state.selectedItems.concat(queryResult)]
        });
      }
      setTimeout(() => {
        this.onApply();
      }, 0);
    } else {
      // set state
      this.setState({
        filteredItems: queryResult,
        isAllSelected: this.isAllItemsSelected(queryResult, this.state.selectedItems),
        searchTerm
      });
    }
  }

  onSearchSelectUnSelect() {
    if (this.state.isQueryResultSelected) {
      this.setState({isQueryResultSelected: false, selectedItems: []});
    } else {
      this.setState({
        isQueryResultSelected: true,
        selectedItems: [...this.state.filteredItems]
      });
    }
  }

  getModel() {
    return this.state.model;
  }

  setLocalState(data) {
    const items = [...data];

    if (items.length && this.filterConfig.isNullable) {
      items.splice(0, 0, {
        id: null,
        name: '(blank)'
      });
    }
    this.items = items;
    this.setState({
      filteredItems: [...this.items]
    });
  }

  setModel(model) {
    if (model) {
      this.setState({model});
    }
  }

  afterGuiAttached() {
    if (this.searchBox) {
      this.searchBox.focus();
      this.searchBox.select();
    }
  }

  checkStateModel() {
    this.searchBox.value = '';
    this.setState({
      filteredItems: this.items,
      searchTerm: '',
      selectedItems: this.state.model.values || []
    });
    this.populateDropdownItems();
    this.forceUpdate();
  }

  isAllItemsSelected(src, dest) {
    let flag = false;
    if (dest.length) {
      src.forEach((srcItem) => {
        if (_findIndex(dest, srcItem) < 0) {
          flag = true;
        }
      });
      return !flag;
    }
    return flag;
  }

  isFilterActive() {
    return !!Object.keys(this.state.model).length;
  }

  isItemSelected(selectedItems, item) {
    return selectedItems.filter(t => item.id === t.id).length === 0;
  }

  populateDropdownItems() { 
    // Get filter datasources read data from config first, if doesn't find it then fetch it from server
    if (this.items.length === 0) {
      const {gridConfig} = this.props.column.gridOptionsWrapper;
      if (gridConfig && gridConfig.filterDatasources && gridConfig.filterDatasources[this.field]) {
        setTimeout(() => {
          this.setLocalState(gridConfig.filterDatasources[this.field].data);
        }, 0);
      } else {
        let data = [],  carry = [], field = this.field;
        this.props.api.forEachNode(function(rowNode, index) {
          if(rowNode.data[field] != undefined && !~carry.indexOf(rowNode.data[field])){
            carry.push(rowNode.data[field]);
            data.push({id:index, value: rowNode.data[field]})
          }
        })
        this.setLocalState(data || []);
      }
    }
  }
  renderItems() {
    return this.state.filteredItems.map((item, i) => {
      const onItemSelected = this.onItemSelected.bind(this, item);
      const isSelected = this.isItemSelected(this.state.selectedItems, item);

      const classes = "";
      const key = `filter-item${i}`;
      return (
        <li role="presentation" key={key} onClick={onItemSelected} className="h-over">
          {/* <i className={classes} /> */}

          <label className="customcheckbox" htmlFor={name.field+"w"}>
            <span>{item[this.filterConfig.returnPropName].toString()}</span>
            <input type="checkbox" checked={!isSelected} />
            <span className="checkmark" />
          </label>
          
        </li>
      );
    });
  }
  renderThumb({ style, ...props }) {
    const top = 0
    const thumbStyle = {
        backgroundColor: `rgba(33, 126 ,205, 0.5)`
    };
    return (
        <div
            style={{ ...style, ...thumbStyle }}
            {...props}/>
    );
  }
  render() {
    let style = {
      backgroundColor: "#bbffbb",
      border: "2px solid #22ff22",
      borderRadius: "5px",
      height: "50px",
      width: "200px"
    };
    const classes = "";
    //let maxHeight = 175;
    const width = 300;

    return (
      <div className="filters-menu multi-select" >
        <div className="filter-header">
          <div className="search-wrapper">
            <span className="icon-search" />
            <input
              type="text"
              ref={(input) => {
              this.searchBox = input;
            }}
              className="search-field"
              onKeyUp={this.onSearch} />
              <span onClick={onClose} className="closeBtn glyphicon glyphicon-remove " />
          </div>
          {this.state.filteredItems.length ? <ul>
            {this.state.searchTerm.length ? <li role="presentation" key="allSearch" onClick={this.onSearchSelectUnSelect} className="h-over">
              <i className={classes} />
              {/* <input type="checkbox"> */}
              (Select All results)
            </li> : <li role="presentation" key="all" onClick={this.onAllSelectUnselect} className="h-over">
              <i className={classes} /> Select All
            </li>
}
          </ul> : null
}
        </div>
        {this.state.filteredItems.length ? (
          <div className="filters-body filter-scrollbar">
            <ul>
              {this.renderItems()}
            </ul>
          </div>
        ) : 
        <div className="no-data">
          No Items to display.
        </div>
}
        {this.state.filteredItems.length ? (
          <div className="filters-footer">
            <button className="btn btn-success" onClick={this.onApply}>Apply</button>
            <button className="btn btn-default" onClick={this.onClear}>Clear</button>
          </div>
        ) : null
}
      </div>
    );

  }
};
