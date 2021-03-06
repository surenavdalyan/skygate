import constants from "../constants";
import { identifyRowChanges } from "../../DataGrid/editHelper";
import Fields from "../../../constants/Fields";
import { timeFormatterMMDDHHmm } from "../../Utils";
import { AssignmentColorMapping } from "../../../constants/ColorPalette";

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
          field: Fields.STAND_ID,
          headerName: "Gate/Stand",
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.ARRIVAL_INFO,
          headerName: "In Flight",
          width: 100,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.SCHEDULED_ARRIVAL_DATETIME,
          headerName: "In Time Scheduled",
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.PROJECTED_ACTUAL_ARRIVAL_TIME,
          headerName: "In Time Projected",
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.ARRIVAL_TYPE,
          headerName: "In Type",
          width: 100,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.DEPARTURE_INFO,
          headerName: "Out Flight",
          width: 100,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.SCHEDULED_DEPARTURE_DATETIME,
          headerName: "Out Time Scheduled",
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.PROJECTED_ACTUAL_DEPARTURE_TIME,
          headerName: "Out Time Projected",
          valueFormatter: timeFormatterMMDDHHmm,
          width: 180,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.DEPARTURE_TYPE,
          headerName: "Out Type",
          width: 100,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.EQUIPMENT_TYPE,
          headerName: "Aircraft Type",
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: Fields.BUFFER,
          headerName: "Buffer",
          width: 100,
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: "",
          headerName: "Notes",
          cellClass: "textalign-center",
          headerClass: "textalign-center"
        }
      ],
      enableFilter: false,
      gridName: "StandsAssignmentData",
      entityName: "StandsAssignment",
      keyColumn: "Id",
      rowSelection: "single",
      title: "Stands Assignment Data",
      domLayout: "autoHeight",
      defaultColDef: {
        width: 150,
        headerClass: "grid-header-class",
        cellClass: "grid-cell-class"
      },
      gridOptions: {
        getRowClass(params) {
          if (!params.node.data[Fields.FILTERED_STATE]) {
            return "shaded-rows";
          }
          return "";
        }
      }
    };
  }
}
export default GridConfig;
