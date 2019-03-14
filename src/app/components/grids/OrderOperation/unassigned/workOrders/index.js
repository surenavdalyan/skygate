import React from "react";
import pikaday from "pikaday";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridConfig from "./gridConfig";
import isEqual from "lodash/isEqual";
import DataGrid from "../../../../DataGrid/index";
import GridHeader from "../../../../DataGrid/Header";
import Events from "../../../../../utils/EventEmitter";
import {Header} from "../../../../DataGrid/HaederSecondary/index";
import {
  selectWorkOrder,
  assinedWorkorder,
  assignedWorkOperation,
  cleanValidation,
  getpotentialPossessions
} from "../../../../../actions/ordersAndOperationActions";
import fetchOrdersAndOperations from "../../../../../actions/ordersAndOperationActions";
import WorkordersModal from "./upsertWorkorders";
import {
  rowEditableStatus,
  updateGridHeaderStatus
} from "../../../../DataGrid/editHelper";
import { getRowNodeId } from "../../../../DataGrid/helper";
import AlertContainer from "react-alert";
import notify from "../../../../../utils/notify";
import { fail } from "assert";

import PossessionsRecommendation from "./possessionsRecommendation";

class WorkordersUnassigned extends React.Component {
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
      showPossessionRec: false,
      potentialPossessions: [],
      bundlingMessage:"",
      selectedWorkOrder: [],
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
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    const UnAssignedWorkOrders = nextProps.ordersAndOperations.data
      ? nextProps.ordersAndOperations.data.UnAssignedWorkOrders
      : [];
    const validationWarning = nextProps.ordersAndOperations.validationWarning;
    if (Array.isArray(validationWarning)) {
      this.validationMsg(validationWarning);
    }
    this.setState({
      routesData: UnAssignedWorkOrders,
      lockedEntities: nextProps.entitiesState,
      sectionMapping: nextProps.possessions.sectionMapping,
      potentialPossessions: nextProps.ordersAndOperations.potentialPossessions,
      bundlingMessage: nextProps.ordersAndOperations.bundlingMessage
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
      this.openModal()
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
  rowDoubleClicked = (grid) => {
      const [selectedNode] = grid.api.getSelectedNodes();
      this.props.getpotentialPossessions(selectedNode.data.Id);
      this.setState({ showPossessionRec: true});    

  }
  onGridEditStop = grid => {
    console.log("stop");
  };
  onChangeGridToChart = changed => {
    this.setState({ view: changed });
  };
  onSelectionChanged = row => {
    const Ids = row.map(item => item.Id);
    this.props.selectWorkOrder(Ids);
  };
  onAssignAction = () => {
    console.log('onAssignOrders')
    const WorkOrderId = this.props.ordersAndOperations.selectedWorkOrder;
    const Possession = this.props.possessions.selectedPossession;
    const OperationId = this.props.ordersAndOperations.selectedWorkOperation;
      if (WorkOrderId.length > 0 && Possession.SelectedDate && !isEqual(WorkOrderId, this.state.selectedWorkOrder)) {
      // assign only one order for now
      this.props.assinedWorkorder(
        WorkOrderId[0],
        Possession.SelectedDate
        )
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
      
      this.setState({
        selectedWorkOrder: this.props.ordersAndOperations.selectedWorkOrder
      });
    }
    //  else if (isEqual(WorkOrderId, this.state.selectedWorkOrder)) {
    //   notify.info("you need to select workorder");
    // }
  };

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
  openModal = () => {
    this.setState({
      showUpsertWorkorders: true
    });
  };
  hideGridModal = () => {
    this.setState({ showUpsertWorkorders: false });
  };
  validationMsg = msg => {
    if (msg.length == 0) {
      this.msg.show(`Work Order Assigne successful`, {
        time: 3000,
        type: "success"
      });
    } else {
      this.msg.show(this.createMsg(msg), {
        time: 5000,
        type: "error"
      });
    }
    this.props.cleanValidation();
  };
  createMsg = (msg) => {
    return <div style={{ width: 300 }} >
      <table>
        <thead>
        <tr>
          <th>S-Id</th>
          <th>P-Id</th>
          <th>Date</th>
          {/* <th>Miss</th>
          <th>booked</th> */}
          </tr>
          </thead>
          <tbody>  
          {
           msg.map((msgobj, index) => {
               return ( <tr key={index}>
                  <td>{msgobj.SectionId}</td>
                  <td>{msgobj.PossessionId}</td>
                  <td>{msgobj.SelectedDate}</td>
                  {/* <td>{msgobj.IsPossessionMissing}</td>
                  <td>{msgobj.IsOverbooked}</td> */}
                </tr>
               )
           })
          }
          </tbody>
    </table>
    </div>
   }
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

  hideGridModal = ()=>{
    this.setState({ showPossessionRec: false});   
  }
  render() {
    if( this.api && this.grid.config.columns && this.props.isOpened){
      this.api.sizeColumnsToFit();
     }
    const alertOptions = {
      offset: 14,
      position: "bottom left",
      theme: "dark",
      time: 5000,
      transition: "scale"
    };
    return (
      <div>
        <Header
          gridName={this.grid.config.gridName}
          config={this.state.headerConfig}

         // callback={this.onAssigne}
         // type={"Assign"}
         />
        <div>
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
                  onRowDoubleClicked={this.rowDoubleClicked}
                  config={this.grid.config}
                  lockedEntities={this.state.lockedEntities}
                />
              ) : (
                // )
                null
              )}

              {this.state.showPossessionRec ? (
                  <PossessionsRecommendation
                    showModal={this.state.showPossessionRec}
                    hideModal={this.hideGridModal}
                    possessions = {this.state.potentialPossessions}
                    bundlingMessage = {this.state.bundlingMessage}
                  />
                ) : null}
            </div>
         
          </div>
        </div>
        
        <AlertContainer
          ref={a => {
            this.msg = a;
          }}
          {...alertOptions}
        />
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
      selectWorkOrder,
      assinedWorkorder,
      assignedWorkOperation,
      cleanValidation,
      fetchOrdersAndOperations,
      getpotentialPossessions
      // fetchWorkorders,
      // fetchWorkOperations
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(
  WorkordersUnassigned
);
