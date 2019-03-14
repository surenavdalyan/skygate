import React from "react";
import pikaday from "pikaday";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import isEqual from "lodash/isEqual";
import GridConfig from "./gridConfig";
import DataGrid from "../../../../DataGrid/index";
import GridHeader from "../../../../DataGrid/Header";
import Events from "../../../../../utils/EventEmitter";
import { selectWorkOperation } from "../../../../../actions/ordersAndOperationActions";
import fetchOrdersAndOperations from "../../../../../actions/ordersAndOperationActions";
import {
  updateWorkOperation,
  fetchWorkOperations
} from "../../../../../actions/workOperation";
import {
  rowEditableStatus,
  updateGridHeaderStatus
} from "../../../../DataGrid/editHelper";
import { Header } from "../../../../DataGrid/HaederSecondary/index";
import AppController from "../../../../../graphics/AppController";
import CustomPopOver from "../../../../OverLay/CustomPopOver";
import { unassignedWorkOperation } from "../../../../../actions/ordersAndOperationActions";
import notify from "../../../../../utils/notify";
import { cloneDeep as _cloneDeep } from "lodash/lang";

class WorkOperation extends React.Component {
  constructor(props) {
    super(props);
    this.grid = new GridConfig();
    this.grid.config.editedRowsData = {};
    this.state = {
      view: true,
      sizeToFit: true,
      errorMsg: "",
      gridOptions: {
        context: {
          componentParent: this
        }
      },
      routesData: [],
      lockedEntities: [],
      headerConfig: this.grid.config.headerConfig,
      showUpsertPossessions: false,
      rowSelection: "multiple",
      operationIds: null,
      getRowStyle: params => this.rowStyleOptions(params),
      selectedParams: {},
      selectedWorkoperation: [],
      selectedAssignedWorkOrder:
        props.ordersAndOperations.selectedAssignedWorkOrder,
      selectedWorkOrder: props.ordersAndOperations.selectedWorkOrder
    };
    this.filterGrid = this.filterGrid.bind(this);
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

    this.props.fetchWorkOperations(1);
    Events.on("WorkOrderSelect", this.filterGrid);
  }
  filterGrid(workOrders){
      if (workOrders.length > 0) {
        const filteredData = this.sourceData.operations.filter(item => {
          if (workOrders.includes(item.WorkOrderReferenceId))
            return item;
        });
        this.setState({
          workOperations: filteredData
        })
      }
      else {
        this.setState({
          workOperations: this.sourceData.operations
        })
      }
  }
  componentWillReceiveProps(nextProps) {
    const AssignedWorkOperations = nextProps.ordersAndOperations.data
      ? nextProps.ordersAndOperations.data.AssignedWorkOperations
      : [];
    this.clearSet(AssignedWorkOperations);
    this.setState({
      lockedEntities: nextProps.entitiesState,
      selectedAssignedWorkOrder:
        nextProps.ordersAndOperations.selectedAssignedWorkOrder,
      selectedPossession: nextProps.selectedPossession,
      sectionMapping: nextProps.possessions.sectionMapping,
      workOperations:
        nextProps.workOperations.operations.length > 0
          ? nextProps.workOperations.operations
          : []
    });
    this.sourceData = _cloneDeep(nextProps.workOperations);
    // We need to check previous values are same as new values
    const equalValues = isEqual(
      Object.values(nextProps),
      Object.values(this.props)
    );
    if (equalValues) return false;
    if (nextProps.workOperations && nextProps.workOperations.length > 0) {
      setTimeout(() => {
        this.initCanvas(nextProps);
      });
    }
  }
  clearSet = operations => {
    this.setState({
      routesData: []
    });
    setTimeout(() => {
      this.setState({
        routesData: operations
        //  lockedEntities: nextProps.entitiesState
      });
    }, 0);
  };
  componentWillUnmount() { }
  onDataGridReady(api) {
    // console.log("In Routes Grid Ready");
    this.api = api;
    Events.emit(`getGridAPI_${this.grid.config.gridName}`, api);
  }
  onGridEditStart = params => {
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
  onExport = () => {
    // ExportEntity.GridDataExport("possession");
  };
  onAdd = () => {
    this.setState({
      showUpsertPossessions: true
    });
  };
  onAssignAction = () => {
    const OperationIds = this.state.operationIds;
    if (
      OperationIds &&
      !isEqual(OperationIds, this.state.selectedWorkoperation)
    ) {
      this.props
        .unassignedWorkOperation([OperationIds])
        .then(() => {
          const PossessionsId = this.props.selectedPossession.PossessionsId;
          const sectionIds = this.getSectionIdsByPossessionId(PossessionsId);
          this.props
            .fetchOrdersAndOperations(sectionIds)
            .then(() => {
              notify.success("Success");
            })
            .catch(err => {
              notify.error(err.message);
            });
        })
        .catch(err => {
          notify.error(err.message);
        });
      this.setState({ selectedWorkoperation: OperationIds });
    }
  };
  onShowHideColumns = () => { };
  onShowGridView = () => { };
  onShowGanttChart = () => { };
  onSaveChanges = () => { };
  onRevertChanges = () => {
    console.log("reset");
    // this.gridApi.setFilterModel(null);
    // this.gridApi.onFilterChanged();
  };
  getRowNodeId = data => data.Id;
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
  clearSet = operations => {
    this.setState({
      routesData: []
    });
    setTimeout(() => {
      this.setState({
        routesData: operations
      });
    }, 0);
  };
  getFilteredData = () => {
    if (
      this.state.selectedAssignedWorkOrder &&
      this.state.selectedAssignedWorkOrder.length != 0 &&
      this.state.routesData &&
      this.state.routesData.length != 0
    ) {
      return this.state.routesData.filter(data =>
        this.state.selectedAssignedWorkOrder.includes(data.WorkOrderId)
      );
    }
    return this.state.routesData;
  };
  getSectionIdsByPossessionId = possessionId => {
    if (!possessionId || !this.state.sectionMapping) {
      return null;
    }

    const filteredArray = this.state.sectionMapping.filter(
      sm => sm.SourceId === possessionId
    );

    if (filteredArray) {
      return filteredArray.map(sm => sm.SectionId);
    }
  };
  onChangeGridToChart = changed => {
    if (this.state.view !== changed) {
      this.setState({ view: changed, sizeToFit: false });
      this.appController = null;
      this.initCanvas();
      this.sizeGridColumsToFit(changed);
    }
  };

  onSaveUpdateFromGantt = obj => {
    const { action, workOperation } = obj;
    if (action === "save") {
      this.props.updateWorkOperation([workOperation]);
    }
  };

  initCanvas = nextProps => {
    if (
      this.state.routesData &&
      this.state.routesData.length > 0 &&
      this.state.selectedPossession &&
      this.state.selectedPossession.SelectedDate
    ) {
      // Update buffer and rerender
      // Gather required data for rendering

      const data = {
        // startDate: new Date(this.state.startDate),
        // endDate: new Date(this.state.endDate),
        selectedPossession: this.state.selectedPossession,
        operations: this.state.routesData
      };

      this.appController && this.appController.clearAll();
      // init with data and integrate
      setTimeout(() => {
        if (!this.appController) {
          this.appController = new AppController(
            this.canvasWrapper,
            "operations"
          );
        }
        this.appController.init(data);
        this.appController.setHandler(
          "onSaveUpdate",
          this.onSaveUpdateFromGantt
        );
      }, 100);
    }
  };
  onSelectionChanged = row => {
    Events.emit(
      "WorkOrderOperationsSelect",
      this.api.getSelectedRows().map(item => item.ResourceWorkCenterName)
    );
    if (row.length) {
      const operationIds = row[0].Id;
      this.setState({ operationIds });
    }
  };
  sizeGridColumsToFit = changed => {
    if (changed) {
      setTimeout(() => {
        this.api.sizeColumnsToFit();
      }, 50);
    }
  };
  render() {
    const sizeColumns =
      this.api &&
      this.grid.config.columns &&
      this.props.isOpened &&
      this.state.view &&
      this.state.sizeToFit;
    if (sizeColumns) {
      this.api.sizeColumnsToFit();
    }
    const filteredData = this.getFilteredData();
    const { workOperations } = this.state;
    return (

      <div id="handsOnTable">
        <div>
          {this.state.view ? (
            <DataGrid
              columnDefs={this.grid.config.columns}
              rowData={workOperations}
              enableFilter={this.grid.config.enableFilter}
              gridOptions={this.state.gridOptions}
              editType="fullRow"
              getRowStyle={this.state.getRowStyle}
              deltaRowDataMode
              rowClass={this.state.rowClass}
              onGridInitialize={e => this.onDataGridReady(e)}
              onGridEditStart={grid => this.onGridEditStart(grid)}
              onGridEditStop={grid => this.onGridEditStop(grid)}
              onSelection={grid => this.onSelectionChanged(grid)}
              rowSelection={this.state.rowSelection}
              getRowNodeId={this.getRowNodeId}
              //  onRowSelected={() => this.onRowSelected}
              config={this.grid.config}
              lockedEntities={this.state.lockedEntities}
              clear={this.state.clear}
            />
          ) : (
              <div>
                <div
                  className="canvas-wrapper"
                  ref={elm => {
                    this.canvasWrapper = elm;
                  }}
                />
                <CustomPopOver />
              </div>
            )}
        </div>
        {/* <div className={this.state.routesData.length ? "hide" : "show"}>
              <div className="noData">{this.state.errorMsg}</div>
            </div> */}
      </div>
    );
  }
}
function mapStateToProps({
  ordersAndOperations,
  entitiesState,
  possessions,
  possessions: { selectedPossession },
  workOperations
}) {
  return {
    ordersAndOperations,
    possessions,
    entitiesState,
    selectedPossession,
    workOperations
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      unassignedWorkOperation,
      selectWorkOperation,
      fetchOrdersAndOperations,
      updateWorkOperation,
      fetchWorkOperations
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(WorkOperation);
