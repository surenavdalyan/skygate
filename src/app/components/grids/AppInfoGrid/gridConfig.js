import constants from '../constants';
import { identifyRowChanges } from '../../DataGrid/editHelper';

class GridConfig {
  constructor(configuration) {
    const config = configuration || {};
    this.name = 'GridConfiguration';
    this.config = GridConfig.getConfiguration(config);
  }

  static getConfiguration() {
    return GridConfig.getDefaultConfiguration();
  }
  static onCellValueChanged = (params) => {
    identifyRowChanges(params);
  };

  static rowEditableStatus = (params) => {
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
          field: 'Id',
          headerName: 'ID',
          cellClass: 'textalign-center',
          headerClass: 'custom-white-header',
          width: 50,
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: 'Feature Name',
          headerName: 'Feature Name',
          width: 250,
          cellClass: 'textalign-center',
          headerClass: 'custom-white-header',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: 'Short Description',
          headerName: 'Short Description',
          width: 350,
          headerClass: 'custom-white-header',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: 'Detailed Description',
          headerName: 'Detailed Description',
          width: 600,
          headerClass: 'custom-white-header',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: 'Current State',
          headerName: 'Current State',
          width: 150,
          headerClass: 'custom-white-header',
          cellClass: 'textalign-center',
        },
        {
          cellType: constants.STRING,
          editable: false,
          field: 'Other Notes',
          headerName: 'Other Notes',
          width: 250,
          headerClass: 'custom-white-header',
        },
      ],
      enableFilter: false,
      gridName: 'AppInfoGrid',
      entityName: 'AppInfoGrid',
      keyColumn: 'Id',
      rowSelection: 'single',
      title: 'App Info Grid',
      domLayout: 'autoHeight',
      defaultColDef: {
        headerClass: 'grid-header-class',
        cellClass: 'grid-cell-class',
      },
      gridOptions: {},
    };
  }
}
export default GridConfig;
