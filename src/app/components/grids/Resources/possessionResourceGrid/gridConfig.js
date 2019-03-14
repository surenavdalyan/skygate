import constants from "../../../../constants";
import { identifyRowChanges } from "../../../DataGrid/editHelper";
import {
  CellRenderer,
  CellIntNotNullRenderer
} from "../../../DataGrid/cellrenderers/CellRender";
import  CellDateRenderer  from "../../../DataGrid/cellrenderers/cellDateRenderer";
import { CheckBox } from "../../../DataGrid/cellrenderers/helper";
import { timeFormatter } from "../../../DataGrid/helper";
import { styleConfig } from "../../../DataGrid/styles/cellStyles";
import MultiselectFilter from "../../../DataGrid/filter/multiSelectFilter";
import { FilterConfig } from "../../../DataGrid/filter/filterConfig";

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
          field: "ForTest",
          headerName: "Possession Resources",
          minWidth: constants.minColumnWidths.IsLocked,
          cellRendererFramework: CellRenderer,
          cellStyle: styleConfig
        }
      ],
      headerConfig: {
        menu: [
          {
            tooltip: "Export",
            name: "EXPORT",
            isVisible: true,
            icon: "icon-export",
            onClick: "onExport"
          }
        ]
      },
      enableFilter: true,
      gridName: constants.gridNames.PossessionResources,
      entityName: constants.entityNames.PossessionResources,
      keyColumn: "Id",
      rowSelection: "single",
      title: "Possession Resources",
      domLayout: "autoHeight",
    };
  }
}
export default GridConfig;
