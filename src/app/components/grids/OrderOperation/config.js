import constants from "../../../constants/index";

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
      headerConfig: {
        menu: [
          // {
          //   tooltip: "Assigne",
          //   name: "ASSIGNE",
          //   isVisible: true,
          //   icon: "glyphicon-plus",
          //   onClick: "onAssigne"
          // },
          // {
          //   tooltip: "Export",
          //   name: "EXPORT",
          //   isVisible: true,
          //   icon: "icon-export",
          //   onClick: "onExport"
          // },
          // {
          //   tooltip: "Add",
          //   name: "ADD",
          //   isVisible: true,
          //   icon: "icon-add-outline",
          //   onClick: "onAdd"
          // },
          // {
          //   tooltip: "Show Hide Columns",
          //   name: "SHOW_HIDE_COLUMNS",
          //   isVisible: true,
          //   icon: "showHideControl btn-toolbar",
          //   onClick: "onShowHideColumns"
          // },
          // {
          //   tooltip: "Show Grid View",
          //   name: "SHOW_GRID_VIEW",
          //   isVisible: true,
          //   icon: "icon-grid-view",
          //   onClick: "onShowGridView"
          // },
          // {
          //   tooltip: "Show Gantt Chart",
          //   name: "SHOW_GANTT_CHART",
          //   isVisible: true,
          //   icon: "icon-graph",
          //   onClick: "onShowGanttChart"
          // },
          // {
          //   tooltip: "Save Changes",
          //   name: "SAVE_CHANGES",
          //   isVisible: false,
          //   icon: "icon-graph",
          //   onClick: "onSaveChanges"
          // },
          // {
          //   tooltip: "Revert Changes",
          //   name: "REVERT_CHANGES",
          //   isVisible: false,
          //   icon: "icon-graph",
          //   onClick: "onRevertChanges"
          // }
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
