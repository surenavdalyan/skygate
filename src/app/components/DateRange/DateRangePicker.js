import React, { Component } from "react";
import {
  Tabs,
  Tab,
  Modal,
  Col,
  Row,
  Grid,
  Button,
  ButtonToolbar
} from "react-bootstrap";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";
import { formatDate, parseDate } from "react-day-picker/moment";
import moment from "moment";
import './index.scss';

class PublishHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      from: new Date(),
      to: new Date()
    };
  }
  showFromMonth = () => {
    const { from, to } = this.state;
    if (!from) {
      return;
    }
    if (moment(to).diff(moment(from), "months") < 2) {
      this.to.getDayPicker().showMonth(from);
    }
  };
  handleFromChange = from => {
    // Change the from date and focus the "to" input field
    this.setState({ from });
  };
  handleToChange = to => {
    this.setState({ to }, this.showFromMonth);
  };
  ele = el => {
    this.to = el;
  };
  showRangeSelector = e => {
    this.from.hideDayPicker();
    this.to.showDayPicker();
  };

  customFormate = date => {
    return moment(date).format("YYYY-MM-DD");
  };
  close = () => {
    this.setState({
      from: undefined,
      to: undefined
    });
    this.props.onHide();
  };

  enableDisablebtn = () => {
    return this.state.from && this.state.to;
  };
  downloadPublishedData = () => {
    if (this.state.to && this.state.from) {
      this.close();
      notify.success("Downloading.");
      PublishAPI.downloadAllPublishedData({
        effectiveDateStart: moment(this.state.from).format("YYYY-MM-DD"),
        effectiveDateEnd: moment(this.state.to).format("YYYY-MM-DD"),
        userId: JSON.parse(localStorage.getItem("user")).userId
      }).then(response => {
        if (response.data && response.data.fileName) {
          download.downloadFile(response.data.fileName);
          notify.success("Downloaded.");
        } else {
          notify.error(response.data.error);
        }
      });
    }
  };

  onSubmit = () => {
    this.props.onSelect(this.state.from, this.state.to);
    this.props.onHide();
  };

  render() {
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    return (
      <Modal
        show={this.props.show}
        className="date-range"
        onHide={this.close}
        dialogClassName="h-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-header-title">Select Date Range</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="InputFromTo">
            <span className="control-label">From</span>
            <DayPickerInput
              ref={el => (this.from = el)}
              value={from}
              formatDate={this.customFormate}
              parseDate={parseDate}
              dayPickerProps={{
                selectedDays: [from, { from, to }],
                disabledDays: { after: to },
                toMonth: to,
                modifiers,
                numberOfMonths: 2,
                onDayClick: () => this.to.getInput().focus()
              }}
              onDayChange={this.handleFromChange}
              onDayPickerShow={() => {
                this.to.hideDayPicker();
              }}
            />
            {" "}
            {/* &#45; */}
            {" "}
            <span className="control-label">To</span>
            <span className="InputFromTo-to">
              <DayPickerInput
                ref={el => (this.to = el)}
                value={to}
                formatDate={this.customFormate}
                parseDate={parseDate}
                dayPickerProps={{
                  selectedDays: [from, { from, to }],
                  disabledDays: { before: from },
                  modifiers,
                  month: from,
                  fromMonth: from,
                  numberOfMonths: 2
                }}
                onDayChange={this.handleToChange}
              />
            </span>
            <Helmet>
              <style>
                {`
              .InputFromTo .DayPicker-Day--selected:not(.DayPicker-Day--start):not(.DayPicker-Day--end):not(.DayPicker-Day--outside) {
                background-color: #f0f8ff !important;
                color: #4a90e2;
              }
              .InputFromTo .DayPicker-Day {
                border-radius: 0 !important;
              }
              .InputFromTo .DayPicker-Day--start {
                border-top-left-radius: 50% !important;
                border-bottom-left-radius: 50% !important;
              }
              .InputFromTo .DayPicker-Day--end {
                border-top-right-radius: 50% !important;
                border-bottom-right-radius: 50% !important;
              }
              .InputFromTo .DayPickerInput-Overlay {
                width: 350px;
              }
              .InputFromTo-to .DayPickerInput-Overlay {
                margin-left: -198px;
              }
            `}
              </style>
            </Helmet>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar>
            <Button variant="outline-primary" onClick={this.onSubmit}>
              Submit
            </Button>
            <Button variant="outline-secondary" onClick={this.props.onHide}>
              Cancel
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PublishHistory;
