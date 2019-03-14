import { ButtonToolbar, Dropdown } from "react-bootstrap";
import React from "react";

const isColumnVisibile = (columns, field) =>
  field && columns.find(col => col.colId === field).visible;

const ShowHideColumns = props => {
  let columnDefs = [];
  let maxHeight = "auto";
  let width = "auto";
  const item = props.item;
 
  if (props.api) {
    columnDefs = props.api.gridOptionsWrapper.gridOptions.columnDefs;
    maxHeight = 400;
    width = 250;
  }
  return (
    <ButtonToolbar className="showHideControl" title={item.tooltip}>
      <Dropdown id="showHideDropdown" bsSize="small" pullRight>
        <Dropdown.Toggle className="layoutIcon">
          <span className={`icon icon-hide ${item.icon}`} />
        </Dropdown.Toggle>
        <Dropdown.Menu
          id="showHide-dropdown-menu"
          style={{ maxHeight, width }}
          className="filter-scrollbar"
        >
          {columnDefs &&
            columnDefs.map((menuItem, index) => {
              const isVisible = isColumnVisibile(
                props.api.columnController.gridColumns,
                menuItem.field
              );
              const key = `showhidecol_${index}`;
              if (!menuItem.default && menuItem.field.length > 0) {
                return (
                  <li
                    onClick={() => {
                      props.onShowHide(
                        menuItem.field,
                        isVisible,
                        menuItem.headerName
                      );
                    }}
                    role="presentation"
                    disabled={menuItem.default}
                    key={key}
                  >
                    <span
                      className={`icon-hide icon-eye ${
                        isVisible ? "active" : ""
                      }`}
                    />
                    <span>
                      {!menuItem.headerName
                        ? menuItem.field
                        : menuItem.headerName}
                    </span>
                  </li>
                );
              }
              return false;
            })}
        </Dropdown.Menu>
      </Dropdown>
    </ButtonToolbar>
  );
};
export default ShowHideColumns;
