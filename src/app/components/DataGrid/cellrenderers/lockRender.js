import React, { Component } from "react";
import PropTypes from "prop-types";
import find from "lodash/find";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  possessionEndorse,
  possessionApprove
} from "../../../actions/possessions";
import notify from "../../../utils/notify";


class LockRenderer extends Component {

  state = {
    isChecked: this.props.value
  };

  render() {
    return (
      <label className="customcheckbox" htmlFor={this.props.data.rowId}>
        <input
          id={this.props.data.rowId}
          type="checkbox"
          checked={this.state.isChecked}
          // defaultChecked={this.props.value}
          className="form-check-input"

        />{" "}
        <span className="checkmark checkmark-forGrids" />
      </label>
    );
  }
}


export default LockRenderer;
