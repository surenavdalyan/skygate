import React from "react";
import pikaday from "pikaday";
import moment from "moment";
import isDate from "lodash/isDate";
import isEqual from "lodash/isEqual";
import {toArray} from "lodash/lang"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridConfig from "./gridConfig";
import DataGrid from "../../../DataGrid/index";
import GridHeader from "../../../DataGrid/Header";
import Events from "../../../../utils/EventEmitter";
import {
  rowEditableStatus,
  updateGridHeaderStatus,
  GetPrivileges
} from "../../../DataGrid/editHelper";
import Helper from "../../../../utils/helper";
import { fetchSiteKpi } from "../../../../actions/productSiteKpiAction";
import {Header} from "../../../DataGrid/HaederSecondary";
import ProductSiteKpi from "../../../../api/productSiteKpiAPI";

import {getHeaderName} from "../../../DataGrid/helper";

class SiteKpiGrid extends React.Component {
  constructor(props) {
    super(props);
    this.grid = new GridConfig();
    this.grid.config.editedRowsData = {};
    this.state = {
      errorMsg: "",
      gridOptions: {
        context: {
          componentParent: this
        }
      },
      routesData: [],
      lockedEntities: [],
      headerConfig: this.grid.config.headerConfig,
      rowSelection: "single",
     // getRowStyle: params => {},
      isEdit: false,
      view: true
    };
  }

  componentWillMount() {
    this.grid.config.columns.forEach(col => {
      if (col.editable) {
        col.editable = rowEditableStatus;
      }
    });
    this.grid.config.headerConfig.menu.forEach(menuItem => {
      if (menuItem.onClick) {
        menuItem.onClick = this[menuItem.onClick];
      }
    });
    this.props.fetchSiteKpi();
  }
  componentDidMount() {
   // ...
  }
  componentWillReceiveProps(nextProps) {
    const RowData = nextProps.siteKpi.data;
    if (RowData.length) {
    //  console.log(RowData);
      this.setState({ routesData: toArray(this.getFormattedData(RowData)) })
    }
  }
  componentWillUnmount() {}

  onDataGridReady(api) {
    this.api = api;
    Events.emit(`getGridAPI_${this.grid.config.gridName}`, api);
  }

  onExport = () => {
   // ExportEntity.GridDataExport("possession");
  };
  onSelectionChanged = row => {
    console.log(row);
  };
  onChangeDisplay = () => { console.log("onChangeDisplay")};
  onShowHideColumns = () => {};
  onShowGridView = () => {};
  onShowGanttChart = () => {};
  onSaveChanges = () => {};
  onRevertChanges = () => {};
  getRowNodeId = data => data.Id;

  getFormattedData = (data) => {
    let formattedData = {};
    
    data.forEach( (entity, index)=>{
      let DateString = moment(new Date(entity.Date)).format("DD-MM-YYYY")
      if(!formattedData[`${entity.Location}${entity.Measure}`]){
        formattedData[`${entity.Location}${entity.Measure}`] = {
          Location: entity.Location,
          Measure: entity.Measure,
          Unit: entity.Unit,
          [DateString]: entity.Value,
          [`${DateString}_ID`]: entity.Id
        };
           } else {    
        formattedData[`${entity.Location}${entity.Measure}`][DateString] = entity.Value
        formattedData[`${entity.Location}${entity.Measure}`][`${DateString}_ID`]= entity.Id
     }
    })

    return formattedData;
   }
  getColumnDefs = () => {
    if(this.state.routesData.length){
      const keys = Object.keys(this.state.routesData[0]);
      const filteredKeys = keys.filter(key => !key.includes("_ID"));
      return filteredKeys.map(key => ({
        editable: moment(key).isValid() ? GetPrivileges(): false,
        field: key,
        headerName: getHeaderName(key),
        minWidth: moment(key).isValid() ? 75: 100,
        maxWidth: moment(key).isValid() ? 100: 100,
        width: moment(key).isValid() ? 90: 150,
        suppressMenu : true,
        suppressSorting : true,
        cellClass:moment(key).isValid() ?"center-right": key == "Unit" ?"center-align":""
      }));
    }
    return {};
  };
  actionCallback = () => {
    console.log("Empty function");
  }
  onCellValueChanged = (event) => {
    let {Location, Measure, Unit} = event.data;
    ProductSiteKpi.saveSiteKpi([{
      Location,
      Measure,
      Unit,
      Date : event.colDef.field,
      Id: event.data[`${event.colDef.field}_ID`],
      Value : parseInt(event.newValue)
    }])
  }

  render() {
    const columnDefs = this.getColumnDefs(this.state.routesData);
    return (
      <div>
        <Header
            gridName={this.grid.config.gridName}
          //  callback={this.actionCallback}
            config={this.state.headerConfig}
           // type={"Assign"}
         /> 
        <div id="handsOnTable">
          {this.state.routesData.length && (
            <DataGrid
              columnDefs={columnDefs}
              rowData={this.state.routesData}
              enableFilter={this.grid.config.enableFilter}
              gridOptions={this.state.gridOptions}
            //  getRowStyle={this.state.getRowStyle}
              deltaRowDataMode
              rowClass={this.state.rowClass}
              onGridInitialize={e => this.onDataGridReady(e)}
             
              getRowNodeId={this.getRowNodeId}
              onSelection={this.onSelectionChanged}
              rowSelection={this.state.rowSelection}
              singleClickEdit=  {false}
              // onRowDoubleClicked={() => {  }}
              // onRowSelected={() => this.onRowSelected}
              config={this.grid.config}
              lockedEntities={this.state.lockedEntities}
              onCellValueChanged = {this.onCellValueChanged}
            />
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps({ siteKpi }) {
  return { siteKpi };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchSiteKpi
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(SiteKpiGrid);