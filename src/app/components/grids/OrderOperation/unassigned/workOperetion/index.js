import React from "react";
import pikaday from "pikaday";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridConfig from "./gridConfig";
import DataGrid from "../../../../DataGrid/index";
import GridHeader from "../../../../DataGrid/Header";
import Events from "../../../../../utils/EventEmitter";
import { selectWorkOperation } from "../../../../../actions/ordersAndOperationActions";
import {
  rowEditableStatus,
  updateGridHeaderStatus
} from "../../../../DataGrid/editHelper";
import { ExportEntity } from "../../../../../api/exportAPI";
import { Header } from "../../../../DataGrid/HaederSecondary/index";
import EditOperation from "./editOperation";
import { assignedWorkOperation } from "../../../../../actions/ordersAndOperationActions";
import fetchOrdersAndOperations from "../../../../../actions/ordersAndOperationActions";
import notify from "../../../../../utils/notify";
import isEqual from "lodash/isEqual";


class WorkOperationUnassigned extends React.Component {
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
      showUpsertOperation: false,
      rowSelection: "single",
      getRowStyle: params => this.rowStyleOptions(params),
      selectedParams: {},
      selectedWorkOrder: props.ordersAndOperations.selectedWorkOrder,
      selectedWorKOperation: []
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
  }
  componentDidMount() {
    // console.log(this.refs);
  }
  componentWillReceiveProps(nextProps) {
    const UnAssignedWorkOperations = nextProps.ordersAndOperations.data
      ? nextProps.ordersAndOperations.data.UnAssignedWorkOperations
      : [];
    this.setState({
      lockedEntities: nextProps.entitiesState,
      routesData: UnAssignedWorkOperations,
      selectedWorkOrder: nextProps.ordersAndOperations.selectedWorkOrder,
      sectionMapping: nextProps.possessions.sectionMapping
    });
  }
  shouldComponentUpdate() {
    return true;
  }

  componentWillUnmount() {}
  onDataGridReady(api) {
    // console.log("In Routes Grid Ready");
    this.api = api;
    Events.emit(`getGridAPI_${this.grid.config.gridName}`, api);
  }
  onGridEditStart = grid => {
    this.setState(
      {
        currentRowData: grid
      },
      this.openModal()
    );
    // this.setState({ selectedParams: params }, this.openModal());
    console.log(
      updateGridHeaderStatus(this.state.headerConfig, [
        {
          name: "REVERT_CHANGES",
          isVisible: true
        }
      ])
    );
  };

  onGridEditStop = grid => {
    console.log("2", grid);
  };
  onAssignAction = () => {
    console.log("onAssignOperations")
    const OperationId = this.props.ordersAndOperations.selectedWorkOperation;
    const Possession = this.props.possessions.selectedPossession;
    if (OperationId && Possession.SelectedDate && !isEqual(OperationId, this.state.selectedWorKOperation)) {
      this.props.assignedWorkOperation(OperationId, Possession.SelectedDate)
        .then(() => {
          const PossessionsId = this.props.possessions.selectedPossession.PossessionsId;
          const sectionIds = this.getSectionIdsByPossessionId(PossessionsId);
          this.props.fetchOrdersAndOperations(sectionIds).then(() => {
            notify.success("Success");
          })
          .catch(err => {
            notify.error(err.message);
          });
        })
        .catch(err => {
          notify.error(err.message);
        });
    }
    this.setState({
      selectedWorKOperation: this.props.ordersAndOperations.selectedWorkOperation
    });
  };

  onExport = () => {
    console.log("Export was clicked from unassigned operation");
    ExportEntity.GridDataExport("unassignedOperation");
  };
  onShowHideColumns = () => {};
  onShowGridView = () => {};
  onShowGanttChart = () => {};
  onSaveChanges = () => {};
  onRevertChanges = () => {
    console.log("reset");
    // this.gridApi.setFilterModel(null);
    // this.gridApi.onFilterChanged();
  };
  getRowNodeId = data => data.Id;

  hideGridModal = () => {
    this.setState({ showUpsertOperation: false });
  };
  onSelectionChanged = row => {
    if (row.length) {
      const OperationId = row[0].Id;
      this.props.selectWorkOperation(OperationId);
    }
  };
  getSectionIdsByPossessionId = possessionId => {
    if (!possessionId || !this.state.sectionMapping) {
      return null;
    }

    let filteredArray = this.state.sectionMapping.filter(
      sm => sm.SourceId === possessionId
    );

    if (filteredArray) {
      return filteredArray.map(sm => sm.SectionId);
    }
  };
  getFilteredData = () => {
    if (
      this.state.selectedWorkOrder &&
      this.state.selectedWorkOrder.length != 0 &&
      this.state.routesData &&
      this.state.routesData.length != 0
    ) {
      return this.state.routesData.filter(data =>
        this.state.selectedWorkOrder.includes(data.WorkOrderId)
      );
    }
    return this.state.routesData;
  };
  reloadRoutesComponent = isMapReload => {
    // this.routeArray = []; this.setState({   // isLoading: true });
    const gridApi = this.state.gridOptions.api;
    if (gridApi) {
      gridApi.deselectAll();
    }
    //   this.routeArray = [];
    this.getRoutesData(isMapReload);
  };
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
  // ----------- close work operation editing popup ---------- //
  // openModal = () => {
  //   this.setState({
  //     showUpsertOperation: true
  //   });
  // };
  render() {
    if( this.api && this.grid.config.columns && this.props.isOpened){
      this.api.sizeColumnsToFit();
     }
    const filteredData = this.getFilteredData();
    return (
      <div>
        <div className="SecondHeaderMargin">
        <Header
          gridName={this.grid.config.gridName}
          callback={this.onAssigne}
          config={this.state.headerConfig}

          //  type={"Assign"}
         />
          <div id="handsOnTable">
            <div >
              {/* {this.state.routesData.length && ( */}
              <DataGrid
                columnDefs={this.grid.config.columns}
                rowData={filteredData}
                enableFilter={this.grid.config.enableFilter}
                gridOptions={this.state.gridOptions}
                editType="fullRow"
                getRowStyle={this.state.getRowStyle}
                deltaRowDataMode
                rowClass={this.state.rowClass}
                onGridInitialize={e => this.onDataGridReady(e)}
                onGridEditStart={grid => this.onGridEditStart(grid)}
                onGridEditStop={grid => this.onGridEditStop(grid)}
                getRowNodeId={this.getRowNodeId}
                rowSelection={this.state.rowSelection}
                onSelection={grid => this.onSelectionChanged(grid)}
                config={this.grid.config}
                lockedEntities={this.state.lockedEntities}
                clear={this.state.clear}
              />
              {/* )} */}
            </div>
            {/* <div className={this.state.routesData.length ? "hide" : "show"}>
              <div className="noData">{this.state.errorMsg}</div>
            </div> */}
          </div>
        </div>
        <EditOperation
          showGridModal={this.state.showUpsertOperation}
          hideGridModal={this.hideGridModal}
          data={this.state.currentRowData}
          rowEditstop={this.onGridEditStop}
        />
      </div>
    );
  }
}
function mapStateToProps({  ordersAndOperations, possessions, entitiesState }) {
  return {  ordersAndOperations, possessions, entitiesState };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      selectWorkOperation,
      assignedWorkOperation,
      fetchOrdersAndOperations
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(
  WorkOperationUnassigned
);
