import React, { Component } from "react";
import PropTypes from "prop-types";
import { Scrollbars } from "react-custom-scrollbars";

import {
  Modal,
  Button,
  Col,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock
  // Checkbox
} from "react-bootstrap";


class PossessionsRecommendation extends Component {

  constructor(props) {
    super(props);
    this.title = "Possession Recommendation";
    this.state = {
      possessions: props.possessions,
      bundlingMessage:props.bundlingMessage
    }
  }
  componentWillReceiveProps(nextProps){
    this.setState({
      possessions: nextProps.possessions,
      bundlingMessage: nextProps.bundlingMessage
    })
  }

  renderThumb({ style, ...props }) {
    const top = 0
    const thumbStyle = {
        backgroundColor: `rgba(33, 126 ,205, 0.5)`,
    };
    return (
        <div
            style={{ ...style, ...thumbStyle }}
            {...props}/>
    );
  }

  render() {

    return (
      <Modal
        show={this.props.showModal}
        onHide={this.props.hideModal}
        dialogClassName="possession-modal possessions-recommendation"
      >
        <Modal.Header closeButton>
          <Modal.Title>{this.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.props.bundlingMessage.length >0 ? (<div> 
            {this.state.possessions.length>0 && <div className="modal-hint"> Work Order can be bundled with following routine possessions: </div>}
            {this.state.possessions.length>0 && <Scrollbars  className="pr-message" 
                  renderThumbHorizontal={this.renderThumb}
                  renderThumbVertical={this.renderThumb}
                // autoHide
                // autoHideTimeout={2000}
                // autoHideDuration={200}
                >
              
              {this.state.possessions.map( (possession)=> (
                  <span> {possession.Name}</span>
              ))}
            </Scrollbars> }

            <div className="modal-hint">{this.state.bundlingMessage} </div>
          </div>): (<div className="loading" />) }
        </Modal.Body>
        <Modal.Footer>          
          <Button className="btn btn-default" onClick={this.props.hideModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default PossessionsRecommendation;
