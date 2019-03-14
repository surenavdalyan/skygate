import React, { Component } from "react";
import { Grid, Row, Col, Modal, Button, ControlLabel, FormControl } from "react-bootstrap";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Datetime from "react-datetime";
import { saveNewPossession } from "../../../actions/possessions";
import "../../../../styles/components/dateTimeStyles.scss";
import "./upsertPossessionStyles.scss";
import moment from "moment";

class PossessionsModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showGridModal: this.props.showGridModal || false,
      FromKmMarker: "",
      ToKmMarker: "",
      dateStart: null,
      dateEnd: null,
      type: "possession",
      track: null,
      SectionId: null,
      workType: ""
    };
  }
  componentWillMount() {}
  componentDidMount() {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.showGridModal !== this.state.showGridModal) {
      this.setState({ showGridModal: nextProps.showGridModal });
    }
  }
// if date will necessary use --- MM/DD/YYYY h:mm
  onChangesSave = () => {
    const startTime = this.state.dateStart.format("MM/DD/YYYY h:mm");
    const endTime = this.state.dateEnd.format("MM/DD/YYYY h:mm");
    console.log("save");
    const Possession = [
      {
        PossessionType: this.state.type,
        WorkDate: startTime,
        Name: "name was not set",
        WorkType: this.state.workType,
        StartTime: startTime,
        EndTime: endTime,
        FromKmMarker: "-4.5825",
        ToKmMarker: "1.5887",
        SectionId: this.state.SectionId,
        FromTrackName: "FY-WT",
        ToTrackName: "FY-WT"
      }
    ];
    console.log(Possession);
    this.props.saveNewPossession(Possession);
    this.modalWindowClose();
  };
  onChangesCancel = () => {
    console.log("calcel");
    this.modalWindowClose();
  };
  modalWindowClose = () => {
    console.log("save/cancel/close");
    this.props.hideGridModal();
  };
  // --- handles ------
  onStartDate = time => {
    console.log(time);
    this.setState({
      dateStart: time
    });
  };
  onEndDate = time => {
    console.log(time);
    this.setState({
      dateEnd: time
    });
  };
  selectHandelChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    console.log(value,name )
    this.setState({
      [name]: value
    });
  };
  onHandelTracksChange = event => {
    const value = event.target.value;
    const name = event.target.name;
    const filteredTreck = this.props.initialState.sections.filter( track => {
      return track.Name === value;
    });
    const FromKmMarker = filteredTreck[0].FromKmMarker;
    const ToKmMarker = filteredTreck[0].ToKmMarker;
    const SectionId = filteredTreck[0].Id;
    this.setState({
      FromKmMarker,
      ToKmMarker,
      SectionId
    });
  };
  createOptions = allTracks => {
    return allTracks.map(track => {
      if (typeof track === 'object') {
        if (!this.state.FromKmMarker && !this.state.ToKmMarker) {
          this.setState({
            FromKmMarker: track.FromKmMarker,
            ToKmMarker: track.ToKmMarker
          });
        }
      return <option key={track.Id} value={track.Name}>{track.Name}</option>
    } else {
      return <option key={track} value={track}>{track}</option>
    }
    });
  };
  inputHandelNoChange = () => {}
  render() {
    const { sections, workTypes } = this.props.initialState;
    return (
      <div className="modal-container">
        <Modal
          show={this.state.showGridModal}
          onHide={this.props.hideGridModal}
          backdrop="static"
          animation
          container={document.body}
        >
          <Modal.Header closeButton bsClass="modal-header modal-header-costom">
            <Modal.Title id="contained-modal-title-lg">
              Add New Possessions
            </Modal.Title>
          </Modal.Header>
          <Modal.Body bsClass="modal-body modal-add-possession">
            <Grid fluid className="add-posses-wrapper">
              <Row>
                <ControlLabel>Type</ControlLabel>
                <FormControl
                  bsClass="form-control add-posses-controls"
                  componentClass="select"
                  placeholder="select"
                  onChange={this.selectHandelChange}
                  name="type"
                >
                  <option value="possession">Possession</option>
                  <option value="travel">Travel</option>
                </FormControl>
              </Row>
              <Row>
                <label>Start Time</label>
                <Datetime
                  className="add-posses-controls"
                  locale="de"
                 // dateFormat={false}
                 // defaultValue={this.state.dateStart}
                 
                  onChange={this.onStartDate}
                />
                 <label>End Time</label>
                <Datetime
                  className="add-posses-controls"
                  locale="de"
                // dateFormat={false}
                //  defaultValue={this.state.dateEnd}
                
                  onChange={this.onEndDate}
                />
              </Row>
              <Row>
                <ControlLabel>StartKM</ControlLabel>
                <FormControl
                  type="text"
                  bsClass="form-control add-posses-controls"
                  value={this.state.FromKmMarker}
                  // placeholder="Enter text"
                  name="startKm"
                  onChange={this.inputHandelNoChange}
                />
                <ControlLabel>EndKM</ControlLabel>
                <FormControl
                  type="text"
                  bsClass="form-control add-posses-controls"
                  value={this.state.ToKmMarker}
                  // placeholder="Enter text"
                  name="endKm"
                  onChange={this.inputHandelNoChange}
                />
              </Row>
              <Row>
                <ControlLabel>Track</ControlLabel>
                <FormControl
                  name="track"
                  bsClass="form-control add-posses-controls"
                  componentClass="select"
                  placeholder="select"
                  onChange={this.onHandelTracksChange}
                >
                  {this.createOptions(sections)}
                </FormControl>
                <ControlLabel>Work Type</ControlLabel>
                <FormControl
                  name="workType"
                  bsClass="form-control add-posses-controls"
                  componentClass="select"
                  placeholder="select"
                  onChange={this.selectHandelChange}
                >
                  {this.createOptions(workTypes)}
                </FormControl>
              </Row>
            </Grid>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.onChangesSave}>Save</Button>
            <Button onClick={this.onChangesCancel}>Cancel</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps({ initialState }) {
  return { initialState };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      saveNewPossession
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(PossessionsModal);
