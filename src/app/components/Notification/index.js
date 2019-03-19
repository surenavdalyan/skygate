import React from "react";
import NotificationType from "../../constants/NotificationType";

import "./index.scss";

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  getIconForType(type) {
    switch (type) {
      case NotificationType.WARNING:
        return <i className="icon-warning warning" />;
      case NotificationType.INFO:
        return <i className="icon-about info" />;
      default:
        break;
    }
    return null;
  }

  render() {
    const { data } = this.props;
    return (
      <div className="notification">
        <div className="notification-icon">
          {this.getIconForType(data.notificationType)}
        </div>
        <div className="notification-text">
          {data.notificationText}
          <div className="notification-text-date">{data.date}</div>
        </div>
        <div className="notification-close">
          <i className="icon-close" onClick={this.props.clearItem} />
        </div>
      </div>
    );
  }
}

export default Notification;
