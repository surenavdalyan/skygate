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

const getFormattedDate = date =>
  moment(date).isValid() ? moment(date).format("DD-MM-YYYY hh:mm A") : "";
class BulkEditPossession extends Component {
  static propTypes = {
    showModal: PropTypes.bool.isRequired,
    hideModal: PropTypes.func.isRequired,
    selectedRows: PropTypes.array.isRequired,
    onSave: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
    this.title = "Bulk Edit Shutdowns";
    this.state = {
      selectedRows: this.props.selectedRows,
      adjustedDays: ""
    };
  }
  onDateSelected = dt => {
    const selectedRows = _cloneDeep(this.state.selectedRows);
    selectedRows.forEach(
      selectRow => (selectRow.UpdatedtTime = getFormattedDate(dt))
    );

    this.setState({ selectedRows });
  };

  onApply = () => {
    this.props.onSave(this.state.selectedRows);
  };
  handleSelection = params => {
    const selectedValue = params.target.value;
    const selectedRows = _cloneDeep(this.state.selectedRows);
    selectedRows.forEach(selectRow => {
      const date = selectRow.UpdatedtTime
        ? selectRow.UpdatedtTime
        : selectRow.StartTime;
      selectRow.UpdatedtTime = moment(date).add(
        parseFloat(selectedValue),
        "days"
      );
    });
    this.setState({ selectedRows, adjustedDays: selectedValue });
  };

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
              <Col
                style={{ fontWeight: "bold" }}
                componentClass={ControlLabel}
                sm={2}
              >
                Start Time
              </Col>
              <Col sm={4}>
                <Datetime
                  value=""
                  onChange={this.onDateSelected}
                  dateFormat="MM-DD-YYYY"
                  className="full-width"
                  inputProps={{
                    placeholder: "Select start time"
                  }}
                />
              </Col>
              <Col
                style={{ fontWeight: "bold" }}
                componentClass={ControlLabel}
                sm={2}
              >
                Adjust Start Time (Days)
              </Col>
              <Col sm={4}>
                <FormControl
                  componentClass="select"
                  placeholder="select"
                  value={this.state.adjustedDays}
                  onChange={this.handleSelection}
                >
                  <option key="select" value="">
                    Select...
                  </option>
                  {Array.from({ length: 21 }).map((item, i) => (
                    <option key={i - 10} value={i - 10}>
                      {i - 10}
                    </option>
                  ))}
                </FormControl>
              </Col>
            </FormGroup>
            <div className="bulkeditshuts">
              <table className="tbl-bulkeditshuts" style={{ border: "none" }}>
                <th>
                  Task
                </th>
                <th>
                  Current Start Time
                </th>
                <th >Updated Start Time</th>
              </table>

                {this.state.selectedRows.map(item => (
                <FormGroup>
                  <Col style={{fontWeight:"bold"}} componentClass={ControlLabel} sm={2}>
                    {item.Task}
                  </Col>
                  <Col sm={4}>
                    <Datetime
                      value={getFormattedDate(item.StartDate)}
                      //   onChange={this.onDateSelected("startTime")}
                      dateFormat="MM-DD-YYYY"
                      className="full-width"
                      inputProps={{ disabled: true }}
                    />
                  </Col>
                  <Col sm={4}>
                    <Datetime
                      value={getFormattedDate(
                        item.UpdatedtTime ? item.UpdatedtTime : item.StartTime
                      )}
                      //   onChange={this.onDateSelected("startTime")}
                      dateFormat="MM-DD-YYYY"
                      className="full-width"
                      inputProps={{ disabled: true }}
                    />
                  </Col>
                </FormGroup>
              ))}
            </div>
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

export default BulkEditPossession;
