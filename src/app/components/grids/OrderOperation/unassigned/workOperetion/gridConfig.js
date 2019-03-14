import constants from "../../../../../constants";
import { identifyRowChanges } from "../../../../DataGrid/editHelper";
import { CheckBox } from "../../../../DataGrid/cellrenderers/helper";
import { timeFormatter } from "../../../../DataGrid/helper";
import {
  CellRenderer,
  CellDateRenderer,
  CellDateNoTimeRenderer
} from "../../../../DataGrid/cellrenderers/CellRender";
import MultiselectFilter from "../../../../DataGrid/filter/multiSelectFilter";
import { FilterConfig } from "../../../../DataGrid/filter/filterConfig";

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
          cellType: constants.NUMBER,
          editable: false,
          field: "OperationId",
          headerName: "Operation Id",
          minWidth: constants.minColumnWidths.Number,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
          // cellRendererFramework: CellRenderer
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Description",
          headerName: "Description",
          minWidth: constants.minColumnWidths.StartTime,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "AssignmentPossessionName",
          headerName: "Assigned Possession Name",
          minWidth: constants.minColumnWidths.StartTime,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.TEXT,
          editable: false,
          field: "WorkOrderReferenceId",
          headerName: "WorkOrder Reference Id",
          minWidth: constants.minColumnWidths.Text,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig()
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "FromKmMarker",
          headerName: "FromKmMarker",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(), 
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "FromTrackName",
          headerName: "From Track Name",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(), 
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "ToKmMarker",
          headerName: "To Km Marker",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "ToTrackName",
          headerName: "To Track Name",
          minWidth: constants.minColumnWidths.WorkType,
          isChecked: false
        },
        {
          cellType: constants.DATETIME,
          editable: false,
          field: "StartTime",
          headerName: "StartTime",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(), 
          isChecked: false
        },
        {
          cellType: constants.DATETIME,
          editable: false,
          field: "EndTime",
          headerName: "EndTime",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "NumberOfResources",
          headerName: "Resource Count",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Duration",
          headerName: "Resource Hours",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "ResourceWorkCenter",
          headerName: "Resource Work Center",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "MainWorkCenter",
          headerName: "Main Work Center",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.TIME,
          editable: false,
          field: "PlannerGroup",
          headerName: "PlannerGroup",
          minWidth: constants.minColumnWidths.WorkType,
          valueFormatter: timeFormatter,
          cellRendererFramework: CellDateRenderer,
          isChecked: false
        },
        {
          cellType: constants.TEXT,
          editable: false,
          field: "OperatingSystemCondition",
          headerName: "Operating System Condition",
          minWidth: constants.minColumnWidths.Text,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig()
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "Type",
          headerName: "Type",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "TimeOffset",
          headerName: "Offset",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig(),
          isChecked: false
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "AssignmentDate",
          headerName: "Assignment Date",
          minWidth: constants.minColumnWidths.WorkType,
          filterFramework: MultiselectFilter,
          cellRendererFramework: CellDateNoTimeRenderer,
          filterConfig: FilterConfig(),
          isChecked: false
        }
      ],
      headerConfig: {
        menu: [
          {
            tooltip: "Assign",
            name: "ADD",
            isVisible: true,
            text: "Assign",
          //  icon: "icon-add-outline",
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
