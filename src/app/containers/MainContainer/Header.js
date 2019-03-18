import React from "react";
import Sidebar from "react-sidebar";
import moment from "moment";

import "./index.scss";
import DateRangePicker from "../../components/DateRange/DateRangePicker";
import NotificationList from "../../components/NotificationList";

const formattedDate = date => moment(date).format("MMM DD[,] YYYY");
const formattedDay = date => moment(date).format("DD");

class Header extends React.Component {
  constructor(props) {
    super(props);
    const refreshTime = "Today 11:10 AM";
    this.state = {
      StartTime: "2019-04-01T00:00:00",
      EndTime: "2019-04-08T00:00:00",
      refreshTime,
      showDateRange: false,
      sidebarOpen: false,
      texts: [
        "This is first fake notification.",
        "This is yet another fake notification but much much longer than the first notification.",
        "I am third notification!!"
      ]
    };
  }

  onSetSidebarOpen = open => {
    this.setState({ sidebarOpen: open });
  };

  showHideNotification = () => {
    this.setState({ showNotificationPanel: !this.state.showNotificationPanel });
  };

  showHideRange = () => {
    // console.log(this);
    this.setState({ showDateRange: !this.state.showDateRange });
  };

  onDateRangeSelect = (StartTime, EndTime) => {
    this.setState({
      StartTime,
      EndTime
    });
  };

  render() {
    const startDate = formattedDate(this.state.StartTime);
    const endDate = formattedDate(this.state.EndTime);
    const startDay = formattedDay(this.state.StartTime);
    const endDay = formattedDay(this.state.EndTime);
    return (
      <div className="header-area">
        <div className="header-area-left">
          <span className="date-range-wrapper" onClick={this.showHideRange}>
            <span className="span-calendar">{startDay}</span>
            <span>{startDate}</span>
            <span className="span-space">-</span>
            <span className="span-calendar">{endDay}</span>
            <span>{endDate}</span>
          </span>
          <DateRangePicker
            show={this.state.showDateRange}
            onHide={this.showHideRange}
            onSelect={this.onDateRangeSelect}
          />
        </div>
        <div className="header-area-center">
          <img
            src="../../../assets/images/SkyGATE Logo-01.png"
            alt="skygatelogo"
          />
        </div>
        <div className="header-area-right">
          <span>
            Refreshed:{this.state.refreshTime}
            <i className="icon-autorenew" />
          </span>

          <input type="text" placeholder="Search" />
          {/* <i className="icon-search" /> */}
          <span
            className="span-notify"
            onClick={() => {
              this.onSetSidebarOpen(true);
            }}
          />
        </div>
        {this.state.sidebarOpen && (
          <Sidebar
            sidebar={<NotificationList texts={this.state.texts} />}
            open={this.state.sidebarOpen}
            onSetOpen={this.onSetSidebarOpen}
            styles={{
              sidebar: {
                background: "#093a63",
                width: "350px"
              }
            }}
            pullRight={true}
          />
        )}
      </div>
    );
  }
}

export default Header;
