import React from "react";
import Toggler from "../../Toggler/index";

class Toggle extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="togglerColWidth" >
        <Toggler active={this.props.value}/>
      </div>
    );
  }
}

module.exports = Toggle;