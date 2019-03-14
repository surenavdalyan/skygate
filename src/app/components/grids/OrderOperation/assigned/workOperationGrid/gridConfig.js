import constants from "../../../../../constants";
import { identifyRowChanges } from "../../../../DataGrid/editHelper";
import { CheckBox } from "../../../../DataGrid/cellrenderers/helper";
import { timeFormatter } from "../../../../DataGrid/helper";
import {
  CellRenderer,
  //CellDateRenderer,
  CellDateNoTimeRenderer
} from "../../../../DataGrid/cellrenderers/CellRender";
import MultiselectFilter from "../../../../DataGrid/filter/multiSelectFilter";
import { FilterConfig } from "../../../../DataGrid/filter/filterConfig";
import CellDateTimeRenderer from "../../../../DataGrid/cellrenderers/CellDateTimeRenderer";

class GridConfig {
  constructor(configuration) {
    const config = configuration || {};
    this.name = "GridConfiguration";
    this.config = GridConfig.getConfiguration(config);
  }

  static getConfiguration() {
    return GridConfig.getDefaultConfiguration();
  }
  static onCellValueChanged = params => {
    identifyRowChanges(params);
  };
  static rowEditableStatus = params => {
    const edit = params.node.data.statusType;
    if (edit === true) {
      return true;
    }
    return false;
  };
  static getDefaultConfiguration(config) {
    return {
      columns: [
        {
          cellType: constants.STRING,
          editable: false,
          field: "none",
          headerName: "Select",
          minWidth: 40,
          maxWidth: 40,
          headerCheckboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: true,
          pinned: "left"
        },
        {
          cellType: constants.NUMBER,
          editable: false,
          headerName: "Work Order Operation",
          minWidth: constants.minColumnWidths.WorkOrderOperation,
          maxWidth: constants.minColumnWidths.WorkOrderOperation,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          valueGetter: params => `${params.data.WorkOrderReferenceId}-${params.data.OperationId}`,
          enableRowGroup: true,
          pinned: "left"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Description",
          headerName: "Description",
          minWidth: 250,
          maxWidth: 250,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "ResourceWorkCenterName",
          headerName: "Oper. Work Center",
          minWidth: 180,
          maxWidth: 180,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Revision",
          headerName: "Revision",
          minWidth: constants.minColumnWidths.WorkOrderRevision,
          maxWidth: constants.minColumnWidths.WorkOrderRevision,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true
        },
        {
          cellType: constants.TEXT,
          editable: false,
          field: "WorkOrderReferenceId",
          headerName: "WorkOrder Reference Id",
          minWidth: constants.minColumnWidths.Text,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          hide: true,
          enableRowGroup: true
        },
        {
          cellType: constants.DATETIME,
          editable: false,
          field: "StartTime",
          headerName: "Start Time",
          minWidth: constants.minColumnWidths.WorkOrderDateTime,
          maxWidth: constants.minColumnWidths.WorkOrderDateTime,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          cellRendererFramework: CellDateTimeRenderer,
          isChecked: false,
          enableRowGroup: true
        },
        {
          cellType: constants.DATETIME,
          editable: false,
          field: "EndTime",
          headerName: "End Time",
          minWidth: constants.minColumnWidths.WorkOrderDateTime,
          maxWidth: constants.minColumnWidths.WorkOrderDateTime,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          cellRendererFramework: CellDateTimeRenderer,
          isChecked: false,
          enableRowGroup: true
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "NumberOfResources",
          headerName: "Resource Count",
          minWidth: constants.minColumnWidths.WorkOrderString,
          maxWidth: constants.minColumnWidths.WorkOrderString,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true,
          cellClass: "center-align"
        },
        {
          cellType: constants.NUMBER,
          editable: false,
          // field: "Duration",
          headerName: "Duration (Hours)",
          minWidth: 180,
          maxWidth: 180,
          valueGetter(params) {
            // console.log(params.data.Duration, params.data.NumberOfResources);
            return (
              params.data.Duration / params.data.NumberOfResources
            ).toFixed(1);
          },
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true,
          cellClass: "center-align"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Duration",
          headerName: "Resource Hours",
          valueGetter(params) {
            // console.log(params.data.Duration, params.data.NumberOfResources);
            return parseFloat(params.data.Duration).toFixed(1);
          },
          minWidth: constants.minColumnWidths.WorkOrderString,
          maxWidth: constants.minColumnWidths.WorkOrderString,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true,
          cellClass: "center-align"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "OperationStatus",
          headerName: "Operation Status",
          minWidth: constants.minColumnWidths.WorkOrderString,
          maxWidth: constants.minColumnWidths.WorkOrderString,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "SortField",
          headerName: "Equipment",
          minWidth: 150,
          maxWidth: 150,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Status",
          headerName: "Status",
          minWidth: constants.minColumnWidths.WorkOrderString,
          maxWidth: constants.minColumnWidths.WorkOrderString,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false,
          enableRowGroup: true
        }
      ],
      headerConfig: {
        menu: [
          {
            tooltip: "Show Grid View",
            name: "SHOW_GRID_VIEW",
            isVisible: true,
            icon: "icon-grid-view",
            onClick: "onShowGridView"
          },
          {
            tooltip: "Legends",
            name: "LEGENDS",
            isVisible: true,
            icon: "icon-legends",
            onClick: ""
          },
          {
            tooltip: "Show Gantt Chart",
            name: "SHOW_GANTT_CHART",
            isVisible: true,
            icon: "icon-graph",
            onClick: "onShowGanttChart"
          },
          {
            tooltip: "Unassign",
            name: "ADD",
            isVisible: true,
            text: "Unassign",
            onClick: "onAssignAction"
          }
        ]
      },
      enableFilter: true,
      gridName: constants.gridNames.workOperationGrid,
      entityName: constants.entityNames.workOperationGrid,
      keyColumn: "Id",
      rowSelection: "single",
      title: "Work Operation Grid"
    };
  }
}
export default GridConfig;
