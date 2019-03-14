import React from "react";
import { ButtonToolbar, OverlayTrigger } from "react-bootstrap";
import PopoverHistory from "./historyRenderer";

const onClicked = (event, colConfig, props) => {
  if (!event.detail || event.detail === 1) {
    if (typeof colConfig.onClick === "function") {
      // props.node.setDataValue(
      //   props.colDef.field,
      //   !props.data[props.colDef.field]
      // );
      colConfig.onClick(event, props);
    }
    event.stopPropagation();
  }
};

class CellRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cord: {}
    };
  }
  componentWillMount() {}
  componentWillReceiveProps(nextprops) {}
  historyClick = (e) => {
    const element = e.target
    const cord = element.getBoundingClientRect();
    this.setState({cord})
  }
  render() {
    const cord = this.state.cord;
    let content = "";
    let tooltip = "";
    if (this.props.data) {
      const val = this.props.colDef.field;
      let colConfig = {};
      if (this.props.api.gridOptionsWrapper.gridOptions) {
        colConfig = this.props.api.gridOptionsWrapper.gridOptions.columnDefs.filter(
          col => col.field === this.props.colDef.field
        )[0];
      }
      switch (this.props.colDef.field) {
        case "History": {
          let historyIcon;
          if (val) {
            historyIcon = "icon-history";
          } 
          content = (
            <div>
              <ButtonToolbar onMouseEnter={this.historyClick}>
                <OverlayTrigger delayShow={200} trigger={['hover', 'focus']} placement="bottom"  overlay={<PopoverHistory cord={cord} props={this.props} />}> 
                  <a className={historyIcon} />
                </OverlayTrigger>
              </ButtonToolbar>
            </div>
          )
          break;
        }
        case "Edit": {
          let editIcon;
          if (val) {
            editIcon = "icon-edit";
            tooltip = "edit";
          }
          content = <a href="javascript:void(0)"><i className={`grid-icons ${editIcon}`}/></a>
          break;
        }
        case "Save": {
          let saveIcon;
          if (val) {
            saveIcon = "icon-information";
            tooltip = "Save";
          }
          content =  <a href="javascript:void(0)"><i className={`grid-icons ${saveIcon}`} /></a>;
          break;
        }
        case "warning": {
          let saveIcon;
          if (val) {
            saveIcon = "icon-information";
            tooltip = `${this.props.data.Severity}: ${this.props.data.warningMessage}`;
          }
          content = this.props.data.warningMessage ? <a href="javascript:void(0)"><i className={`grid-icons red ${saveIcon}`} /></a>:"";
          break;
        }
        default:
          return null;
      }
      return (
        <div role="presentation" className="custom-icon-cell" title={tooltip}>
          {content}
        </div>
      );
    }
    return null;
  }
}

// export default connect(mapStateToProps, mapDispatchToProps)(CellRenderer);
export default CellRenderer;

export const CellStyleOption = params => {
  if (params.value > 100) {
    return true;
  }
  return false;
};
export const CellDateRenderer = props => {
  const { colDef, data } = props;
  const CELL_VALUE = data[colDef.field];
  if (CELL_VALUE === null) {
    return <span></span>
  }
  return <span>{CELL_VALUE}</span>;
};

export const CellDateNoTimeRenderer = props => {
  const { colDef, data } = props;
  const CELL_VALUE = data[colDef.field];
  if (CELL_VALUE === null) {
    return <span></span>
  }

  var date = new moment(data[colDef.field]);
  var formatted = date.format("YYYY-MM-DD");
  return <span>{formatted}</span>;
};

export const CellIntNotNullRenderer = props => {
  const { colDef, data } = props;
  const CELL_VALUE = data[colDef.field];
  if (!CELL_VALUE) {
    return <span />;
  }

  return <span>{CELL_VALUE}</span>;
};
