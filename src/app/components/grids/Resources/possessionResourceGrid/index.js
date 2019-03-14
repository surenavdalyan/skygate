import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { toArray } from "lodash/lang";
import GridConfig from "./gridConfig";
import DataGrid from "../../../DataGrid/index";
import Events from "../../../../utils/EventEmitter";
import {
  rowEditableStatus,
  updateGridHeaderStatus
} from "../../../DataGrid/editHelper";
import { ExportEntity } from "../../../../api/exportAPI";
import Helper from "../../../../utils/helper";
import { fetchResourcesPossession } from "../../../../actions/resourcesOperationAction";
import { CellStyleOption } from "../../../DataGrid/cellrenderers/CellRender";
import { percentageFormatter } from "../../../DataGrid/helper";
import { cloneDeep as _cloneDeep } from "lodash/lang";
import MultiselectFilter from "../../../DataGrid/filter/multiSelectFilter";
import { FilterConfig } from "../../../DataGrid/filter/filterConfig";

class PossessionResources extends React.Component {
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
      isEdit: false,
      view: true
    };
    this.filterGridOnResource = this.filterGridOnResource.bind(this);
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
    this.props.fetchResourcesPossession();
    Events.on("RELOADRESOURCES", () => {
      this.props.fetchResourcesPossession();
    });
  }
  componentDidMount() {
    // ...
    Events.on("WorkOrderOperationsSelect", this.filterGridOnResource);
  }
  componentWillReceiveProps(nextProps) {
    const RowData = nextProps.resourcesPossession.data;
    if (RowData && RowData.length) {
      // console.log(RowData);
      this.setState({ routesData: toArray(this.getFormattedData(RowData)) });
      this.sourceData = _cloneDeep(toArray(this.getFormattedData(RowData)));
    }
  }
  filterGridOnResource(resourceIds) {
    if (resourceIds.length > 0) {
      const filteredData = this.sourceData.filter(item => {
        if (resourceIds.includes(item.name)) return item;
      });
      this.setState(
        {
          routesData: []
        },
        () => {
          this.setState({
            routesData: filteredData
          });
        }
      );
    } else {
      this.setState({
        routesData: this.sourceData
      });
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
    // const Id = row[0].Id;
    // console.log(Id);
  };
  onShowHideColumns = () => {};
  onShowGridView = () => {};
  onShowGanttChart = () => {};
  onSaveChanges = () => {};
  onRevertChanges = () => {};
  getRowNodeId = data => data.Id;

  getFormattedData = data => {
    // console.log(data);
    const formattedData = {};
    // console.log(formattedData);
    data.forEach((entity, index) => {
      const DateString = moment(new Date(entity.ResourceUsageDate)).format(
        "DD-MM-YYYY"
      );
      if (!formattedData[entity.WorkCenter]) {
        formattedData[entity.WorkCenter] = {
          name: entity.WorkCenter,
          [DateString]: { status: entity.Status, value: entity.Value }
          // id: entity.Id,
          // status: entity.Status
        };
      } else {
        formattedData[entity.WorkCenter][DateString] = {
          status: entity.Status,
          value: entity.Value
        };
      }
    });
    return formattedData;
  };

  getColumnDefs = () => {
    if (this.state.routesData.length) {
      const keys = Object.keys(this.state.routesData[0]);
      return keys.map(key => ({
        cellType: "string",
        editable: false,
        field: key,
        headerName: key === "name" ? "Oper. Work Center" : key,
        width: key === "name" ? 165 : 135,
        pinned: key === "name" ? "left" : "",
        valueFormatter(params) {
          if (params.value) return params.value.value;
          return "-";
        },
        cellStyle(params) {
          if (key === "name") return null;
          let backgroundColor = "";
          if (params.value) {
            switch (params.value.status) {
              case 0:
                backgroundColor = "#AAA";
                break;
              case 1:
                backgroundColor = "green";
                break;
              case 2:
                backgroundColor = "red";
                break;
              default:
                backgroundColor = "";
                break;
            }
          }
          const color = backgroundColor ? "white": "";
          return { color, backgroundColor };
        },
        // cellClassRules: {
        //   cellWarning: params => CellStyleOption(params)
        // },
        // cellStyle: function(params){
        //   console.log(params.column.colId);
        //   if(params.column.colId !== "name"){
        //     if(params.data.status === 0){
        //       return { backgroundColor: 'grey' };
        //     }else if(params.data.status === 1){
        //       return { backgroundColor: 'green' };
        //     }else if(params.data.status === 2){
        //       return { backgroundColor: 'red' };
        //     }
        //   }
        // },
       // suppressMenu : true,
       // suppressSorting : true,
       // valueFormatter : percentageFormatter,
       filterFramework: MultiselectFilter,
       filterConfig: FilterConfig(),
       hide: key === "id" || key ==="status" ? true: false,
        cellClass:"center-align"
      }));
    }
    return {};
  };
  render() {
    if (this.api && this.grid.config.columns && this.props.isOpened) {
      this.api.sizeColumnsToFit();
    }
    const columnDefs = this.getColumnDefs(this.state.routesData);
    return (
      <div>
        <div className="grid-controls" />
        <div id="handsOnTable">
          {this.state.routesData.length && (
            <DataGrid
              columnDefs={columnDefs}
              rowData={this.state.routesData}
              //  enableFilter={this.grid.config.enableFilter}
              gridOptions={this.state.gridOptions}
              getRowStyle={this.state.getRowStyle}
              deltaRowDataMode
              rowClass={this.state.rowClass}
              onGridInitialize={e => this.onDataGridReady(e)}
              //  onGridEditStart={grid => this.onGridEditStart(grid)}
              //  onGridEditStop={grid => this.onGridEditStop(grid)}
              getRowNodeId={this.getRowNodeId}
              onSelection={this.onSelectionChanged}
              rowSelection={this.state.rowSelection}
              // onRowDoubleClicked={() => {  }}
              // onRowSelected={() => this.onRowSelected}
              config={this.grid.config}
              lockedEntities={this.state.lockedEntities}
            />
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps({ resourcesPossession }) {
  return { resourcesPossession };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchResourcesPossession
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(
  PossessionResources
);
