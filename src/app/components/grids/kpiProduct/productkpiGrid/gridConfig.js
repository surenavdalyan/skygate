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
      columns: [],
      headerConfig: {
        menu: []
      },
      enableFilter: true,
      gridName: constants.gridNames.ProductKpi,
      entityName: "productkpiGrid",
      keyColumn: "Id",
      rowSelection: "single",
      title: "ProductKpi",
      domLayout: 'autoHeight',
    };
  }
}
export default GridConfig;
