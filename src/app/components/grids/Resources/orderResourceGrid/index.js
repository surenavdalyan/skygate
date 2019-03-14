import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import moment from "moment";
import {toArray} from "lodash/lang"
import GridConfig from "./gridConfig";
import DataGrid from "../../../DataGrid/index";
import Events from "../../../../utils/EventEmitter";
import fetchResourcesOperation from "../../../../actions/resourcesOperationAction";
import {
  rowEditableStatus,
  updateGridHeaderStatus
} from "../../../DataGrid/editHelper";
import { ExportEntity } from "../../../../api/exportAPI";
import Helper from "../../../../utils/helper";
import { CellStyleOption } from "../../../DataGrid/cellrenderers/CellRender";
import { percentageFormatter } from "../../../DataGrid/helper";

class OrderResources extends React.Component {
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
      getRowStyle: params => this.rowStyleOptions(params),
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
    this.props.fetchResourcesOperation();
    Events.on("RELOADRESOURCES", ()=>{
      this.props.fetchResourcesOperation();
    })
  }
  componentDidMount() {
    // ...
  }
  componentWillReceiveProps(nextProps) {
    const RowData = nextProps.resourcesOperation.data;
    if (RowData && RowData.length) {
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
    const Id = row[0].Id;
    console.log(Id);
  };
  onShowHideColumns = () => {};
  onShowGridView = () => {};
  onShowGanttChart = () => {};
  onSaveChanges = () => {};
  onRevertChanges = () => {};
  getRowNodeId = data => data.Id;


  getFormattedData = (data) => {
   // console.log(data);
        let formattedData = {};

        data.forEach( (entity, index)=>{
         let DateString = moment(new Date(entity.ResourceUsageDate)).format("DD-MM-YYYY")
          if(!formattedData[entity.ResourceName]){
            formattedData[entity.ResourceName] = {
                name: entity.ResourceName,
                [DateString]: entity.Value
            }
          } else {    
              formattedData[entity.ResourceName][DateString] = entity.Value
          }
        })

        return formattedData;
    
  }

  getColumnDefs = () => {
    if(this.state.routesData.length){
      const keys = Object.keys(this.state.routesData[0]);
      return keys.map( (key) =>({        
        cellType: "string",
        editable: false,
        field: key,
        headerName: key === "name" ? "Resource Name" : key,
        width: key === "name" ? 125 : 95,
        cellClassRules: {
          cellWarning: params => CellStyleOption(params)
        },
        suppressMenu : true,
        suppressSorting : true,
        valueFormatter : percentageFormatter,
        cellClass:"center-align"
      }))
    }
    return {};
  }
  rowStyleOptions = params => {
    const locked = params.data.IsLocked;
    if (locked) {
      return {
        background: "#103241",
        color: "#fff"
      };
    }
    return {
      background: "#18243C",
      color: "#fff"
    };
  };
  render() {
    if ( this.api && this.grid.config.columns && this.props.isOpened){
      this.api.sizeColumnsToFit();
     }
    const columnDefs = this.getColumnDefs(this.state.routesData);
    return (
      <div>
        <div className="grid-controls">
          {/* <GridHeader
            config={this.state.headerConfig}
            gridName={this.grid.config.gridName}
            changeView={this.onChangeGridToChart}
          /> */}
        </div>
        <div id="handsOnTable">
          {this.state.routesData.length && (
            <DataGrid
              columnDefs={columnDefs}
              rowData={this.state.routesData}
              enableFilter={this.grid.config.enableFilter}
              gridOptions={this.state.gridOptions}
              getRowStyle={this.state.getRowStyle}
              deltaRowDataMode
              rowClass={this.state.rowClass}
              onGridInitialize={e => this.onDataGridReady(e)}
              onGridEditStart={grid => this.onGridEditStart(grid)}
              onGridEditStop={grid => this.onGridEditStop(grid)}
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
function mapStateToProps({ resourcesOperation }) {
  return { resourcesOperation };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      fetchResourcesOperation
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(OrderResources);
