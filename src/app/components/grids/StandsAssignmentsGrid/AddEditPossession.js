import React, { Component } from "react";
import isEmpty from "lodash/isEmpty";
import PropTypes from "prop-types";
import moment, { duration } from "moment";
import { cloneDeep as _cloneDeep } from "lodash/lang";
import {
  Modal,
  Button,
  Col,
  // Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
  // Checkbox
} from "react-bootstrap";
import Datetime from "react-datetime";

const apiStateMapping = {
  StartDate: "StartDate",
  Duration: "Duration",
  Equipment: "Equipment",
  Task: "Task"
};
const getFormattedDate = date =>
  moment(date).isValid() ? moment(date).format("DD-MM-YYYY") : "";
class AddEditPossession extends Component {
  static propTypes = {
    isEdit: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    selectedRows: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.title = props.isEdit ? "Edit Shutdown" : "Add New Shutdown";
    this.state = {
      selectedRows: this.props.selectedRows,
      ...this.getDefaults(),
      ...this.getEditFormFields()
    };
  }
  onDateSelected = dt => {
    this.setState({ StartDate: dt });
  };

  onApply = () => {
    this.props.onSave(
      this.state.selectedRows,
      this.state.StartDate,
      this.state.Duration,
      this.state.Task,
      this.state.Equipment
    );
  };
  onValueChanged = e => {
    this.setState({
      Duration: e.target.value
    });
  };
  onTaskNameChanged = e => {
    this.setState({
      Task: e.target.value
    });
  };
  onEquipmentChanged = e => {
    this.setState({
      Equipment: e.target.value
    });
  };
  getEditFormFields = () => {
    if (this.props.isEdit && this.props.selectedRows.length>0) {
      const rowData = this.props.selectedRows[0];
      return Object.keys(apiStateMapping).reduce((acc, val) => {
        acc[apiStateMapping[val]] = rowData[val] || "";
        return acc;
      }, {});
    }
    return {};
  };
  getDefaults = () => ({
    Duration: "",
    StartDate: "",
    Equipment: "",
    Task: ""
  });
  render() {
    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.hideModal}
        bsSize="large"
        dialogClassName="possession-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form
            ref={e => {
              this.formEl = e;
            }}
            className="form-horizontal"
          >
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                Task Name
              </Col>
              <Col sm={4}>
                <FormControl
                  type="text"
                  placeholder="Enter Task Name"
                  value={this.state.Task}
                  onChange={this.onTaskNameChanged}
                />
              </Col>
              <Col componentClass={ControlLabel} sm={2}>
                Equipment
              </Col>
              <Col sm={4}>
                <FormControl
                  type="text"
                  placeholder="Enter Equipment"
                  value={this.state.Equipment}
                  onChange={this.onEquipmentChanged}
                />
              </Col>
            </FormGroup>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={2}>
                Start Time
              </Col>
              <Col sm={4}>
                <Datetime
                  value={getFormattedDate(this.state.StartDate)}
                  onChange={this.onDateSelected}
                  dateFormat="MM-DD-YYYY"
                  className="full-width"
                  inputProps={{
                    placeholder: "Select start time"
                  }}
                />
              </Col>
              <Col componentClass={ControlLabel} sm={2}>
                Duration (hrs)
              </Col>
              <Col sm={4}>
                <FormControl
                  type="number"
                  placeholder="Select duration (hrs)"
                  max={24}
                  min={0}
                  step={0.01}
                  onChange={this.onValueChanged}
                  value={this.state.Duration}
                />
              </Col>
            </FormGroup>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-success" onClick={this.onApply}>
            Save
          </Button>
          <Button className="btn btn-default" onClick={this.props.hideModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default AddEditPossession;
