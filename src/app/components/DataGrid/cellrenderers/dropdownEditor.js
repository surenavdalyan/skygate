import React from "react";
import Select from "react-select";
import "../styles.scss";

export default class DropdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null
    };
    this.options = [];
    this.logChange = this.logChange.bind(this);
    this.setOptionValues = this.setOptionValues.bind(this);
  }

  componentDidMount() {
    this.setOptionValues();
  }

  setOptionValues() {
    /* dropDownValues: function in parent component to get dropdown values */
    this.options = this.props.context.componentParent.dropDownValues();
    this.setState({
      value: this.props.value
    });
  }

  getValue() {
    return this.state.value;
  }

  isPopup() {
    return true;
  }

  logChange(value) {
    /* valueChange: function in parent component to operate on changed values */
    if (value !== null) {
      this.props.context.componentParent.valueChange(value);
      this.setState({
        value: value.value
      });
    }
  }

  render() {
    let showDropDownOption = true;
    if (this.props.column.colId === "routeName" && !this.props.value) {
      showDropDownOption = false;
    }
    return (
      <div className="dropdown">
        {showDropDownOption && (
          <Select
            name="select-node"
            value={this.state.value}
            options={this.options}
            onChange={this.logChange}
            className={this.props.column.colDef.dropDownClass}
          />
        )}
      </div>
    );
  }
}
