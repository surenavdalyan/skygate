import { ButtonToolbar, Dropdown } from "react-bootstrap";
import React from "react";

export const Legends = props => {
  let columnDefs = [];
  let maxHeight = "auto";
  let width = "auto";
  const item = props.item;
 
  return (
    <ButtonToolbar className="showHideControl legends-dropdown" title={item.tooltip}>
      <Dropdown id="showHideDropdown" bsSize="small" pullRight>
        <Dropdown.Toggle className="layoutIcon">
          <span className={`icon icon-hide ${item.icon}`} />
        </Dropdown.Toggle>
        <Dropdown.Menu
          id="showHide-dropdown-menu"
          style={{ maxHeight, width }}
          className="filter-scrollbar"
        >
         <li><span className="circle-color yellow"></span>Re-Rail</li>
         <li><span className="circle-color green"></span>Routine Maintenance</li>
         <li><span className="circle-color red"></span>Renewal Works</li>
         <li><span className="circle-color blue"></span>Grinding ML</li>
         <li><span className="circle-color orange"></span>Bundled</li>
         <li><span className="circle-color grey"></span>Other</li>
        </Dropdown.Menu>
      </Dropdown>
    </ButtonToolbar>
  );
};

export const OperationLegends = props => {
  let columnDefs = [];
  let maxHeight = "auto";
  let width = "auto";
  const item = props.item;
 
  return (
    <ButtonToolbar className="showHideControl legends-dropdown pull-right" title={item.tooltip}>
      <Dropdown id="showHideDropdown" bsSize="small" pullRight>
        <Dropdown.Toggle className="layoutIcon">
          <span className={`icon icon-hide ${item.icon}`} />
        </Dropdown.Toggle>
        <Dropdown.Menu
          id="showHide-dropdown-menu"
          style={{ maxHeight, width }}
          className="filter-scrollbar"
        >
         <li><span className="circle-color yellow"></span>SN08-S01</li>
         <li><span className="circle-color green"></span>SN08-S02</li>
         <li><span className="circle-color red"></span>SN08-S03</li>
         <li><span className="circle-color grey"></span>Others</li>
        </Dropdown.Menu>
      </Dropdown>
    </ButtonToolbar>
  );
};

