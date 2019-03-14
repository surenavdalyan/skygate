import React, { Component } from "react";
import { Grid, Row, Col, Modal, Button } from "react-bootstrap";
import Datetime from "react-datetime";
import "../../../../../../styles/components/dateTimeStyles.scss";
import moment from "moment";

export default class WorkordersModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showGridModal: this.props.showGridModal || false,
      dateStart: " ",
      dateEnd: " "
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.showGridModal !== this.state.showGridModal) {
      this.setState({ showGridModal: nextProps.showGridModal });
    }
  }

  onChangesSave = () => {
    console.log("save");
    const startDate = this.state.dateStart.format("MM/DD/YYYY h:mm");
    const endDate = this.state.dateEnd.format("MM/DD/YYYY h:mm");
    this.setState({
      dateStart: " ",
      dateEnd: " "
    });
    console.log(startDate, endDate);
    this.modalWindowClose();
  };
  onChangesCancel = () => {
    console.log("cancel");
    this.modalWindowClose();
    this.props.rowEditstop();
  };

  onStartdateTimeChange = time => {
    this.setState({
      dateStart: time
    });
  };
  onEnddateTimeChange = time => {
    this.setState({
      dateEnd: time
    });
  };
  modalWindowClose = () => {
    this.props.hideGridModal();
  };
  render() {
    return (
      <div className="modal-container">
        <Modal
          show={this.state.showGridModal}
          onHide={this.props.onHide}
          backdrop="static"
          animation
          container={document.body}
        >
          <Modal.Header bsClass="modal-header modal-header-costom">
            <Modal.Title id="contained-modal-title-lg">Add/Edit</Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass="modal-body modal-body-rowEditing">
            <label>StartTime </label>
            <Datetime
              className="add-posses-controls"
              defaultValue={this.state.dateStart}
              onChange={this.onStartdateTimeChange}
            />
            <label>EndTime </label>
            <Datetime
              className="add-posses-controls"
              defaultValue={this.state.dateEnd}
              onChange={this.onEnddateTimeChange}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onChangesSave}>Save</Button>
            <Button onClick={this.onChangesCancel}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
