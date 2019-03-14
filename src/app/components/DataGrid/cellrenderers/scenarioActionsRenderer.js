import React from "react";
import { Button } from "react-bootstrap";
import Events from "../../../utils/EventEmitter";

export default class ScenarioActionsRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.scenarioActionClicked = this.scenarioActionClicked.bind(this);
  }
  scenarioActionClicked() {
    this.props.context.componentParent.scenarioActionButtonClicked(this.props.node.data.scenarioId,  this.props.node.data.scenarioName);
  }
  render() {
    return (
      <Button bsSize="small" bsStyle="success" onClick={this.scenarioActionClicked}>
        Open
      </Button>
    );
  }
}
