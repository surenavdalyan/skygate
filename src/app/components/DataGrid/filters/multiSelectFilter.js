// @flow
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["isItemSelected", "isAllItemsSelected"] } ] */
import React from 'react';
import { Button } from 'react-bootstrap';
import cx from 'classnames';
import _findIndex from 'lodash/findIndex';
/**
 * State defination
 */
type State = {
    searchTerm: string,
    selectedItems: Array<Object>,
    filteredItems: Array<Object>,
    isAllSelected: boolean,
    isQueryResultSelected: boolean,
    model: Object
};

const documentBody: any = document.body;
/**
 * onClose
 * @return {void}
 */
const onClose = () => {
  documentBody.click();
};

/**
 * MultiSelectFilter
 */
export default class MultiSelectFilter extends React.Component {
  /**
   * constructor
   * @param {Object} props parent's properties
   */
  constructor(props: any) {
    super(props);
    this.items = [];
    let selectedItems = [];
    let model = {};

    // col field name
    this.field = props.colDef.field;
    this.filterConfig = props.colDef.filterConfig || {};
    this.operator = this.filterConfig.operatorType || 'equals';
        // Get appliedFilters if any
    const { appliedFilters } = props.column.gridOptionsWrapper;
    if (appliedFilters && appliedFilters[this.field]) {
      selectedItems = appliedFilters[this.field].values || [];
      model = {
        operator: this.operator,
        values: selectedItems,
      };
    }
         /**
         * @type {object}
         * @property {array} searchTerm search string
         * @property {array} selectedItems selection values
         * @property {array} filteredItems search results
         * @property {array} isAllSelected All checkbox
         * @property {array} model filter model
         */
    this.state = {
      searchTerm: '',
      selectedItems,
      filteredItems: [],
      isAllSelected: false,
      isQueryResultSelected: false,
      model,
    };
        /**
         * @type {function}
         * onSearch Handler
         */
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
  state: State;
  /**
  * onAllSelectUnselect
  * @return {void}
  */
  onAllSelectUnselect(): void {
        // this.searchBox.value = '';

    if (this.state.isAllSelected) {
      this.setState({
        searchTerm: '',
        selectedItems: [],
        isAllSelected: false,
        filteredItems: this.items,
      });
    } else {
      this.setState({
        searchTerm: '',
        selectedItems: [...this.state.filteredItems],
        isAllSelected: this.isAllItemsSelected(this.items, this.state.filteredItems),
        filteredItems: this.items,
      });
    }
  }
  onAllSelectUnselect: Function;
  /**
   * onApply
   * @return {void}
   */
  onApply(): void {
    let newModel = {};

    if (this.state.selectedItems.length > 0 && this.state.selectedItems.length !== this.items.length) {
      newModel = {
        operator: this.operator,
        values: this.state.selectedItems,
        returnPropName: this.filterConfig.returnPropName || 'name',
      };
    }
    onClose();
    this.setState({ model: newModel }, this.props.filterChangedCallback);
  }

  onApply: Function;

  onClear: Function;

  /**
  * onClose
  * @return {void}
  */
  onClear(): void {
    onClose();
    this.setState({ model: {}, selectedItems: [] }, this.props.filterChangedCallback);
  }

  /**
   * onItemSelected
   * @param {object} item
   * @return {void}
   */
  onItemSelected(item: Object): void {
    const selectedItems = [...this.state.selectedItems];

    if (this.isItemSelected(selectedItems, item)) {
      selectedItems.push(item);
      this.setState({
        selectedItems,
        isAllSelected: this.isAllItemsSelected(this.state.filteredItems, selectedItems),
        isQueryResultSelected: this.isAllItemsSelected(this.state.filteredItems, selectedItems),
      });
    } else {
      selectedItems.forEach((t, i) => {
        if (item.id === t.id) {
          selectedItems.splice(i, 1);
        }
      });

            // set state
      this.setState({
        selectedItems,
        isAllSelected: false,
        isQueryResultSelected: false,
      });
    }
  }
  onSearch: Function;
  /**
  * isItemSelected
  * @param {object} e event
  * @return {void}
  */
  onSearch(e: Object): void {
         // get query result
    const queryResult = [];
    let searchTerm;

    if (e) {
      searchTerm = e.target.value.toLowerCase();
    }
    this.items.forEach((item) => {
      if (item.name.toLowerCase().indexOf(searchTerm) !== -1) { queryResult.push(item); }
    });

    if (e.key === 'Enter') {
      this.searchBox.value = '';
      if (this.state.isAllSelected) {
        this.setState({
          searchTerm: '',
          selectedItems: [],
          isAllSelected: false,
          filteredItems: this.items,
        });
      } else {
        this.setState({
          searchTerm: '',
          selectedItems: [...this.state.selectedItems.concat(queryResult)],
          isAllSelected: this.isAllItemsSelected(this.items, queryResult),
          filteredItems: this.items,
        });
      }
      setTimeout(() => {
        this.onApply();
      }, 0);
    } else {
            // set state
      this.setState({
        searchTerm,
        isAllSelected: this.isAllItemsSelected(queryResult, this.state.selectedItems),
        filteredItems: queryResult,
      });
    }
  }
  /**
  * onSearchSelectUnSelect
  * @return {void}
  */
  onSearchSelectUnSelect() {
    if (this.state.isQueryResultSelected) {
      this.setState({
        selectedItems: [],
        isQueryResultSelected: false,
      });
    } else {
      this.setState({
        isQueryResultSelected: true,
        selectedItems: [...this.state.filteredItems],
      });
    }
  }
  onSearchSelectUnSelect: Function;
  /**
   * getModel
   * @return {Object} return filter's model
   */
  getModel(): Object {
    return this.state.model;
  }
  /**
    * setLocalState
    * @param {object} data filter datasource
    * @return {void}
    */
  setLocalState(data: Array<Object>): void {
    const items = [...data];

    if (items.length && this.filterConfig.isNullable) {
      items.splice(0, 0, {
        id: null,
        name: '(blank)',
      });
    }
    this.items = items;
    this.setState({
      filteredItems: [...this.items],
    });
  }
  setLocalState: Function;
  /**
  * setModel
  * @param {object} model set filter's model
  * @return {void}
  */
  setModel(model: Object): void {
    if (model) {
      this.setState({
        model,
      });
    }
  }
  afterGuiAttached() {
    if (this.searchBox) {
      this.searchBox.focus();
      this.searchBox.select();
    }
  }
  /**
   * checkStateModel
   * @return {void}
   */
  checkStateModel() {
    this.searchBox.value = '';
    this.setState({
      selectedItems: this.state.model.values || [],
      filteredItems: this.items,
      searchTerm: '',
    });
    this.populateDropdownItems();
    this.forceUpdate();
  }
  checkStateModel: Function;
  field: string;
  filterConfig: Object;
  /**
   * isItemSelected
   * @param {object} src src items
   * @param {object} dest dest items
   * @return {boolean} flag
   */
  isAllItemsSelected(src: Array<Object>, dest: Array<Object>): boolean {
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
  /**
  * isFilterActive called by ag-grid use to set filter status on given column
  * @return {boolean} filter active flag
  */
  isFilterActive(): boolean {
    return !!Object.keys(this.state.model).length;
  }

  /**
   * isItemSelected
   * @param {object} selectedItems all selected items
   * @param {object} item current selected item
   * @return {boolean} flag
   */
  isItemSelected(selectedItems: Array<Object>, item: Object): boolean {
    return selectedItems.filter(t => item.id === t.id).length === 0;
  }
  items: Array<Object>;
  /**
   * populateDropdownItems
   * @return {void}
   */
  populateDropdownItems(): void {
        // Get filter datasources
        // read data from config first, if doesn't find it
        // then fetch it from server
    if (this.items.length === 0) {
      const { gridConfig } = this.props.column.gridOptionsWrapper;
      if (gridConfig && gridConfig.filterDatasources && gridConfig.filterDatasources[this.field]) {
        setTimeout(() => {
          this.setLocalState(gridConfig.filterDatasources[this.field].data);
        }, 0);
      } else {
        this.filterConfig.dataSource().then((response) => {
          this.setLocalState(response.data || []);
        });
      }
    }
  }
  populateDropdownItems: Function;
  returnPropName: string;
  searchBox: Object;
  /**
   * renderItems use to render dropdown list
   * @return {Array} return react elements
   */
  renderItems(): Array<any> {
    return this.state.filteredItems.map((item, i) => {
      const onItemSelected = this.onItemSelected.bind(this, item);
      const isSelected = this.isItemSelected(this.state.selectedItems, item);

      const classes = cx({
        icon: true,
        'haulmax-check-box-outline-blank': isSelected,
        'haulmax-check-box': !isSelected,
      });
      const key = `filter-item${i}`;
      return (
        <li role="presentation" key={key} onClick={onItemSelected} className="h-over">
          <i className={classes} />
          <span>{item.name}</span>
        </li>
      );
    });
  }
  /**
  * render
  * @return {ReactElement} markup
  */

  render(): ?$React$Element {
    const classes = cx({
      icon: true,
      'haulmax-check-box-outline-blank': !this.isAllItemsSelected(this.state.filteredItems, this.state.selectedItems),
      'haulmax-check-box': this.isAllItemsSelected(this.state.filteredItems, this.state.selectedItems),
    });

    let maxHeight = this.props.column.gridOptionsWrapper.gridOptions.api.gridPanel.eRoot.clientHeight -
    this.props.column.gridOptionsWrapper.gridOptions.api.gridPanel.eHeader.clientHeight - 110 - 30;
    maxHeight = maxHeight <= 200 ? maxHeight : 200;
    const width = this.props.column.actualWidth < 220 ? 220 : this.props.column.actualWidth;

    return <div>Filter comes here</div>;
  }
}
