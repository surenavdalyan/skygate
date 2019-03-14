import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { getPossessionHistory } from "../../../actions/possessions";
import {Popover , ButtonToolbar, Button, OverlayTrigger} from "react-bootstrap"
import axios from "axios";
import _ from "lodash";
import "./styles.scss";

class PopoverHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: true,
      hasVisible: false,
      empty: false,
      data: null
    };
    this.top = this.props.cord.top;
    this.left = this.props.cord.left;
  }
  componentWillMount() {
    const possesionId = this.props.props.data.Id;
    this.props.getPossessionHistory(possesionId, "possession");
  }
  componentWillReceiveProps(nextProps) {
    const tooltipStatus = nextProps.possessions.possessionHistory
    if (tooltipStatus.isFetching) {
      this.setState({
        isVisible: true,
        hasVisible: false,
      });
    }
    if (tooltipStatus.hasFetched && tooltipStatus.data.length > 0) {
      this.setState({
        isVisible: false,
        hasVisible: true,
        data: tooltipStatus.data
      });
    }
    if (tooltipStatus.hasFetched && tooltipStatus.data.length === 0) {
      this.setState({
        isVisible: false,
        hasVisible: false,
        empty: true
      });
    }
  }
  createTooltip = () => {
    const { data } = this.state
    const fields = data[0];
    const headersKey = Object.keys(fields);
    const headerName = headersKey.filter((name) => {
      return name !== "HistoricalDataId" && name !== "HistoricalDataType";
    })
    return (
      <Popover positionLeft={this.left + 15} positionTop={this.top - 10} id="popover-positioned-left" >
        <div className="heveHistory">
          <table className="table table-bordered table-inverse">
            <thead>
              <tr className="table-active">
                {headerName.map((key, index) => {
                  return <th key={index}>{key}</th>;
                })}
              </tr>
            </thead>
            <tbody>
              {data.map((history, index) => {
                return (
                  <tr key={`${index}history`}>
                    {headerName.map((field, index) => {
                      return <td key={`${index}field`}>{history[field]}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Popover>
    );
  };
  emptyHistory = () => {
    return (
      <Popover 
        positionLeft={this.left + 15}
        positionTop={this.top - 10}
        id="popover-positioned-left"
      >
        <div className="emptyHistory">No History</div>
      </Popover>
    );
  };
  render() {
    if (this.state.isVisible) {
      return (
        <Popover
          positionLeft={this.left + 15}
          positionTop={this.top - 10}
          id="popover-positioned-left"
        >
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </Popover>
      );
    } else if (this.state.hasVisible) {
      return this.createTooltip();
    } else if (this.state.empty) {
      return this.emptyHistory();
    }
  }
}
function mapStateToProps({ possessions }) {
  return { possessions };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getPossessionHistory
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PopoverHistory);
