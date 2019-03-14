import React, { Component } from "react";
import { Tabs, Tab, Row, Grid, Col } from "react-bootstrap";
import GridHeader from "../../DataGrid/Header/index";
import GridConfig from "./config";
import WorkOperation from "./assigned/workOperationGrid/index";
import WorkordersGrid from "./assigned/workOrdersGrid/index";
import WorkOperationUnassigned from "./unassigned/workOperetion/index";
import WorkOrdersUnassigned from "./unassigned/workOrders/index";

class OperationOrders extends Component {
  constructor(props, context) {
    super(props, context);
    this.grid = new GridConfig();
    this.state = {
      headerConfig: this.grid.config.headerConfig,
      activeTab: 1,
      isOpened: false,
    };
  }
  componentWillReceiveProps(nextprops) {
    this.setState({isOpened: nextprops.isOpened});
  }
  handleSelect = activeTab => {
    this.setState({ activeTab });
  };
  onShowHideColumns = () => {};
  onShowGridView = () => {};
  onShowGanttChart = () => {};
  onSaveChanges = () => {};
  onRevertChanges = () => {};
  render() {
    const assignedGridOpen = this.state.isOpened && this.state.activeTab == 1 ? true : false;
    const unAssignedGridOpen =this.state.isOpened && this.state.activeTab == 2 ? true : false
    return (
      <Grid fluid>
        <Row className="grid-controls" style={{ marginRight: 0 }}>
          <GridHeader
            config={this.state.headerConfig}
            changeView={this.props.onGridViewChange}
          />
        </Row>
        <Row>
          <Tabs
            activeKey={this.state.activeTab}
            onSelect={this.handleSelect}
            id="workorder-tabs"
          >
            <Tab eventKey={1} title="Assigned">
              <div className="two-grid-content">
                <WorkordersGrid isOpened = {assignedGridOpen}/>
              </div>
              <div className="two-grid-content">
                <WorkOperation  isOpened = {assignedGridOpen}/>
              </div>
            </Tab>
            <Tab eventKey={2} title="Unassigned">
              <div className="two-grid-content">
                <WorkOrdersUnassigned  isOpened = {unAssignedGridOpen}/>
              </div>
              <div  className="two-grid-content">
                <WorkOperationUnassigned  isOpened = {unAssignedGridOpen}/>
              </div>
            </Tab>
          </Tabs>
        </Row>
      </Grid>
    );
  }
}

export default OperationOrders;
