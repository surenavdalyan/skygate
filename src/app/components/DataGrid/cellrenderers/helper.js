import React, { Component } from "react";
import PropTypes from "prop-types";
import find from "lodash/find";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  possessionEndorse,
  possessionApprove
} from "../../../actions/possessions";
import notify from "../../../utils/notify";
import { rowEditableStatus } from "../editHelper"

const impactMapping = {
  High: "Quarterly",
  Medium: "Monthly",
  Low: "Weekly",
  Minor: "Weekly"
};

const getImpactType = (val, parameterMapping) => {
  const impact = find(
    parameterMapping.sort((a, b) => {
      return b.PossessionImpactId - a.PossessionImpactId;
    }),
    param => val >= param.MinTime && val <= param.MaxTime
  );
  return impactMapping[impact.Name];
};

class CheckBoxFunc extends Component {
  static propTypes = {
    possessionEndorse: PropTypes.func.isRequired,
    possessionApprove: PropTypes.func.isRequired,
    parameterMapping: PropTypes.arrayOf(PropTypes.object).isRequired,
    userProfile: PropTypes.shape.isRequired,
    colDef: PropTypes.shape.isRequired,
    data: PropTypes.shape.isRequired,
    value: PropTypes.bool.isRequired
  };
  state = {
    isChecked: this.props.value
  };
  onChangeCheck = (e, data) => {
    const EndorsApiCall = this.props.possessionEndorse;
    const ApprovalApiCall = this.props.possessionApprove;
    const impactType = getImpactType(
      data.Duration,
      this.props.parameterMapping
    );
    let privilegeName;
    let isAllowed;
    let privilegeType = "Endorse";
    switch (this.props.colDef.field) {
      case "IsEndorsedByWeeklyScheduler":
        privilegeName = `canEndorse${impactType}PlannerPossession`;
        isAllowed = this.props.userProfile[privilegeName];
        break;
      case "IsEndorsedByMonthlyScheduler":
        privilegeName = `canEndorse${impactType}IPROPossession`;
        isAllowed = this.props.userProfile[privilegeName];
        break;
      case "IsApproved":
        privilegeName = `canApprove${impactType}Possession`;
        isAllowed = this.props.userProfile[privilegeName];
        privilegeType = "Approve";
        break;
      case "IsContinuous":
      case "IsAdjProtectionRequired":
      case "TrackOutageRequired":
        return;
      default:
        isAllowed = true;
        break;
    }

    if (!isAllowed) {
      notify.warning(
        `You don not have Permissions to ${privilegeType} ${impactType} Possession`
      );
      return;
    }
    const UserDetails = localStorage.getItem("user");
    const UserName = UserDetails ? JSON.parse(UserDetails).userName : "";
    if ((this.props.colDef.field === "IsEndorsedByMonthlyScheduler" && !data.IsApproved && data["Status"].toLocaleLowerCase() != "endorsed") || (this.props.colDef.field === "IsEndorsedByMonthlyScheduler" && !data.IsApproved && localStorage.getItem("selectedrole").toLocaleLowerCase() == "super user")) {
      if (rowEditableStatus(this.props) && !data["IsEntityLockedToChange"]) {
        // Endorse IPRO
        const possessionIDs = [];

        possessionIDs.push(data.Id);
        const EndorsmentType = e.target.checked;

        const endorsmentInfo = {
          possessionIDs,
          UserName,
          EndorsmentType,
          unEndorse: !e.target.checked
        };
        EndorsApiCall("Endorsed_IPRO", endorsmentInfo);
        this.setState(prevState => ({
          isChecked: !prevState.isChecked
        }));
      }

    }
    if ((this.props.colDef.field === "IsEndorsedByWeeklyScheduler" && !data.IsApproved && data["Status"].toLocaleLowerCase() != "endorsed") || (this.props.colDef.field === "IsEndorsedByWeeklyScheduler" && !data.IsApproved && localStorage.getItem("selectedrole").toLocaleLowerCase() == "super user")) {
      if (rowEditableStatus(this.props) && !data["IsEntityLockedToChange"]) {
        // Endorse IPRO
        const possessionIDs = [];
        possessionIDs.push(data.Id);
        const EndorsmentType = e.target.checked;
        const endorsmentInfo = {
          possessionIDs,
          UserName,
          EndorsmentType,
          unEndorse: !e.target.checked
        };

        EndorsApiCall("Endorsed_Planner", endorsmentInfo);
        this.setState(prevState => ({
          isChecked: !prevState.isChecked
        }));
      }
    }
    if (this.props.colDef.field === "IsApproved") {
      if (data.IsEndorsedByWeeklyScheduler && data.IsEndorsedByMonthlyScheduler && !this.state.isChecked) {
        if (rowEditableStatus(this.props) && !data["IsEntityLockedToChange"]) {
          const possessionIDs = [];
          possessionIDs.push(data.Id);
          const approvementInfo = {
            possessionIDs,
            UserName
          };
          ApprovalApiCall(approvementInfo);
          this.setState(prevState => ({
            isChecked: !prevState.isChecked
          }));
        }
      }
    }

  };
  render() {
    console.log(this.props.colDef)
    return (
      <label className="customcheckbox" htmlFor={this.props.data.rowId}>
        <input
          id={this.props.data.rowId}
          type="checkbox"
          checked={this.state.isChecked}
          // defaultChecked={this.props.value}
          className="form-check-input"
          onChange={e => {
            this.onChangeCheck(e, this.props.api.getSelectedNodes()[0].data);
          }}
        />{" "}
        <span className="checkmark checkmark-forGrids" />
      </label>
    );
  }
}

/* <label key={fieldId} className="customcheckbox" htmlFor={fieldId}>
  {text}
  <input type="checkbox" id={fieldId} defaultChecked={checked} onChange={event => { this.flipRolePrivilege(event, this.props.selectedRole, fieldId); }}/>
  <span className="checkmark" />
  </label> */
const mapStateToProps = ({
  userPreferencesInfo,
  userProfile,
  parameterSettings: { parameterMapping }
}) => ({
  userPreferencesInfo,
  userProfile,
  parameterMapping
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      possessionEndorse,
      possessionApprove
    },
    dispatch
  );
const CheckBox = connect(mapStateToProps, mapDispatchToProps)(CheckBoxFunc);

export default CheckBox;
