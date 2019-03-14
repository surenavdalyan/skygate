import React, { Component } from "react";
import { Tabs, Tab, Row, Grid, Col } from "react-bootstrap";
import GridHeader from "../../DataGrid/Header/index";
import GridConfig from "./config";
import PossessionResources from "./possessionResourceGrid/index";
import OrderResources from "./orderResourceGrid/index";

class Resources extends Component {
  constructor(props, context) {
    super(props, context);
    this.grid = new GridConfig();
    this.state = {
      headerConfig: this.grid.config.headerConfig,
      activeTab: 1,
      isOpened: false
    };
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
    const PossessionResourcesOpened = this.state.isOpened && this.state.activeTab == 1 ? true : false;
    const OrderResourcesOpened = this.state.isOpened && this.state.activeTab == 2 ? true : false
    return (
      <Grid fluid className="resourcesGrid">
        <Row className="grid-controls" style={{ marginRight: 0 }}>
          <GridHeader
            config={this.state.headerConfig}
            changeView={this.props.onGridViewChange}
          />
        </Row>
        <Row>
        <PossessionResources  isOpened = {PossessionResourcesOpened}/>
          {/* <Tabs
            activeKey={this.state.activeTab}
            onSelect={this.handleSelect}
            id="workorder-tabs"
          >
            <Tab eventKey={1} title="Possession Resources">
              <div className="resource-table">
                <PossessionResources  isOpened = {PossessionResourcesOpened}/>
              </div>
            </Tab>
            <Tab eventKey={2} title="Order Resources">
              <div className="resource-table">
                <OrderResources isOpened = {OrderResourcesOpened} />
              </div>
            </Tab>
          </Tabs> */}
        </Row>
      </Grid>
    );
  }
}

export default Resources;
