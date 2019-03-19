import React from "react";
import { connect } from "react-redux";
import Notification from "../Notification";
import NotificationType from "../../constants/NotificationType";
import "./index.scss";

const data = [
  {
    notificationText: "FI633 scheduled for gate E3 is delayed by 50 minutes.",
    notificationType: "INFO",
    date: "2019-04-14T00:09:22"
  },
  {
    notificationText: "IB6165 scheduled for gate E4 is delayed by 25 minutes.",
    notificationType: "WARNING",
    date: "2019-04-10T17:19:22"
  },
  {
    notificationText: "BA213 scheduled for gate E12 is early by 20 minutes.",
    notificationType: "WARNING",
    date: "2019-04-12T19:23:22"
  }
];

const TypeMapping = inputType => {
  switch (inputType) {
    case "Information":
      return NotificationType.INFO;
    case "Warning":
      return NotificationType.WARNING;
    default:
      break;
  }
  return "";
};

class NotificationList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.itemList = data;
  }

  componentDidMount() {
    // console.log(this.props.sampleData);
    if (this.props.sampleData && this.props.sampleData.NotificationInput) {
      const { NotificationInput } = this.props.sampleData;
      const itemList = NotificationInput.filter(n => n.Type).map(n => ({
        notificationText: n.Message,
        notificationType: TypeMapping(n.Type),
        date: n.Time
      }));
      this.setState({ itemList });
    }
  }

  clearItem(index) {
    const itemList = [...this.state.itemList];
    itemList.splice(index, 1);
    this.setState({ itemList });
  }

  clearAllItem() {
    this.setState({ itemList: [] });
  }

  render() {
    const list = this.state.itemList.map((obj, index) => {
      return (
        <Notification data={obj} clearItem={() => this.clearItem(index)} />
      );
    });
    return (
      <div>
        <div className="notification-header">
          <span>Notifications</span>
          <span className="pull-right" onClick={() => this.clearAllItem()}>
            Clear all
          </span>
        </div>
        {list}
      </div>
    );
  }
}

function mapStateToProps({ sampleData }) {
  return {
    sampleData
  };
}

export default connect(mapStateToProps)(NotificationList);
