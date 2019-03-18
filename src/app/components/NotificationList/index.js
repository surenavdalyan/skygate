import React from "react";
import Notification from "../Notification";
import "./index.scss";

class NotificationList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const list = this.props.texts.map(text => {
      return <Notification text={text} />;
    });
    return <div>{list}</div>;
  }
}

export default NotificationList;
