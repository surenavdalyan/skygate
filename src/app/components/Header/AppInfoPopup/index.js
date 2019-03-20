import React from 'react';
import { Modal } from 'react-bootstrap';
import AppInfoGrid from '../../grids/AppInfoGrid';
import './index.scss';

export default (props) => {
  console.log('Launching App Info Grid..');
  return (
    <Modal dialogClassName="modal-90w" onHide={props.onHide} show={props.show}>
      <Modal.Header closeButton>
        <Modal.Title>SkyGate Features</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>List of features.</p>
        <div className="app-info-grid">
          <AppInfoGrid />
        </div>
      </Modal.Body>
    </Modal>
  );
};
