import React from "react";
import pikaday from "pikaday";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import isEqual from "lodash/isEqual";
import GridConfig from "./gridConfig";
import DataGrid from "../../../../DataGrid/index";
import GridHeader from "../../../../DataGrid/Header";
import Events from "../../../../../utils/EventEmitter";
import  { Header }  from "../../../../DataGrid/HaederSecondary/index";
import { unassignedWorkOrder, selectAssignedWorkOrder, cleanValidation } from "../../../../../actions/ordersAndOperationActions";
import fetchOrdersAndOperations from "../../../../../actions/ordersAndOperationActions";
import notify from "../../../../../utils/notify";
import WorkordersModal from "./upsertWorkorders";
import {
  rowEditableStatus,
  updateGridHeaderStatus
} from "../../../../DataGrid/editHelper";


class WorkordersGrid extends React.Component {
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
      showUpsertWorkorders: false,
      currentRowData: {},
      view: true,
      rowSelection: "multiple",
      workorderId: []
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
    // this.props.fetchWorkorders();
  }
  componentWillReceiveProps(nextProps) {
    const ValidationWarning = nextProps.ordersAndOperations.validationWarning;
    if (ValidationWarning != null) this.reloadWorkOrders(ValidationWarning);
    const AssignedWorkOrders = nextProps.ordersAndOperations.data
      ? nextProps.ordersAndOperations.data.AssignedWorkOrders
      : [];
    // console.log("WorkordersGrid",nextProps.ordersAndOperations.data)
    this.setState({
      routesData: AssignedWorkOrders,
      lockedEntities: nextProps.entitiesState,
      sectionMapping: nextProps.possessions.sectionMapping,
    });
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
    //  this.openModal() // close edit popup for modal window
    );
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
    console.log("stop");
  };
  onChangeGridToChart = changed => {
    this.setState({ view: changed });
  };
  onSelectionChanged = row => {    
    const Ids = row.map(item => item.Id);
    this.props.selectAssignedWorkOrder(Ids);
  };
  onAssignAction = () => {
    console.log("onUnssignorder");
    const workorderId = this.props.ordersAndOperations.selectedAssignedWorkOrder;
    if (workorderId.length && !isEqual(workorderId, this.state.workorderId)) {
      this.props.unassignedWorkOrder(workorderId[0])
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
      this.setState({workorderId: this.props.ordersAndOperations.selectedAssignedWorkOrder})
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
  reloadWorkOrders = (ValidationWarning) => {
    const SectionId = this.props.possessions.selectedPossession.SectionId;   
    if (ValidationWarning.status === 200) {
      this.props.cleanValidation();
      this.props.fetchOrdersAndOperations(SectionId);
    }
  }
  onExport = () => {};

  onShowHideColumns = () => {};
  onShowGridView = () => {};
  onShowGanttChart = () => {};
  onSaveChanges = () => {};
  onRevertChanges = () => {};
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
  // openModal = () => {
  //   this.setState({
  //     showUpsertWorkorders: true
  //   });
  // };
  // hideGridModal = () => {
  //   this.setState({ showUpsertWorkorders: false });
  // };
  render() {
    if( this.api && this.grid.config.columns && this.props.isOpened){
      this.api.sizeColumnsToFit();
     }
    return (
      <div>
        <Header
          gridName={this.grid.config.gridName}
         // callback={this.onUnAssigned}
         config={this.state.headerConfig}

          type="UnAssign"
        />
        {/* <div className="titlebar">
          {this.state.routesData.length && (
            <GridHeader
              config={this.state.headerConfig}
              gridName={this.grid.config.gridName}
              changeView={this.onChangeGridToChart}
            />
          )}
        </div> */}
        <div className="">
          <div id="handsOnTable">
            <div >
              {this.state.view ? (
                // this.state.routesData.length && (
                <DataGrid
                  columnDefs={this.grid.config.columns}
                  rowData={this.state.routesData}
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
                />
              ) : (
                // )
                <div>Char</div>
              )}
            </div>
            {/* <div className={this.state.routesData.length ? "hide" : "show"}>
              <div className="noData">{this.state.errorMsg}</div>
            </div> */}
          </div>
        </div>
        {/* <WorkordersModal
          showGridModal={this.state.showUpsertWorkorders}
          hideGridModal={this.hideGridModal}
          data={this.state.currentRowData}
          rowEditstop={this.onGridEditStop}
        /> */}
      </div>
    );
  }
}
function mapStateToProps({ ordersAndOperations, possessions, entitiesState }) {
  return { ordersAndOperations, possessions, entitiesState };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      unassignedWorkOrder,
      selectAssignedWorkOrder,
      cleanValidation,
      fetchOrdersAndOperations
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(WorkordersGrid);
