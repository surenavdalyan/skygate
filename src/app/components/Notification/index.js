import React from "react";

import "./index.scss";

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="notification">
        <i className="icon-about" />
        <span className="notification-span">{this.props.text}</span>
      </div>
    );
  }
}

export default Notification;
