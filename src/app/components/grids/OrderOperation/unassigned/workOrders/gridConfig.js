import constants from "../../../../../constants";
import { identifyRowChanges } from "../../../../DataGrid/editHelper";
import CheckBox from "../../../../DataGrid/cellrenderers/helper";
import { timeFormatter } from "../../../../DataGrid/helper";
import {
  CellRenderer,
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
          field: "Description",
          headerName: "Description",
          minWidth: constants.minColumnWidths.StartTime,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig()
        },
        {
          cellType: constants.NUMBER,
          editable: false,
          field: "Priority",
          headerName: "Priority",
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig()
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "EarliestStartDate",
          headerName: "Earliest Start Date",
          minWidth: constants.minColumnWidths.TrackLocationId,
          cellRendererFramework: CellDateNoTimeRenderer,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig()
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "OrderType",
          headerName: "Order Type",
          minWidth: constants.minColumnWidths.TrackLocationId,
          filterFramework: MultiselectFilter,
          filterConfig: FilterConfig()
        }
      ],
      headerConfig: {
        menu: [
          {
            tooltip: "Assign",
            name: "ADD",
            isVisible: true,
          //  icon: "icon-add-outline",
            text: "Assign",
            onClick: "onAssignAction"
          }
        ]
      },
      enableFilter: true,
      gridName: constants.gridNames.workorderGrid,
      entityName: constants.entityNames.workorderGrid,
      keyColumn: "Id",
      rowSelection: "single",
      title: "Work Order Grid"
    };
  }
}
export default GridConfig;
