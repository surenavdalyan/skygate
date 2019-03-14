import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  changeWorkorderEndorse,
  changeWorkorderApprove
} from "../../../actions/ossNotifications";

class CheckBoxWrapper extends React.Component {

  onInputChange = (e) => {
    const checked = this.props.data[this.props.colDef.field]
    const click_value = e.target.checked;
    switch (this.props.colDef.field) {
      case "Endorsed":
        this.props.changeWorkorderEndorse(this.props.data)
        break;
      case "Approved":
        this.props.changeWorkorderApprove(this.props.data);
        break;
    };
  }
  render() {
    const checked = this.props.data[this.props.colDef.field]
    return (
      <input
        defaultChecked={checked}
        type="checkbox"
        onClick={e => this.onInputChange(e)}
      />
    );
  }
}
const mapStateToProps = ({ }) => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeWorkorderEndorse,
      changeWorkorderApprove
    },
    dispatch
  );
const CheckBox = connect(mapStateToProps, mapDispatchToProps)(CheckBoxWrapper);

export default connect(mapStateToProps, mapDispatchToProps)(CheckBoxWrapper);
