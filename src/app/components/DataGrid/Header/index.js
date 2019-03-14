import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import React from "react";
import { keyBy } from "lodash/collection";
import axios from "axios";
import classNames from "classnames";
import fileDownload from 'react-file-download';
import ShowHideCols from "./showHideColumns";
import { Legends } from "./showLegends";
import Events from "../../../utils/EventEmitter";
import "./styles.scss";
import constants from "../../../constants";
import Helper from "../../../utils/helper";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as common from "../../../actions/common";

class GridHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      api: null,
      key: null,
      gridView: true,
      chartView: false,
      activeTab: true,
    };

    this.config =  keyBy(this.props.config.menu, "name") ;
    this.gridName = this.props.gridName;

    this.addItem = this.addItem.bind(this);
    this.onExportClick = this.onExportClick.bind(this);
    this.showHideColumns = this.showHideColumns.bind(this);
    this.visibleColumns = []; 
  }

  componentWillMount() {
    const { gridName } = this;

    Events.on(`getGridAPI_${gridName}`, gridAPI => {
      this.setState({
        api: gridAPI
      });
    });
  }
  componentWillUnmount() {}

  onExportClick() {
    this.config.EXPORT.onClick();
  }

  onFilterCrear = () => {
    this.config.REVERT_CHANGES.onClick();
  };

  addItem() {
    this.props.stack.layoutManager.eventHub.emit("addRoutes");
  }
  
  showHideColumns(field, isVisible, headerName) {
    const columns = this.state.api.columnController.gridColumns;
    const isColumnVisibile = (columns, field) =>
      field && columns.find(col => col.colId === field).visible;
    this.state.api.columnController.setColumnVisible(
      field,
      !isColumnVisibile(columns, field)
    );
    this.setState({
      key: !isColumnVisibile
    });

    let shouldBeVisible = !isVisible;
    this.handleColumnVisibleChange(field, shouldBeVisible);
  }

  changeViewToGrid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      gridView: true,
      chartView: false
    });
    this.props.changeView(true);
  };

  changeViewToChart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      gridView: false,
      chartView: true
    });
    this.props.changeView(false);
  };

  changeGridsVisibility = event => {
    event.preventDefault();
    event.stopPropagation();
    const name = event.target.name
    const activeTab = name === "assigned" ? true : false;
    this.setState({
      activeTab
    });
    this.props.tabsControl(activeTab);
  };
  
  createTabsControl = () => {
    const assigned = classNames({ "assigned-tab": this.state.activeTab });
    const unassigned = classNames({ "unassigned-tab": !this.state.activeTab });
    return (
      <span className="tab-control">
        <button key="assigned" className={`${assigned}`} id="assigned" name="assigned" onClick={ this.changeGridsVisibility }>
          Assigned Work Orders
        </button>
        <button key="unassigned" className={`${unassigned}`} id="unassigned" name="unassigned" onClick={ this.changeGridsVisibility }>
          Unassigned Work Orders
        </button>
      </span>
    );
  };
  onAdd = () => {
    this.config.ADD.onClick();
  };

  onRemove = () => {
    this.config.REMOVE.onClick();
  };

  onEdit = () => {
    this.config.EDIT.onClick();
  }

  handleColumnVisibleChange = (field, shouldBeVisible) => {
    if (shouldBeVisible) {
      this.visibleColumns.push(field);
    } else {
      const index =  this.visibleColumns.indexOf(field);
    
      if (index !== -1) {
        this.visibleColumns.splice(index, 1);
      }
    }

    let newPreferenceValue = this.visibleColumns.join(',');

    let prefType = constants.userPreferences.PossessionGrid;
    let params = Helper.updateUserPreference(this.props.userPreferences.userPreferences, newPreferenceValue, prefType );
    this.props.UpdateUserPreferences(params);
  };

  render() {
    const config = this.config;
    const activeGrid = classNames({ "active-icon": this.state.gridView });
    const activeChart = classNames({ "active-icon": this.state.chartView });
    this.visibleColumns = ['none']
    this.visibleColumns = this.visibleColumns.concat(Helper.getUserPreference(constants.userPreferences.PossessionGrid, this.props.userPreferences));
    if(this.state.api != null && this.props.userPreferences.userPreferences.length > 0 && this.gridName == "Possession") {
      let columns = this.state.api.columnController.gridColumns;
      columns.map((column) => { 
        this.state.api.columnController.setColumnVisible(column.colId, this.visibleColumns.indexOf(column.colId) != -1); 
      });
    }

    return (
      <div>
        {this.props.tabsControl ? this.createTabsControl() :  "" }
        <div className="grid-actions">
         {config.SHOW_GRID_VIEW && <a title={config.SHOW_GRID_VIEW.tooltip} onClick={this.changeViewToGrid} className={`icon-grid-view ${activeGrid}`}  />}
          {config.SHOW_GANTT_CHART && <a title={config.SHOW_GANTT_CHART.tooltip} onClick={this.changeViewToChart} className={`icon-graph  ${activeChart}`}/>}
          {config.EXPORT && (
            <a title={config.EXPORT.tooltip} className="icon-export" onClick={this.onExportClick} />
          )}
         {config.REVERT_CHANGES && <a className="icon-filter" onClick={this.onFilterCrear}/>}
          {config.ADD && (
            <a title={config.ADD.tooltip} className={config.ADD.icon} onClick={this.onAdd} />
          )}
          {config.REMOVE && (
            <a className={config.REMOVE.icon} onClick={this.onRemove} />
          )}
          {config.EDIT && (
            <a className={config.EDIT.icon} onClick={this.onEdit} />
          )}
          {this.state.gridView
            ? config.SHOW_HIDE_COLUMNS && (
              <ShowHideCols
                  api={this.state.api}
                  onClick = {event => {
                    event.stopPropagation();
                    console.log("Show Hide");
                }}
                  onShowHide={this.showHideColumns}
                  item={{ icon: "icon-eye", tooltip: "Show Hide Columns" }}
                />
              )
            : null}
          {!this.state.gridView
            ? config.LEGENDS && (
              <Legends
                onClick={event => {
                    event.stopPropagation();
                  }}
                  item={{
                    icon: config.LEGENDS.icon,
                    tooltip: config.LEGENDS.tooltip
                  }}
          />
          )
         : null}
        </div>
        {config.SHOW_HIDE_POSSESSION && <div className="gh-toggle">
          Show/Hide Plan Shuts
          <div className="togglebutton">
            <ButtonToolbar>
              <ToggleButtonGroup type="checkbox" defaultValue={[1, 3]}>
                <ToggleButton onClick={ event => {
                  event.preventDefault();
                  event.stopPropagation();
                  if( this.props.onShowHideShuts ){
                    this.props.onShowHideShuts(event);
                  }
                }} value={this.props.showShuts? 1:""}><span></span></ToggleButton>
              </ToggleButtonGroup>
            </ButtonToolbar>
          </div>
        </div>}
      </div>
    );
  }
}

function mapStateToProps({
  userPreferences
}) {
  return {
    userPreferences
  };
}

function mapDispatchToProps(dispatch) {
  const { UpdateUserPreferences } = common;
  return bindActionCreators(
    {
      UpdateUserPreferences,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GridHeader);

// tooltip: "Legends",
//             name: "LEGENDS",
//             isVisible: true,
//             icon: "icon-legends",
//             onClick: ""
// <a title={config.LEGENDS.tooltip} className={config.LEGENDS.icon}  />